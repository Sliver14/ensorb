import os
from gtts import gTTS

PROMO_DIR = r"c:\Users\dell\Desktop\Sylver\CODE PROJECTS\Nextjs Projects\ensorb\wedding promotional"
VOICEOVER_DIR = os.path.join(PROMO_DIR, "voiceover")
SUBTITLES_DIR = os.path.join(PROMO_DIR, "subtitles")

os.makedirs(VOICEOVER_DIR, exist_ok=True)
os.makedirs(SUBTITLES_DIR, exist_ok=True)

FULL_SCRIPT = """What if your wedding website could do more than share the date and venue?

For this project, I built a personalized wedding website designed to bring the couple's story and their guests' experience together.

From the couple's love story and wedding details to a dedicated Aso Ebi color guide, every section has a purpose.

Guests can explore the gift registry, receive their invitations by email, and RSVP online.

It's more than a beautiful design. It's a practical digital experience tailored to a special occasion.

At InsightNovaTech, we build websites and digital solutions around real needs.

Planning a wedding, launching a business, or looking to bring your idea online?

Let's build something exceptional. Send us a message today."""

SCENES = [
    {
        "id": "scene1_hook",
        "title": "Scene 1 - The Hook (0-6s)",
        "text": "What if your wedding website could do more than share the date and venue?",
        "start": "00:00:00,500",
        "end": "00:00:05,800"
    },
    {
        "id": "scene2_homepage_story",
        "title": "Scene 2 - Homepage & Story (6-15s)",
        "text": "For this project, I built a personalized wedding website designed to bring the couple's story and their guests' experience together.",
        "start": "00:00:06,200",
        "end": "00:00:14,800"
    },
    {
        "id": "scene3_asoebi_guide",
        "title": "Scene 3 - Aso Ebi Color Guide (15-23s)",
        "text": "From the couple's love story and wedding details to a dedicated Aso Ebi color guide, every section has a purpose.",
        "start": "00:00:15,200",
        "end": "00:00:22,800"
    },
    {
        "id": "scene4_gift_registry",
        "title": "Scene 4 - Gift Registry & RSVPs (23-32s)",
        "text": "Guests can explore the gift registry, receive their invitations by email, and RSVP online.",
        "start": "00:00:23,200",
        "end": "00:00:31,500"
    },
    {
        "id": "scene5_practical_experience",
        "title": "Scene 5 - Practical Experience (32-42s)",
        "text": "It's more than a beautiful design. It's a practical digital experience tailored to a special occasion.",
        "start": "00:00:32,000",
        "end": "00:00:41,200"
    },
    {
        "id": "scene6_brand_summary",
        "title": "Scene 6 - InsightNovaTech Capabilities (42-49s)",
        "text": "At InsightNovaTech, we build websites and digital solutions around real needs.",
        "start": "00:00:42,000",
        "end": "00:00:48,500"
    },
    {
        "id": "scene7_call_to_action",
        "title": "Scene 7 - Call to Action (49-60s)",
        "text": "Planning a wedding, launching a business, or looking to bring your idea online? Let's build something exceptional. Send us a message today.",
        "start": "00:00:49,000",
        "end": "00:00:58,000"
    }
]

def main():
    print("Generating full voiceover with gTTS (Natural English)...")
    full_mp3 = os.path.join(VOICEOVER_DIR, "voiceover_full.mp3")
    tts_full = gTTS(text=FULL_SCRIPT, lang='en', tld='co.uk', slow=False)
    tts_full.save(full_mp3)
    print(f"Saved: {full_mp3}")
    
    # Generate scene-by-scene audio stems
    for scene in SCENES:
        out_path = os.path.join(VOICEOVER_DIR, f"{scene['id']}.mp3")
        tts_scene = gTTS(text=scene["text"], lang='en', tld='co.uk', slow=False)
        tts_scene.save(out_path)
        print(f"Saved stem: {scene['id']}.mp3")

    # Generate SRT Subtitle file
    srt_path = os.path.join(SUBTITLES_DIR, "voiceover_subtitles.srt")
    vtt_path = os.path.join(SUBTITLES_DIR, "voiceover_subtitles.vtt")
    
    srt_content = []
    vtt_content = ["WEBVTT\n"]
    for i, s in enumerate(SCENES, 1):
        srt_content.append(f"{i}\n{s['start']} --> {s['end']}\n{s['text']}\n")
        vtt_time = f"{s['start'].replace(',', '.')} --> {s['end'].replace(',', '.')}"
        vtt_content.append(f"{vtt_time}\n{s['text']}\n")
        
    with open(srt_path, "w", encoding="utf-8") as f:
        f.write("\n".join(srt_content))
    with open(vtt_path, "w", encoding="utf-8") as f:
        f.write("\n".join(vtt_content))
        
    print(f"Saved subtitles: {srt_path} and {vtt_path}")

if __name__ == "__main__":
    main()
