import { getDb, ensureGiftTables, GiftRecord, GiftContribution, GiftAdminStats } from './db'
import { registryGifts, WishlistItem } from './data'
import { promises as fs } from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const LOCAL_GIFTS_FILE = path.join(DATA_DIR, 'gifts.json')
const LOCAL_CONTRIBS_FILE = path.join(DATA_DIR, 'gift_contributions.json')

// Local in-memory / file fallback storage for offline resilience
async function getLocalGifts(): Promise<GiftRecord[]> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
    const data = await fs.readFile(LOCAL_GIFTS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    const initial: GiftRecord[] = registryGifts.map((g) => ({
      id: g.id,
      title: g.title,
      price: g.price,
      numericPrice: g.numericPrice,
      category: g.category,
      categoryLabel: g.categoryLabel,
      image: g.image,
      description: g.description,
      featured: !!g.featured,
      contributedAmount: g.contributedAmount,
      contributorCount: g.contributorCount,
      isFullyGifted: !!g.isFullyGifted,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }))
    await fs.writeFile(LOCAL_GIFTS_FILE, JSON.stringify(initial, null, 2), 'utf-8')
    return initial
  }
}

async function saveLocalGifts(gifts: GiftRecord[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true })
  await fs.writeFile(LOCAL_GIFTS_FILE, JSON.stringify(gifts, null, 2), 'utf-8')
}

async function getLocalContributions(): Promise<GiftContribution[]> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
    const data = await fs.readFile(LOCAL_CONTRIBS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

async function saveLocalContributions(contribs: GiftContribution[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true })
  await fs.writeFile(LOCAL_CONTRIBS_FILE, JSON.stringify(contribs, null, 2), 'utf-8')
}

// ----------------------------------------------------------------------------
// Public API Methods
// ----------------------------------------------------------------------------

export async function getAllGifts(): Promise<GiftRecord[]> {
  const sql = getDb()
  if (sql) {
    try {
      await ensureGiftTables()
      const rows = await sql`
        SELECT 
          id,
          title,
          price,
          numeric_price as "numericPrice",
          category,
          category_label as "categoryLabel",
          image,
          description,
          featured,
          contributed_amount as "contributedAmount",
          contributor_count as "contributorCount",
          is_fully_gifted as "isFullyGifted",
          created_at as "createdAt",
          updated_at as "updatedAt"
        FROM gifts 
        ORDER BY featured DESC, numeric_price DESC;
      `
      return rows as unknown as GiftRecord[]
    } catch (err) {
      console.error('Error fetching gifts from Neon DB:', err)
    }
  }

  return getLocalGifts()
}

export async function getGiftById(giftId: string): Promise<GiftRecord | null> {
  const sql = getDb()
  if (sql) {
    try {
      await ensureGiftTables()
      const rows = await sql`
        SELECT 
          id,
          title,
          price,
          numeric_price as "numericPrice",
          category,
          category_label as "categoryLabel",
          image,
          description,
          featured,
          contributed_amount as "contributedAmount",
          contributor_count as "contributorCount",
          is_fully_gifted as "isFullyGifted",
          created_at as "createdAt",
          updated_at as "updatedAt"
        FROM gifts 
        WHERE id = ${giftId}
        LIMIT 1;
      `
      if (rows && rows.length > 0) {
        return rows[0] as unknown as GiftRecord
      }
      return null
    } catch (err) {
      console.error('Error fetching gift by ID from Neon DB:', err)
    }
  }

  const local = await getLocalGifts()
  return local.find((g) => g.id === giftId) || null
}

export interface CreateContributionInput {
  giftId?: string | null
  giftTitle: string
  contributorName: string
  contributorEmail?: string | null
  contributorPhone?: string | null
  amount: number
  paymentReference?: string | null
  customNote?: string | null
}

