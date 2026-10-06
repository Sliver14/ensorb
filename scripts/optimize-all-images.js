const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

const PUBLIC_DIR = path.join(__dirname, '..', 'public')

async function copyHoneymoonPhoto() {
  const source = path.join(PUBLIC_DIR, 'images (2).jpg')
  const dest = path.join(PUBLIC_DIR, 'gifts', 'honeymoon-fund.jpg')
  if (fs.existsSync(source)) {
    console.log('Found source honeymoon image:', source)
    await sharp(source)
      .resize({ width: 1200, height: 900, fit: 'cover', position: 'center' })
      .jpeg({ quality: 85, mozjpeg: true })
      .toFile(dest)
    console.log('✓ Successfully created optimized /gifts/honeymoon-fund.jpg')
  } else {
    console.warn('Source honeymoon image not found at', source)
  }
}

async function getAllImageFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir)
  for (const file of files) {
    const fullPath = path.join(dir, file)
    const stat = fs.statSync(fullPath)
    if (stat.isDirectory()) {
      if (!file.startsWith('.') && file !== 'node_modules') {
        getAllImageFiles(fullPath, fileList)
      }
    } else {
      const ext = path.extname(file).toLowerCase()
      if (['.png', '.jpg', '.jpeg', '.webp'].includes(ext)) {
        fileList.push(fullPath)
      }
    }
  }
  return fileList
}

async function optimizeImages() {
  console.log('\n--- STEP 1: Copying and setting up honeymoon image ---')
  await copyHoneymoonPhoto()

  console.log('\n--- STEP 2: Scanning all images in public/ ---')
  const images = await getAllImageFiles(PUBLIC_DIR)
  console.log(`Found ${images.length} images to inspect and optimize.\n`)

  let totalOldBytes = 0
  let totalNewBytes = 0

  for (const imgPath of images) {
    const relPath = path.relative(PUBLIC_DIR, imgPath)
    const statBefore = fs.statSync(imgPath)
    const oldSizeKB = (statBefore.size / 1024).toFixed(1)
    totalOldBytes += statBefore.size

    // Skip small icons/placeholders (< 30KB)
    if (statBefore.size < 30 * 1024 && !imgPath.includes('honeymoon')) {
      console.log(`- Skipping small asset: ${relPath} (${oldSizeKB} KB)`)
      totalNewBytes += statBefore.size
      continue
    }

    try {
      const tempPath = imgPath + '.tmp.opt'
      const image = sharp(imgPath)
      const meta = await image.metadata()

      const maxDimension = 1600
      let pipeline = sharp(imgPath).rotate() // preserve EXIF orientation

      if (meta.width > maxDimension || meta.height > maxDimension) {
        pipeline = pipeline.resize({
          width: meta.width >= meta.height ? maxDimension : undefined,
          height: meta.height > meta.width ? maxDimension : undefined,
          fit: 'inside',
          withoutEnlargement: true
        })
      }

      if (imgPath.endsWith('.png')) {
        // High quality PNG with compression
        await pipeline
          .png({ quality: 85, compressionLevel: 9, palette: true })
          .toFile(tempPath)
      } else {
        // High quality MozJPEG for JPG / JPEG
        await pipeline
          .jpeg({ quality: 82, mozjpeg: true, progressive: true })
          .toFile(tempPath)
      }

      const statAfter = fs.statSync(tempPath)
      // Only replace if new size is smaller or reasonable
      if (statAfter.size < statBefore.size) {
        fs.unlinkSync(imgPath)
        fs.renameSync(tempPath, imgPath)
        const newSizeKB = (statAfter.size / 1024).toFixed(1)
        const savingsPct = (((statBefore.size - statAfter.size) / statBefore.size) * 100).toFixed(1)
        console.log(`✓ Optimized: ${relPath} | ${oldSizeKB} KB → ${newSizeKB} KB (-${savingsPct}%)`)
        totalNewBytes += statAfter.size
      } else {
        fs.unlinkSync(tempPath)
        console.log(`= Kept original: ${relPath} (${oldSizeKB} KB)`)
        totalNewBytes += statBefore.size
      }
    } catch (err) {
      console.error(`✕ Error optimizing ${relPath}:`, err.message)
      totalNewBytes += statBefore.size
    }
  }

  const oldMB = (totalOldBytes / (1024 * 1024)).toFixed(2)
  const newMB = (totalNewBytes / (1024 * 1024)).toFixed(2)
  const savedMB = ((totalOldBytes - totalNewBytes) / (1024 * 1024)).toFixed(2)
  const totalSavingsPct = (((totalOldBytes - totalNewBytes) / totalOldBytes) * 100).toFixed(1)

  console.log('\n======================================================')
  console.log(`TOTAL BEFORE: ${oldMB} MB`)
  console.log(`TOTAL AFTER:  ${newMB} MB`)
  console.log(`TOTAL SAVED:  ${savedMB} MB (${totalSavingsPct}% reduction!)`)
  console.log('======================================================\n')
}

optimizeImages().catch(console.error)
