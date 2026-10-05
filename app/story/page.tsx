'use client'

import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { galleryPhotos } from '@/lib/data'
import {
  BotanicalSprig,
  SideTallBotanical,
  CardCornerBotanical,
  HeroBottomTornWithWash,
  TornBannerEdge,
  MonogramLogo,
} from '@/components/WeddingIcons'

export default function StoryPage() {
  const storyChapters = [
    {
      act: 'ACT I',
      date: 'The Campus Ministry Years',
      title: 'Serving Together in Church',
      subtitle: 'Where our paths first crossed in faith',
      highlight: '“He was the ever-active Brother, always willing to help, always available, and ever ready to serve.”',
      dropCap: 'O',
      paragraphs: [
        'ur story began in church, during our days in Campus Ministry. That was where I first met Bro Sorbari. He was the ever-active Brother, always willing to help, always available, and ever ready to serve whenever there was a need.',
        'At the time, we simply related as Brother and Sister, serving together in church. We had no idea that the friendship and fellowship we shared then would one day become the foundation of something much more beautiful.',
      ],
      image: '/couple/story-polaroid.png',
      imageAlt: 'Ngozi & Sorbari during fellowship days',
      imageCaption: 'Campus Ministry • Fellowship & Service',
      tag: 'The Beginning',
    },
    {
      act: 'ACT II',
      date: 'Lagos • 2022',
      title: 'A Divine Appointment',
      subtitle: 'An unexpected reunion ordained by God',
      highlight: '“That day, I saw Bro. Godwin again.”',
      dropCap: 'F',
      paragraphs: [
        'ast-forward to 2022, when I came to Lagos.',
        'I was seeking an opportunity to work as a Loveworld staff, and during that period, I came to church to see Pastor Amaka, who had been my Campus Pastor while I was on campus. I wanted to seek her guidance and assistance as I explored the opportunity of joining the staff community.',
        'That day, I saw Bro. Godwin again.',
      ],
      image: '/couple/quote-portrait.jpg',
      imageAlt: 'Ngozi & Sorbari reunion in Lagos',
      imageCaption: 'Lagos Reunion • God’s Perfect Timing',
      tag: 'Divine Timing',
    },
    {
      act: 'ACT III',
      date: 'A New Season',
      title: 'Conversations & Intentions',
      subtitle: 'When friendship blossomed into love',
      highlight: '“And just like that, a journey we never saw coming began.”',
      dropCap: 'H',
      paragraphs: [
        'e was genuinely excited to see me, and what seemed like an ordinary reunion soon became the beginning of a new chapter in our story. We started talking, reconnecting, and getting to know each other in a different way.',
        'As time went on, our conversations became more meaningful, and eventually, he made his intentions known.',
        'And just like that, a journey we never saw coming began.',
      ],
      image: '/couple/IMG_6069.png',
      imageAlt: 'Romantic dining table setting',
      imageCaption: 'Reconnecting • Meaningful Conversations',
      tag: 'New Chapter',
    },
    {
      act: 'ACT IV',
      date: 'Forever & Always',
      title: 'God at the Centre',
      subtitle: 'From church brethren to life partners',
      highlight: '“From church brethren to life partners, God was writing our love story all along.”',
      dropCap: 'L',
      paragraphs: [
        'ooking back, it is amazing to realise that while we were simply living, serving, and relating as Brother and Sister in church, God already knew the beautiful story He was writing.',
        'He brought our paths together, allowed us to meet again at the right time, and turned a simple relationship into something deeper, sweeter, and far more beautiful than we could have imagined.',
        'From church brethren to life partners, we can truly say that God was writing our love story all along. ❤️',
        'And today, with grateful hearts, we look forward to the beautiful journey ahead — together, with God at the centre.',
      ],
      image: '/couple/hero-portrait.png',
      imageAlt: 'Ngozi & Sorbari wedding portrait',
      imageCaption: 'Stepping into forever • 31 October 2026',
      tag: 'Forever Together',
    },
  ]

  return (
    <main className="elegant-burgundy-theme story-page-layout">
      <Navbar />

      {/* ====================================================================
          HERO: OUR LOVE STORY
         ==================================================================== */}
      <section className="story-hero-section">
        <SideTallBotanical className="story-hero-tall-sprig floating-botanical-sway" />

        <div className="story-hero-container">
          {/* Left Text Block */}
          <div className="story-hero-copy reveal-fade-left">
            <div className="story-breadcrumb">
              <Link href="/">Home</Link>
              <span>/</span>
              <span className="current">Our Story</span>
            </div>

            <span className="eyebrow-spaced">— OUR LOVE STORY —</span>

            <h1 className="story-hero-main-title">
              Written by Grace,
              <span className="story-script-title">Lived in Love ♡</span>
            </h1>

            {/* Deckled Letter Quote Callout */}
            <div className="story-opening-card">
              <div className="story-opening-icon">✝</div>
              <p className="story-hero-opening-quote">
                &ldquo;Sometimes, God begins writing a story long before we realise it is ours to tell.&rdquo;
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
                  />
                </div>
                <div className="polaroid-footer-row">
                  <span className="polaroid-names">Ngozi &amp; Sorbari</span>
                  <span className="polaroid-date">Est. 2022</span>
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
              &ldquo;From church brethren to life partners, we can truly say that God was writing our love story all along.&rdquo;
            </blockquote>
            <cite className="story-banner-cite">— Ngozi &amp; Sorbari</cite>
            <p className="story-banner-sub">31 October 2026 • Lagos, Nigeria</p>
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
              className={`gallery-figure ${index === 3 ? 'wide-figure' : ''}`}
            >
              <div className="gallery-img-wrap">
                <img src={photo.src} alt={photo.alt} loading="lazy" />
              </div>
              <figcaption>
                <span className="fig-caption-text">{photo.caption}</span>
                <span className="fig-heart">♡</span>
              </figcaption>
            </figure>
          ))}
        </div>

        {/* Celebration CTA Bar */}
        <div className="story-celebrate-card reveal-fade-up">
          <div className="card-decor-heart">♥</div>
          <h3 className="celebrate-title">Celebrate With Us</h3>
          <p className="celebrate-desc">
            We would be honored to have you share in the joy of our Holy Matrimony on October 31, 2026.
          </p>
          <div className="story-cta-bar">
            <Link href="/rsvp" className="btn-burgundy-pill">
              RSVP For The Wedding <span>→</span>
            </Link>
            <Link href="/wishlist" className="btn-cream-outline-pill">
              <span>🎁</span> View Wedding Wishlist
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}


