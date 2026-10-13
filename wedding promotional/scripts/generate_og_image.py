import os
from PIL import Image, ImageDraw, ImageFont

base_dir = r'c:\Users\dell\Desktop\Sylver\CODE PROJECTS\Nextjs Projects\ensorb'
img_path = os.path.join(base_dir, 'public', 'couple', 'IMG_6500.PNG')
out_og_path = os.path.join(base_dir, 'public', 'og-image.jpg')
out_direct_path = os.path.join(base_dir, 'public', 'couple', 'IMG_6500-preview.jpg')

src = Image.open(img_path).convert('RGB')

# 1. Direct optimized version of IMG_6500 (under 200KB for WhatsApp)
w, h = src.size
scale = 1200 / max(w, h)
direct_resized = src.resize((int(w * scale), int(h * scale)), Image.Resampling.LANCZOS)
direct_resized.save(out_direct_path, 'JPEG', quality=85, optimize=True)
print(f"Direct preview created: {os.path.getsize(out_direct_path):,} bytes")

# 2. Gold standard 1200x630 OpenGraph Banner
OG_W, OG_H = 1200, 630
canvas = Image.new('RGB', (OG_W, OG_H), (24, 7, 14)) # Dark rich burgundy / obsidian

# Background luxury radial gradient
draw = ImageDraw.Draw(canvas)
center_x, center_y = 300, 315
for r in range(500, 0, -25):
    alpha = int(45 * (1 - r / 500))
    color = (24 + int(alpha * 1.5), 7 + int(alpha * 0.4), 14 + int(alpha * 0.8))
    draw.ellipse([center_x - r, center_y - r, center_x + r, center_y + r], fill=color)

# Crop & place couple photo on the right half
crop_top = 80
crop_bottom = 1250
crop_h = crop_bottom - crop_top
crop_w = int(crop_h * (560 / 630))
crop_left = (src.width - crop_w) // 2
couple_crop = src.crop((crop_left, crop_top, crop_left + crop_w, crop_bottom))
couple_crop = couple_crop.resize((560, 630), Image.Resampling.LANCZOS)

# Paste on right
canvas.paste(couple_crop, (640, 0))

# Soft gradient fade between left text area and right photo
gradient_overlay = Image.new('RGBA', (260, 630), (0, 0, 0, 0))
draw_grad = ImageDraw.Draw(gradient_overlay)
for x in range(260):
    a = int(255 * (1 - (x / 260)**1.2))
    draw_grad.line([(x, 0), (x, 630)], fill=(24, 7, 14, a))
canvas.paste(gradient_overlay, (640, 0), gradient_overlay)

# Thin gold luxury divider
draw.line([(640, 60), (640, 570)], fill=(212, 175, 55, 90), width=1)

# Typography on Left
# Monogram / Date pill
draw.rounded_rectangle([70, 75, 330, 115], radius=20, fill=(45, 14, 25), outline=(212, 175, 55, 120), width=1)
font_sm = ImageFont.truetype('arialbd.ttf', 15)
draw.text((88, 87), 'THE WEDDING CELEBRATION', font=font_sm, fill=(245, 215, 160))

# Couple Names
font_title = ImageFont.truetype('georgia.ttf', 54)
draw.text((70, 150), 'Ngozi & Sorbari', font=font_title, fill=(255, 255, 255))

# Subtitle
font_script = ImageFont.truetype('georgia.ttf', 26)
draw.text((72, 230), 'Our Unending Love Story', font=font_script, fill=(240, 200, 210))

# Gold divider
draw.line([(72, 285), (280, 285)], fill=(212, 175, 55, 180), width=2)

# Date & Location Details
font_details = ImageFont.truetype('arial.ttf', 20)
draw.text((72, 320), 'Saturday, November 21, 2026', font=font_details, fill=(245, 245, 245))
draw.text((72, 360), 'Christ Embassy Ogba 1, Lagos, Nigeria', font=font_details, fill=(230, 230, 230))
draw.text((72, 400), 'Colors: Burgundy • Blush • Mint • Olive', font=font_details, fill=(210, 210, 210))

# Bottom badge
draw.rounded_rectangle([70, 480, 380, 540], radius=14, fill=(212, 175, 55, 35), outline=(212, 175, 55, 180), width=1)
font_badge = ImageFont.truetype('arialbd.ttf', 17)
draw.text((95, 499), 'Official Wedding Portal  •  RSVP Pass', font=font_badge, fill=(255, 235, 180))

canvas.save(out_og_path, 'JPEG', quality=88, optimize=True)
print(f"1200x630 OpenGraph Banner created: {os.path.getsize(out_og_path):,} bytes")

# Also copy to app/opengraph-image.jpg and app/twitter-image.jpg for Next.js auto metadata
app_og = os.path.join(base_dir, 'app', 'opengraph-image.jpg')
app_tw = os.path.join(base_dir, 'app', 'twitter-image.jpg')
canvas.save(app_og, 'JPEG', quality=88, optimize=True)
canvas.save(app_tw, 'JPEG', quality=88, optimize=True)
print("Saved app/opengraph-image.jpg and app/twitter-image.jpg successfully!")
