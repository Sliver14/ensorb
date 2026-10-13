import os
from PIL import Image, ImageDraw, ImageFont

base_dir = r'c:\Users\dell\Desktop\Sylver\CODE PROJECTS\Nextjs Projects\ensorb'
img_path = os.path.join(base_dir, 'public', 'couple', 'IMG_6500.PNG')
out_og_jpeg = os.path.join(base_dir, 'public', 'couple/IMG_6500.jpeg')
out_og_jpg = os.path.join(base_dir, 'public', 'og-image.jpg')
out_og_png = os.path.join(base_dir, 'public', 'og-image.png')
out_direct_path = os.path.join(base_dir, 'public', 'couple', 'IMG_6500-preview.jpg')

src = Image.open(img_path).convert('RGB')
w, h = src.size

# 1. Direct optimized square/portrait version of IMG_6500 (under 200KB for direct links)
scale = 1200 / max(w, h)
direct_resized = src.resize((int(w * scale), int(h * scale)), Image.Resampling.LANCZOS)
direct_resized.save(out_direct_path, 'JPEG', quality=85, optimize=True)
print(f"Direct preview created: {os.path.getsize(out_direct_path):,} bytes")

# 2. Perfect 1200x630 OpenGraph & Twitter Large Preview Banner
OG_W, OG_H = 1200, 630
canvas = Image.new('RGB', (OG_W, OG_H), (28, 8, 16)) # Deep royal burgundy

# Background luxury radial gradient for left text area
draw = ImageDraw.Draw(canvas)
center_x, center_y = 280, 315
for r in range(480, 0, -20):
    alpha = int(40 * (1 - r / 480))
    color = (28 + int(alpha * 1.8), 8 + int(alpha * 0.4), 16 + int(alpha * 0.9))
    draw.ellipse([center_x - r, center_y - r, center_x + r, center_y + r], fill=color)

# Crop & size couple photo to preserve both Sorbari, Ngozi, and the engagement ring
target_photo_w = 650
target_photo_h = 630
crop_top = 45
crop_bottom = 1166
couple_crop = src.crop((0, crop_top, 1121, crop_bottom))
couple_crop = couple_crop.resize((target_photo_w, target_photo_h), Image.Resampling.LANCZOS)

# Create a smooth Hermite cubic fade across the left 90px margin only (so Sorbari is 100% visible and unshadowed)
feather = Image.new('L', (target_photo_w, target_photo_h), 255)
f_draw = ImageDraw.Draw(feather)
for x in range(90):
    t = x / 90.0
    smooth_t = t * t * (3 - 2 * t)
    val = int(255 * smooth_t)
    f_draw.line([(x, 0), (x, target_photo_h)], fill=val)

canvas.paste(couple_crop, (OG_W - target_photo_w, 0), feather)

# Typography on Left
# Monogram / Date pill
draw.rounded_rectangle([65, 68, 335, 106], radius=19, fill=(52, 16, 30), outline=(212, 175, 55, 140), width=1)
font_sm = ImageFont.truetype('arialbd.ttf', 14)
draw.text((83, 80), 'THE WEDDING CELEBRATION', font=font_sm, fill=(245, 215, 160))

# Couple Names
font_title = ImageFont.truetype('georgia.ttf', 52)
draw.text((65, 140), 'Ngozi & Sorbari', font=font_title, fill=(255, 255, 255))

# Subtitle
font_script = ImageFont.truetype('georgia.ttf', 24)
draw.text((67, 220), 'Our Unending Love Story', font=font_script, fill=(240, 200, 210))

# Gold divider
draw.line([(67, 275), (285, 275)], fill=(212, 175, 55, 180), width=2)

# Date & Location Details
font_details = ImageFont.truetype('arial.ttf', 19)
draw.text((67, 310), 'Saturday, November 21, 2026', font=font_details, fill=(245, 245, 245))
draw.text((67, 350), 'Christ Embassy Ogba 1, Lagos, Nigeria', font=font_details, fill=(230, 230, 230))
draw.text((67, 390), 'Palette: Burgundy • Blush • Mint • Olive', font=font_details, fill=(210, 210, 210))

# Bottom badge
draw.rounded_rectangle([65, 480, 395, 540], radius=14, fill=(212, 175, 55, 35), outline=(212, 175, 55, 180), width=1)
font_badge = ImageFont.truetype('arialbd.ttf', 16)
draw.text((87, 500), 'Official Wedding Portal  •  RSVP Pass', font=font_badge, fill=(255, 235, 180))

# Save the primary URL preview image: IMG_6500.jpeg
canvas.save(out_og_jpeg, 'JPEG', quality=90, optimize=True)
print(f"1200x630 URL preview image (IMG_6500.jpeg) created: {os.path.getsize(out_og_jpeg):,} bytes")

# Also save og-image.jpg and og-image.png for backwards compatibility
canvas.save(out_og_jpg, 'JPEG', quality=90, optimize=True)
canvas.save(out_og_png, 'PNG', optimize=True)
print("Saved og-image.jpg and og-image.png successfully!")
