'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Footer } from '@/components/Footer'
import { galleryPhotos } from '@/lib/data'
import GalleryLightboxModal from '@/components/GalleryLightboxModal'
import {
  BotanicalSprig,
  SideTallBotanical,
  CardCornerBotanical,
  HeroBottomTornWithWash,
  TornBannerEdge,
  MonogramLogo,
} from '@/components/WeddingIcons'
import { ZoomIn } from 'lucide-react'

export default function StoryPage() {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null)

  const storyChapters = [
    {
      act: 'ACT I',
      date: 'Campus Ministry • 2014',
      title: 'Serving Together in Church',
      subtitle: 'Where our paths first crossed in faith',
      highlight:
        '“Little did we know that what seemed like an ordinary relationship between church brethren was the beginning of a much greater story.”',
      dropCap: 'O',
      paragraphs: [
        'ur story began in church, in 2014 during our days in Campus Ministry. We first met as Brother and Sister, serving in the same church community.',
        'Sorbari was known for his active involvement, willingness to help, and readiness to serve whenever there was a need. In those days, we related as fellow brethren, sharing the same faith, fellowship, and passion for the things of God, never imagining that our paths would one day lead us to becoming life partners.',
        'Little did we know that what seemed like an ordinary relationship between church brethren was the beginning of a much greater story.',
      ],
      image: '/couple/IMG_4943.jpg.jpeg',
      imageAlt: 'Ngozi & Sorbari during fellowship days',
      imageCaption: 'Campus Ministry • 2014 • Fellowship & Service',
      tag: 'The Beginning',
    },
    {
      act: 'ACT II',
      date: 'Lagos • 2022',
      title: 'A Divine Appointment',
      subtitle: 'An unexpected reunion ordained by God',
      highlight:
        '“It was during this visit that our paths crossed again — a joyful moment discovering each other anew.”',
      dropCap: 'F',
      paragraphs: [
        'ast-forward to 2022, when Ngozi came to Lagos.',
        'She was exploring an opportunity to join the Loveworld staff community and visited her former Campus Pastor, Pastor Amaka, to seek guidance and assistance. It was during this visit that our paths crossed again.',
        'For Sorbari, seeing Ngozi again was a joyful moment. We reconnected, started talking more often, and gradually began to discover each other beyond the familiar relationship we had shared as church brethren.',
      ],
      image: '/couple/IMG_4851.jpg.jpeg',
      imageAlt: 'Ngozi & Sorbari reunion in Lagos',
      imageCaption: 'Lagos Reunion • 2022 • God’s Perfect Timing',
      tag: 'Divine Timing',
    },
    {
      act: 'ACT III',
      date: 'A Beautiful Journey',
      title: 'From Friendship to Love',
      subtitle: 'Conversations that took on a new meaning',
      highlight:
        '“What we once knew as fellowship blossomed into friendship, our friendship grew into love, and our love has brought us to this beautiful point.”',
      dropCap: 'A',
      paragraphs: [
        's our conversations deepened, so did our connection. What had once been a simple friendship began to take on a new meaning, and in time, Sorbari made his intentions known.',
        'And so, a beautiful journey began. ❤️',
        'Looking back, we are amazed at how God orchestrated the different seasons of our lives. Every encounter was a part of a bigger picture.',
        'What we once knew as fellowship blossomed into friendship, our friendship grew into love, and our love has brought us to this beautiful point in our journey.',
      ],
      image: '/couple/IMG_5012.jpg.jpeg',
      imageAlt: 'Ngozi & Sorbari romantic moment',
      imageCaption: 'Friendship to Love • Beautiful Beginnings',
      tag: 'New Chapter',
    },
    {
      act: 'ACT IV',
      date: 'Today & Forever',
      title: 'With God at the Centre',
      subtitle: 'Our story is still unfolding, and the best chapters are yet to come',
      highlight:
        '“This is our love story — a story of divine timing, beautiful beginnings, with God at the centre.”',
      dropCap: 'W',
      paragraphs: [
        'e have come to appreciate that sometimes, God does not announce the beginning of a great story. He simply allows two lives to intersect, guides their steps, and gives meaning to the moments that eventually become precious memories.',
        'Today, we look forward to the journey ahead with hearts full of gratitude, joy, and expectation. We are excited about building a life together, growing in love and faith, fulfilling God’s purpose, and creating beautiful memories as we walk hand in hand into the future.',
        'Our story is still unfolding, and the best chapters are yet to come.',
        'This is our love story — a story of divine timing, beautiful beginnings, with God at the centre. ❤️',
      ],
      image: '/couple/IMG_6067.png',
      imageAlt: 'Ngozi in burgundy gown and Sorbari in black tuxedo walking hand in hand',
      imageCaption: 'Stepping into forever • 21 November 2026',
      tag: 'Forever Together',
    },
  ]

  return (
    <main className="elegant-burgundy-theme story-page-layout">
      {/* ====================================================================
          HERO: OUR LOVE STORY
         ==================================================================== */}
      <section className="story-hero-section">
        <SideTallBotanical className="story-hero-tall-sprig floating-botanical-sway" />

        <div className="story-hero-container">
          {/* Left Text Block */}
          <div className="story-hero-copy reveal-fade-left">
            <span className="eyebrow-spaced">— OUR LOVE STORY —</span>

            <h1 className="story-hero-main-title">
              Written by Grace,
              <span className="story-script-title">Lived in Love ♡</span>
            </h1>

            {/* Deckled Letter Quote Callout */}
            <div className="story-opening-card">
              <div className="story-opening-icon">✝</div>
              <p className="story-hero-opening-quote">
                &ldquo;God begins writing a story long before we realise it is ours to tell. From serving together in Campus Ministry to reconnecting in Lagos — a simple friendship blossomed into a lifelong journey of faith and love.&rdquo;
              </p>
              <div className="story-opening-divider">
                <span className="line" />
                <span className="heart">♡</span>
                <span className="line" />
              </div>
            </div>
          </div>

          {/* Right Visual Block: Tilted Polaroid + Seal */}
          <div className="story-hero-visual reveal-fade-right">
            <div className="story-polaroid-envelope">
              <div className="washi-polaroid-frame story-hero-polaroid floating-polaroid-motion">
                <div className="washi-tape-strip" />
                <div className="polaroid-photo-inner">
                  <img
                    src="/couple/quote-portrait.jpg"
                    alt="Ngozi & Sorbari loving portrait"
                    className="polaroid-img"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="polaroid-footer-row">
                  <span className="polaroid-names">Ngozi &amp; Sorbari</span>
                  <span className="polaroid-date">Est. 2026</span>
                </div>
                <BotanicalSprig className="polaroid-botanical-corner floating-botanical-sway" />
              </div>

              {/* Wax Seal Stamp */}
              <div className="story-wax-seal floating-gentle">
                <MonogramLogo size={32} />
              </div>
            </div>
          </div>
        </div>

        <HeroBottomTornWithWash />
      </section>

      {/* ====================================================================
          STORY CHAPTERS: EDITORIAL NARRATIVE TIMELINE
         ==================================================================== */}
      <section className="story-chapters-section">
        <div className="story-timeline-stem" aria-hidden="true" />

        <div className="story-chapters-container">
          {storyChapters.map((chapter, index) => {
            const isEven = index % 2 === 1
            return (
              <article
                key={chapter.act}
                className={`story-chapter-card ${isEven ? 'is-reversed' : ''} reveal-fade-up`}
              >
                {/* Chapter Text Column */}
                <div className="chapter-text-col">
                  {/* Top Meta Bar */}
                  <div className="chapter-meta-bar">
                    <span className="chapter-act-badge">{chapter.act}</span>
                    <span className="chapter-date-tag">{chapter.date}</span>
                    <span className="chapter-tag-pill">{chapter.tag}</span>
                  </div>

                  <h2 className="chapter-title">{chapter.title}</h2>
                  <span className="chapter-subtitle">{chapter.subtitle}</span>

                  {/* Highlight Quote Box */}
                  <div className="chapter-highlight-quote">
                    <span className="quote-mark">“</span>
                    <p>{chapter.highlight}</p>
                  </div>

                  {/* Narrative Paragraphs with Drop Cap */}
                  <div className="chapter-paragraphs">
                    {chapter.paragraphs.map((p, pIdx) => {
                      if (pIdx === 0) {
                        return (
                          <p key={pIdx} className="chapter-paragraph first-paragraph">
                            <span className="illuminated-drop-cap">{chapter.dropCap}</span>
                            {p}
                          </p>
                        )
                      }
                      return (
                        <p key={pIdx} className="chapter-paragraph">
                          {p}
                        </p>
                      )
                    })}
                  </div>

                  <CardCornerBotanical className="chapter-corner-sprig" />
                </div>

                {/* Chapter Visual Column */}
                <div className="chapter-visual-col">
                  <div className="washi-polaroid-frame chapter-polaroid floating-gentle">
                    <div className="washi-tape-strip" />
                    <div className="polaroid-photo-inner">
                      <img
                        src={chapter.image}
                        alt={chapter.imageAlt}
                        className="polaroid-img"
                        loading="lazy"
                      />
                    </div>
                    <span className="polaroid-caption-text">{chapter.imageCaption}</span>
                    <BotanicalSprig className="polaroid-botanical-corner" />
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      {/* ====================================================================
          TORN BANNER: CENTRAL QUOTE RIBBON
         ==================================================================== */}
      <section className="story-quote-banner-section reveal-fade-up">
        <TornBannerEdge position="top" color="#FAF7F2" />

        <div className="story-quote-ribbon-bar">
          <div className="story-quote-inner">
            <span className="story-quote-cross">✝</span>
            <span className="story-quote-heart">♡</span>
            <blockquote className="story-banner-quote">
              &ldquo;This is our love story — a story of divine timing, beautiful beginnings, with God at the centre.&rdquo;
            </blockquote>
            <cite className="story-banner-cite">— Ngozi &amp; Sorbari</cite>
            <p className="story-banner-sub">21 November 2026 • Lagos, Nigeria</p>
          </div>
        </div>

        <TornBannerEdge position="bottom" color="#FAF7F2" />
      </section>

      {/* ====================================================================
          ENGAGEMENT & PORTRAITS GALLERY
         ==================================================================== */}
      <section className="story-gallery-section">
        <div className="gallery-header reveal-fade-up">
          <span className="eyebrow-spaced">— CHERISHED MOMENTS —</span>
          <h2 className="section-serif-title">Engagement &amp; Couple Gallery</h2>
          <p className="gallery-desc">
            Capturing the quiet glances, shared laughter, and joy along our way to the altar.
          </p>
        </div>

        <div className="story-gallery-grid reveal-stagger">
          {galleryPhotos.map((photo, index) => (
            <figure
              key={photo.src + index}
              className="gallery-figure"
              onClick={() => setSelectedPhotoIndex(index)}
            >
              <div className="gallery-img-wrap">
                <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" />
                <div className="gallery-hover-overlay">
                  <ZoomIn size={26} />
                  <span>View Photo</span>
                </div>
              </div>
              <figcaption>
                <span className="fig-caption-text">{photo.caption}</span>
                <span className="fig-heart">♡</span>
              </figcaption>
            </figure>
          ))}
        </div>

        {/* Custom Portal Lightbox Modal (Higher in index, root portal) */}
        <GalleryLightboxModal
          photos={galleryPhotos}
          initialIndex={selectedPhotoIndex}
          onClose={() => setSelectedPhotoIndex(null)}
        />


        {/* Celebration CTA Bar */}
        <div className="story-celebrate-card reveal-fade-up">
          <div className="card-decor-heart">♥</div>
          <h3 className="celebrate-title">Celebrate With Us</h3>
          <p className="celebrate-desc">
            We would be honored to have you share in the joy of our Holy Matrimony on November 21, 2026.
          </p>
          <div className="story-cta-bar">
            <Link href="/rsvp" className="btn-burgundy-pill">
              Reserve Your Seat <span>→</span>
            </Link>
            <Link href="/wishlist" className="btn-cream-outline-pill">
              <span>🎁</span> Send Your Gift
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}


