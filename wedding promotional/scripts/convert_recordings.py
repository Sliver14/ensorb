import os
import subprocess
from PIL import Image, ImageSequence

ffmpeg_path = r'C:\Users\dell\AppData\Local\Programs\Python\Python312\Lib\site-packages\imageio_ffmpeg\binaries\ffmpeg-win-x86_64-v7.1.exe'
art_dir = r'C:\Users\dell\.gemini\antigravity-ide\brain\c14511b8-7e8b-4337-b903-bcb623139f5b'
out_dir = r'c:\Users\dell\Desktop\Sylver\CODE PROJECTS\Nextjs Projects\ensorb\wedding promotional\screen_recordings'
os.makedirs(out_dir, exist_ok=True)

jobs = [
    {
        'in': 'rec_homepage_mobile_1791883314256.webp',
        'out': 'scene2_homepage_mobile.mp4',
        'crop': (644, 0, 1276, 964)
    },
    {
        'in': 'rec_asoebi_page_1791883469673.webp',
        'out': 'scene3_asoebi_guide.mp4',
        'crop': None
    },
    {
        'in': 'rec_wishlist_page_1791883526672.webp',
        'out': 'scene4_gift_registry.mp4',
        'crop': None
    },
    {
        'in': 'rec_rsvp_page_1791883687114.webp',
        'out': 'scene5_rsvp_invitations.mp4',
        'crop': None
    },
    {
        'in': 'rec_story_page_1791883749541.webp',
        'out': 'scene2_story_chapters.mp4',
        'crop': None
    },
    {
        'in': 'rec_homepage_desktop_1791883816549.webp',
        'out': 'scene1_homepage_desktop.mp4',
        'crop': None
    }
]

for job in jobs:
    in_file = os.path.join(art_dir, job['in'])
    out_file = os.path.join(out_dir, job['out'])
    if not os.path.exists(in_file):
        print(f"Skipping, not found: {in_file}")
        continue
    
    im = Image.open(in_file)
    n_frames = im.n_frames
    fps = 10.0
    
    # Determine frame size
    sample = im.convert('RGB')
    if job['crop']:
        sample = sample.crop(job['crop'])
    w, h = sample.size
    # Ensure w and h are even numbers for libx264
    w = w - (w % 2)
    h = h - (h % 2)
    
    print(f"Converting {job['in']} -> {job['out']} ({w}x{h}, {n_frames} frames)...")
    
    cmd = [
        ffmpeg_path, '-y',
        '-f', 'rawvideo',
        '-vcodec', 'rawvideo',
        '-s', f"{w}x{h}",
        '-pix_fmt', 'rgb24',
        '-r', f"{fps:.2f}",
        '-i', '-',
        '-c:v', 'libx264',
        '-pix_fmt', 'yuv420p',
        '-crf', '18',
        '-preset', 'fast',
        out_file
    ]
    
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    for frame in ImageSequence.Iterator(im):
        f = frame.convert('RGB')
        if job['crop']:
            f = f.crop(job['crop'])
        if f.size != (w, h):
            f = f.resize((w, h), Image.Resampling.LANCZOS)
        proc.stdin.write(f.tobytes())
    proc.stdin.close()
    proc.communicate()
    
    if os.path.exists(out_file):
        print(f"  Created {job['out']}: {os.path.getsize(out_file):,} bytes")
    else:
        print(f"  Failed to create {job['out']}")

print("All screen recordings converted successfully!")