export async function recordGiftContribution(
  input: CreateContributionInput
): Promise<GiftContribution> {
  const id = `contrib-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
  const paymentReference =
    input.paymentReference?.trim() ||
    `REF-GIFT-${Math.floor(100000 + Math.random() * 900000)}`
  const now = new Date().toISOString()

  const contribution: GiftContribution = {
    id,
    giftId: input.giftId || null,
    giftTitle: input.giftTitle,
    contributorName: input.contributorName.trim(),
    contributorEmail: input.contributorEmail?.trim() || null,
    contributorPhone: input.contributorPhone?.trim() || null,
    amount: Number(input.amount) || 0,
    paymentReference,
    customNote: input.customNote?.trim() || null,
    status: 'pending',
    createdAt: now,
    confirmedAt: null,
    confirmedBy: null,
  }

  const sql = getDb()
  if (sql) {
    try {
      await ensureGiftTables()
      await sql`
        INSERT INTO gift_contributions (
          id, gift_id, gift_title, contributor_name, contributor_email, contributor_phone,
          amount, payment_reference, custom_note, status, created_at
        ) VALUES (
          ${contribution.id},
          ${contribution.giftId},
          ${contribution.giftTitle},
          ${contribution.contributorName},
          ${contribution.contributorEmail},
          ${contribution.contributorPhone},
          ${contribution.amount},
          ${contribution.paymentReference},
          ${contribution.customNote},
          'pending',
          ${contribution.createdAt}
        );
      `
      return contribution
    } catch (err) {
      console.error('Error recording contribution to Neon DB:', err)
    }
  }

  // Fallback to local
  const contribs = await getLocalContributions()
  contribs.unshift(contribution)
  await saveLocalContributions(contribs)
  return contribution
}

export async function getAllContributions(): Promise<GiftContribution[]> {
  const sql = getDb()
  if (sql) {
    try {
      await ensureGiftTables()
      const rows = await sql`
        SELECT 
          id,
          gift_id as "giftId",
          gift_title as "giftTitle",
          contributor_name as "contributorName",
          contributor_email as "contributorEmail",
          contributor_phone as "contributorPhone",
          amount,
          payment_reference as "paymentReference",
          custom_note as "customNote",
          status,
          created_at as "createdAt",
          confirmed_at as "confirmedAt",
          confirmed_by as "confirmedBy"
        FROM gift_contributions
        ORDER BY created_at DESC;
      `
      return rows as unknown as GiftContribution[]
    } catch (err) {
      console.error('Error fetching contributions from Neon DB:', err)
    }
  }

  return getLocalContributions()
}

export async function confirmGiftContribution(
  contributionId: string,
  confirmedBy: string = 'Admin'
): Promise<{ contribution: GiftContribution; updatedGift?: GiftRecord | null }> {
  const now = new Date().toISOString()
  const sql = getDb()

  if (sql) {
    try {
      await ensureGiftTables()

      // 1. Fetch contribution
      const rows = await sql`
        SELECT 
          id,
          gift_id as "giftId",
          gift_title as "giftTitle",
          contributor_name as "contributorName",
          contributor_email as "contributorEmail",
          contributor_phone as "contributorPhone",
          amount,
          payment_reference as "paymentReference",
          custom_note as "customNote",
          status,
          created_at as "createdAt",
          confirmed_at as "confirmedAt",
          confirmed_by as "confirmedBy"
        FROM gift_contributions
        WHERE id = ${contributionId}
        LIMIT 1;
      `

      if (!rows || rows.length === 0) {
        throw new Error('Contribution not found')
      }

      const contrib = rows[0] as unknown as GiftContribution
      const prevStatus = contrib.status

      // 2. Update contribution status
      await sql`
        UPDATE gift_contributions
        SET status = 'confirmed', confirmed_at = ${now}, confirmed_by = ${confirmedBy}
        WHERE id = ${contributionId};
      `

      contrib.status = 'confirmed'
      contrib.confirmedAt = now
      contrib.confirmedBy = confirmedBy

      let updatedGift: GiftRecord | null = null

      // 3. Update gift progress if not previously confirmed and has giftId
      if (prevStatus !== 'confirmed' && contrib.giftId) {
        const giftRows = await sql`
          SELECT 
            id,
            title,
            price,
            numeric_price as "numericPrice",
            category,
            category_label as "categoryLabel",
            image,
            description,
            featured,
            contributed_amount as "contributedAmount",
            contributor_count as "contributorCount",
            is_fully_gifted as "isFullyGifted"
          FROM gifts
          WHERE id = ${contrib.giftId}
          LIMIT 1;
        `

        if (giftRows && giftRows.length > 0) {
          const currentGift = giftRows[0] as unknown as GiftRecord
          const newContributedAmount = Number(currentGift.contributedAmount) + Number(contrib.amount)
          const newContributorCount = Number(currentGift.contributorCount) + 1
          const isFullyGifted = newContributedAmount >= Number(currentGift.numericPrice)

          await sql`
            UPDATE gifts
            SET 
              contributed_amount = ${newContributedAmount},
              contributor_count = ${newContributorCount},
              is_fully_gifted = ${isFullyGifted},
              updated_at = ${now}
            WHERE id = ${contrib.giftId};
          `

          updatedGift = {
            ...currentGift,
            contributedAmount: newContributedAmount,
            contributorCount: newContributorCount,
            isFullyGifted,
          }
        }
      }

      return { contribution: contrib, updatedGift }
    } catch (err) {
      console.error('Error confirming contribution in Neon DB:', err)
    }
  }

  // Fallback to local
  const contribs = await getLocalContributions()
  const idx = contribs.findIndex((c) => c.id === contributionId)
  if (idx === -1) throw new Error('Contribution not found')

  const contrib = contribs[idx]
  const prevStatus = contrib.status
  contrib.status = 'confirmed'
  contrib.confirmedAt = now
  contrib.confirmedBy = confirmedBy
  await saveLocalContributions(contribs)

  let updatedGift: GiftRecord | null = null
  if (prevStatus !== 'confirmed' && contrib.giftId) {
    const gifts = await getLocalGifts()
    const giftIdx = gifts.findIndex((g) => g.id === contrib.giftId)
    if (giftIdx !== -1) {
      const g = gifts[giftIdx]
      g.contributedAmount += contrib.amount
      g.contributorCount += 1
      g.isFullyGifted = g.contributedAmount >= g.numericPrice
      g.updatedAt = now
      await saveLocalGifts(gifts)
      updatedGift = g
    }
  }

  return { contribution: contrib, updatedGift }
}

export async function declineGiftContribution(
  contributionId: string
): Promise<GiftContribution> {
  const sql = getDb()
  if (sql) {
    try {
      await ensureGiftTables()
      await sql`
        UPDATE gift_contributions
        SET status = 'declined'
        WHERE id = ${contributionId};
      `
      const rows = await sql`SELECT * FROM gift_contributions WHERE id = ${contributionId} LIMIT 1;`
      return rows[0] as unknown as GiftContribution
    } catch (err) {
      console.error('Error declining contribution in Neon DB:', err)
    }
  }

  const contribs = await getLocalContributions()
  const c = contribs.find((item) => item.id === contributionId)
  if (c) {
    c.status = 'declined'
    await saveLocalContributions(contribs)
    return c
  }
  throw new Error('Contribution not found')
}

export async function deleteGiftContribution(
  contributionId: string
): Promise<boolean> {
  const sql = getDb()
  if (sql) {
    try {
      await ensureGiftTables()
      await sql`DELETE FROM gift_contributions WHERE id = ${contributionId};`
      return true
    } catch (err) {
      console.error('Error deleting contribution in Neon DB:', err)
    }
  }

  let contribs = await getLocalContributions()
  contribs = contribs.filter((c) => c.id !== contributionId)
  await saveLocalContributions(contribs)
  return true
}

export async function getGiftAdminStats(): Promise<GiftAdminStats> {
  const gifts = await getAllGifts()
  const contributions = await getAllContributions()

  const totalRegistryValue = gifts.reduce((acc, g) => acc + Number(g.numericPrice || 0), 0)
  const totalConfirmedAmount = contributions
    .filter((c) => c.status === 'confirmed')
    .reduce((acc, c) => acc + Number(c.amount || 0), 0)
  const totalPendingAmount = contributions
    .filter((c) => c.status === 'pending')
    .reduce((acc, c) => acc + Number(c.amount || 0), 0)

  const pendingCount = contributions.filter((c) => c.status === 'pending').length
  const confirmedCount = contributions.filter((c) => c.status === 'confirmed').length
  const fullyGiftedCount = gifts.filter((g) => g.isFullyGifted).length
  const totalItemsCount = gifts.length

  return {
    totalRegistryValue,
    totalConfirmedAmount,
    totalPendingAmount,
    pendingCount,
    confirmedCount,
    fullyGiftedCount,
    totalItemsCount,
  }
}

export async function resetAllGiftsAndContributions(): Promise<{ success: boolean; message: string }> {
  const sql = getDb()
  if (sql) {
    try {
      await ensureGiftTables()
      // 1. Delete all contribution records
      await sql`DELETE FROM gift_contributions;`
      // 2. Reset all gifts progress to 0
      await sql`
        UPDATE gifts
        SET 
          contributed_amount = 0,
          contributor_count = 0,
          is_fully_gifted = false,
          updated_at = NOW();
      `
    } catch (err) {
      console.error('Error resetting gifts in Neon DB:', err)
    }
  }

  // Also reset local file cache
  const initial: GiftRecord[] = registryGifts.map((g) => ({
    id: g.id,
    title: g.title,
    price: g.price,
    numericPrice: g.numericPrice,
    category: g.category,
    categoryLabel: g.categoryLabel,
    image: g.image,
    description: g.description,
    featured: !!g.featured,
    contributedAmount: 0,
    contributorCount: 0,
    isFullyGifted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }))
  await saveLocalGifts(initial)
  await saveLocalContributions([])

  return { success: true, message: 'Gift registry data and contributions have been reset to 0.' }
}

