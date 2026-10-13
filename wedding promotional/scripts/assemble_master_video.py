import os
import subprocess
import numpy as np
from PIL import Image, ImageFont, ImageDraw

ffmpeg_path = r'C:\Users\dell\AppData\Local\Programs\Python\Python312\Lib\site-packages\imageio_ffmpeg\binaries\ffmpeg-win-x86_64-v7.1.exe'
base_dir = r'c:\Users\dell\Desktop\Sylver\CODE PROJECTS\Nextjs Projects\ensorb\wedding promotional'
rec_dir = os.path.join(base_dir, 'screen_recordings')
mot_dir = os.path.join(base_dir, 'motion_graphics')
vo_file = os.path.join(base_dir, 'voiceover', 'voiceover_full.mp3')
out_clean_mp4 = os.path.join(base_dir, 'InsightNovaTech_Wedding_Showcase_Clean.mp4')
out_captioned_mp4 = os.path.join(base_dir, 'InsightNovaTech_Wedding_Showcase_Captioned.mp4')

TARGET_W = 1080
TARGET_H = 1920
FPS = 24
TOTAL_DURATION = 56.6
TOTAL_FRAMES = int(TOTAL_DURATION * FPS)

print(f"Generating Master Video: {TARGET_W}x{TARGET_H} @ {FPS}fps, Total Frames: {TOTAL_FRAMES}...")

# Load Fonts
font_serif_lg = ImageFont.truetype('georgia.ttf', 56)
font_serif_md = ImageFont.truetype('georgia.ttf', 44)
font_sans_bold = ImageFont.truetype('arialbd.ttf', 32)
font_sans_sm = ImageFont.truetype('arial.ttf', 24)
font_captions = ImageFont.truetype('arialbd.ttf', 38)

# Pre-render Backgrounds
# Elegant Burgundy / Deep Plum Radial Gradient
bg_burgundy = Image.new('RGB', (TARGET_W, TARGET_H), (10, 4, 8))
draw_bg = ImageDraw.Draw(bg_burgundy)
for r in range(800, 0, -20):
    alpha = int(45 * (1 - r / 800))
    color = (min(255, 10 + int(alpha * 1.8)), min(255, 4 + int(alpha * 0.4)), min(255, 8 + int(alpha * 0.9)))
    draw_bg.ellipse([(TARGET_W//2 - r, 750 - r), (TARGET_W//2 + r, 750 + r)], fill=color)

# Subtitle cues (time in seconds -> text)
subtitles_data = [
    (0.0, 4.8, "What if your wedding website could do more than share the date and venue?"),
    (4.8, 14.8, "For this project, I built a personalized wedding website designed to bring the couple's story and their guests' experience together."),
    (14.8, 23.5, "From the couple's love story and wedding details to a dedicated Aso Ebi color guide, every section has a purpose."),
    (23.5, 31.8, "Guests can explore the gift registry, receive their invitations by email, and RSVP online."),
    (31.8, 39.8, "It's more than a beautiful design. It's a practical digital experience tailored to a special occasion."),
    (39.8, 47.0, "At InsightNovaTech, we build websites and digital solutions around real needs."),
    (47.0, 52.0, "Planning a wedding, launching a business, or looking to bring your idea online?"),
    (52.0, 56.6, "Let's build something exceptional. Send us a message today.")
]

# Helper to read frames from video file
def extract_video_frames(video_path, max_frames=None, target_size=None):
    if not os.path.exists(video_path):
        print(f"Warning: {video_path} not found!")
        return []
    cmd = [
        ffmpeg_path, '-i', video_path,
        '-f', 'image2pipe',
        '-pix_fmt', 'rgb24',
        '-vcodec', 'rawvideo', '-'
    ]
    # Get video dimension first
    info_cmd = [ffmpeg_path, '-i', video_path]
    res = subprocess.run(info_cmd, stderr=subprocess.PIPE, stdout=subprocess.PIPE)
    lines = [l for l in res.stderr.decode('utf-8', errors='replace').split('\n') if 'Video:' in l]
    w, h = 626, 996
    if lines:
        parts = lines[0].split(',')
        for p in parts:
            if 'x' in p and not 'max' in p:
                toks = p.strip().split(' ')[0].split('x')
                if len(toks) == 2 and toks[0].isdigit() and toks[1].isdigit():
                    w, h = int(toks[0]), int(toks[1])
                    break
    
    proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL)
    frame_size = w * h * 3
    frames = []
    while True:
        raw = proc.stdout.read(frame_size)
        if len(raw) < frame_size:
            break
        img = Image.frombytes('RGB', (w, h), raw)
        if target_size:
            img = img.resize(target_size, Image.Resampling.LANCZOS)
        frames.append(img)
        if max_frames and len(frames) >= max_frames:
            break
    proc.stdout.close()
    proc.wait()
    return frames

# Cache video clips
print("Extracting frames from source videos...")
phone_target_size = (620, 986)
frames_scene1_hook = extract_video_frames(os.path.join(mot_dir, 'scene1_hook_intro.mp4'), target_size=(TARGET_W, TARGET_H))
frames_scene2_home = extract_video_frames(os.path.join(rec_dir, 'scene2_homepage_mobile.mp4'), target_size=phone_target_size)
frames_scene3_asoebi = extract_video_frames(os.path.join(rec_dir, 'scene3_asoebi_guide.mp4'), target_size=phone_target_size)
frames_scene4_registry = extract_video_frames(os.path.join(rec_dir, 'scene4_gift_registry.mp4'), target_size=phone_target_size)
frames_scene5_rsvp = extract_video_frames(os.path.join(rec_dir, 'scene5_rsvp_invitations.mp4'), target_size=phone_target_size)
frames_scene6_montage = extract_video_frames(os.path.join(mot_dir, 'scene6_summary_motion.mp4'), target_size=(TARGET_W, TARGET_H))
frames_scene7_logo = extract_video_frames(os.path.join(mot_dir, 'scene7_logo_reveal.mp4'), target_size=(TARGET_W, TARGET_H))

print(f"Loaded: Scene1={len(frames_scene1_hook)}, Scene2={len(frames_scene2_home)}, Scene3={len(frames_scene3_asoebi)}, Scene4={len(frames_scene4_registry)}, Scene5={len(frames_scene5_rsvp)}, Scene6={len(frames_scene6_montage)}, Scene7={len(frames_scene7_logo)}")

# Pre-build phone bezel template
phone_bezel = Image.new('RGBA', (phone_target_size[0] + 32, phone_target_size[1] + 32), (0, 0, 0, 0))
draw_bezel = ImageDraw.Draw(phone_bezel)
draw_bezel.rounded_rectangle([0, 0, phone_bezel.width, phone_bezel.height], radius=44, fill=(15, 15, 18, 255), outline=(50, 50, 58, 255), width=6)
# Notch
draw_bezel.rounded_rectangle([phone_bezel.width//2 - 60, 14, phone_bezel.width//2 + 60, 36], radius=11, fill=(0, 0, 0, 255))

# Composite phone screen into frame
def composite_phone_scene(screen_frame, headline_text, sub_badge, top_swatches=False):
    canvas = bg_burgundy.copy()
    draw = ImageDraw.Draw(canvas)
    
    # Top Badge
    badge_w, badge_h = 360, 48
    badge_x = (TARGET_W - badge_w) // 2
    badge_y = 100
    draw.rounded_rectangle([badge_x, badge_y, badge_x + badge_w, badge_y + badge_h], radius=24, fill=(255, 255, 255, 20), outline=(255, 215, 225, 60), width=1)
    draw.ellipse([badge_x + 18, badge_y + 19, badge_x + 30, badge_y + 31], fill=(255, 105, 180))
    draw.text((badge_x + 44, badge_y + 11), sub_badge.upper(), font=font_sans_bold, fill=(255, 220, 230))
    
    # Headline
    # Draw centered
    bbox = draw.textbbox((0, 0), headline_text, font=font_serif_lg)
    text_w = bbox[2] - bbox[0]
    draw.text(((TARGET_W - text_w) // 2, 175), headline_text, font=font_serif_lg, fill=(255, 255, 255))
    
    # Optional Swatches
    start_phone_y = 280
    if top_swatches:
        swatches = [
            ("#722F37", "Burgundy"),
            ("#E8C5C8", "Blush Pink"),
            ("#A8C3B1", "Mint Green"),
            ("#606C38", "Olive Green")
        ]
        swatch_x = 160
        for color, name in swatches:
            draw.rounded_rectangle([swatch_x, 260, swatch_x + 175, 305], radius=22, fill=(255, 255, 255, 18), outline=(255, 255, 255, 40))
            draw.ellipse([swatch_x + 8, 267, swatch_x + 38, 297], fill=color, outline=(255, 255, 255, 150))
            draw.text((swatch_x + 46, 272), name, font=font_sans_sm, fill=(245, 245, 245))
            swatch_x += 190
        start_phone_y = 330
    
    # Center Phone
    phone_x = (TARGET_W - (phone_target_size[0] + 32)) // 2
    phone_y = start_phone_y + 40
    
    # Paste bezel
    canvas.paste(phone_bezel, (phone_x, phone_y), phone_bezel)
    # Paste screen content
    canvas.paste(screen_frame, (phone_x + 16, phone_y + 16))
    
    # Bottom agency signature
    draw.text((TARGET_W//2 - 170, TARGET_H - 95), "INSIGHTNOVATECH  •  PORTFOLIO", font=font_sans_bold, fill=(255, 255, 255, 120))
    
    return canvas

# Helper to draw subtitles
def draw_subtitle_overlay(frame_img, current_time):
    # Find matching subtitle
    active_text = None
    for start, end, text in subtitles_data:
        if start <= current_time <= end:
            active_text = text
            break
    if not active_text:
        return frame_img
    
    # Word wrap subtitles for 1080px width
    words = active_text.split()
    lines = []
    current_line = []
    for w in words:
        current_line.append(w)
        if len(' '.join(current_line)) > 32:
            lines.append(' '.join(current_line))
            current_line = []
    if current_line:
        lines.append(' '.join(current_line))
    
    out_img = frame_img.copy()
    draw = ImageDraw.Draw(out_img)
    
    line_h = 50
    total_h = len(lines) * line_h + 30
    box_y = TARGET_H - 220 - total_h
    
    # Draw dark pill background for safe readability
    max_line_w = max([draw.textbbox((0, 0), l, font=font_captions)[2] for l in lines])
    box_w = max_line_w + 60
    box_x = (TARGET_W - box_w) // 2
    draw.rounded_rectangle([box_x, box_y, box_x + box_w, box_y + total_h], radius=20, fill=(0, 0, 0, 190), outline=(255, 255, 255, 50))
    
    for i, line in enumerate(lines):
        l_w = draw.textbbox((0, 0), line, font=font_captions)[2]
        draw.text(((TARGET_W - l_w) // 2, box_y + 15 + i * line_h), line, font=font_captions, fill=(255, 255, 255))
        
    return out_img

# Function to render frame at time t
def get_frame_at_time(t, captioned=False):
    # Scene 1: Hook 0.0 - 5.5s
    if t < 5.5:
        idx = int((t / 5.5) * len(frames_scene1_hook)) % len(frames_scene1_hook)
        frame = frames_scene1_hook[idx]
    # Scene 2: Homepage & Story 5.5 - 15.0s
    elif t < 15.0:
        local_t = t - 5.5
        idx = int((local_t / 9.5) * len(frames_scene2_home)) % len(frames_scene2_home)
        frame = composite_phone_scene(frames_scene2_home[idx], "Your Story. Your Style. Your Day.", "Custom Wedding Story")
    # Scene 3: Aso Ebi 15.0 - 23.5s
    elif t < 23.5:
        local_t = t - 15.0
        idx = int((local_t / 8.5) * len(frames_scene3_asoebi)) % len(frames_scene3_asoebi)
        frame = composite_phone_scene(frames_scene3_asoebi[idx], "Keep Everyone in Style", "Aso Ebi Color Palette", top_swatches=True)
    # Scene 4: Registry 23.5 - 32.0s
    elif t < 32.0:
        local_t = t - 23.5
        idx = int((local_t / 8.5) * len(frames_scene4_registry)) % len(frames_scene4_registry)
        frame = composite_phone_scene(frames_scene4_registry[idx], "Make Giving More Meaningful", "Digital Gift Registry")
    # Scene 5: RSVP 32.0 - 40.0s
    elif t < 40.0:
        local_t = t - 32.0
        idx = int((local_t / 8.0) * len(frames_scene5_rsvp)) % len(frames_scene5_rsvp)
        frame = composite_phone_scene(frames_scene5_rsvp[idx], "Invitations & RSVPs, Simplified", "Instant Digital Pass")
    # Scene 6: Product Summary Montage 40.0 - 47.0s
    elif t < 47.0:
        local_t = t - 40.0
        idx = int((local_t / 7.0) * len(frames_scene6_montage)) % len(frames_scene6_montage)
        frame = frames_scene6_montage[idx]
    # Scene 7: InsightNovaTech Logo & CTA 47.0 - 56.6s
    else:
        local_t = t - 47.0
        idx = min(len(frames_scene7_logo) - 1, int((local_t / 4.0) * len(frames_scene7_logo)))
        frame = frames_scene7_logo[idx]
        
    if captioned:
        frame = draw_subtitle_overlay(frame, t)
    return frame

# Build Video via FFmpeg Pipe
def render_video(out_path, captioned=False):
    print(f"\nEncoding {'Captioned' if captioned else 'Clean'} video to {out_path}...")
    temp_video = out_path.replace('.mp4', '_temp.mp4')
    cmd = [
        ffmpeg_path, '-y',
        '-f', 'rawvideo',
        '-vcodec', 'rawvideo',
        '-s', f'{TARGET_W}x{TARGET_H}',
        '-pix_fmt', 'rgb24',
        '-r', f'{FPS}',
        '-i', '-',
        '-c:v', 'libx264',
        '-pix_fmt', 'yuv420p',
        '-crf', '19',
        '-preset', 'fast',
        temp_video
    ]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    
    for f_idx in range(TOTAL_FRAMES):
        t = f_idx / FPS
        frame = get_frame_at_time(t, captioned=captioned)
        if frame.size != (TARGET_W, TARGET_H):
            frame = frame.resize((TARGET_W, TARGET_H), Image.Resampling.LANCZOS)
        proc.stdin.write(frame.tobytes())
        if f_idx % (FPS * 5) == 0:
            print(f"  Progress: {t:.1f}s / {TOTAL_DURATION:.1f}s ({f_idx}/{TOTAL_FRAMES} frames)")
            
    proc.stdin.close()
    proc.wait()
    
    # Merge audio
    print("Muxing audio with voiceover...")
    cmd_mux = [
        ffmpeg_path, '-y',
        '-i', temp_video,
        '-i', vo_file,
        '-c:v', 'copy',
        '-c:a', 'aac',
        '-b:a', '192k',
        '-shortest',
        out_path
    ]
    subprocess.run(cmd_mux, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    if os.path.exists(temp_video):
        os.remove(temp_video)
    print(f"Successfully generated: {out_path} ({os.path.getsize(out_path):,} bytes)")

# 1. Generate Clean Master Video
render_video(out_clean_mp4, captioned=False)

# 2. Generate Captioned Master Video
render_video(out_captioned_mp4, captioned=True)

print("\nAll Master Videos Generated Successfully!")
