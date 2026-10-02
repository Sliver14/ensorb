'use client'

import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { galleryPhotos } from '@/lib/data'

export default function StoryPage() {
  const storyMilestones = [
    {
      year: '2023',
      title: 'Chapter 01: The Coffee Date',
      subtitle: 'Where our story quietly began',
      body: 'What was supposed to be a brief evening catch-up over warm coffee turned into four hours of unceasing laughter, shared values, and an instant feeling of home. Neither of us wanted the evening to end.',
    },
    {
      year: '2024',
      title: 'Chapter 02: Growing Together',
      subtitle: 'Roots, adventures, and milestones',
      body: 'Through spontaneous weekend road trips, quiet Sunday dinners, and supporting each other through every career high and personal goal, we learned that true love is patient, kind, and steady.',
    },
    {
      year: '2025',
      title: 'Chapter 03: The Proposal',
      subtitle: 'With joyous tears and a resounding yes!',
      body: 'Surrounded by intimate candlelight, heartfelt music, and close loved ones, Sorbari asked the easiest question Ngozi would ever answer. With hearts full of joy and gratitude, we stepped towards forever.',
    },
    {
      year: '2026',
      title: 'Chapter 04: The Wedding Day',
      subtitle: 'October 31, 2026 • Lagos, Nigeria',
      body: 'Now, surrounded by the family, mentors, and friends who shaped our lives, we are thrilled to exchange our sacred vows before God and celebrate the beginning of our married adventure.',
    },
  ]

  return (
    <main className="wedding-site">
      <Navbar />

      <section className="subpage-hero section-shell">
        <div className="breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <strong>Our Story</strong>
        </div>
        <p className="eyebrow">The Journey of Ngozi &amp; Sorbari</p>
        <h1>A Love Story Written in Grace</h1>
        <p className="subpage-hero-desc">
          Every love story is beautiful, but ours is our absolute favorite. Here is a glimpse into how a simple coffee date became a lifelong journey of faith, friendship, and unending joy.
        </p>
      </section>

      {/* Story Timeline Section */}
      <section className="story-timeline-section section-shell">
        <div className="story-crest-banner">
          <img
            src="/logo-fav.jpeg"
            alt="ENSORB Wedding Emblem"
            className="story-crest-rounded"
          />
        </div>

        <div className="timeline-container">
          {storyMilestones.map((item, idx) => (
            <article key={item.title} className="timeline-card">
              <div className="timeline-marker">
                <span className="timeline-year">{item.year}</span>
                <div className="timeline-node" />
              </div>
              <div className="timeline-content">
                <span className="timeline-subtitle">{item.subtitle}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Couple Quote Banner */}
      <section className="quote-banner-section section-shell">
        <blockquote className="couple-blockquote">
          <p>
            &ldquo;Now, we’re stepping into our next chapter, hand in hand, with hearts full of gratitude for the love that surrounds us.&rdquo;
          </p>
          <cite>— Ngozi &amp; Sorbari</cite>
        </blockquote>
      </section>

      {/* Photo Gallery Section */}
      <section className="story-gallery-section section-shell">
        <div className="gallery-header">
          <p className="eyebrow">Cherished Moments</p>
          <h2>Engagement Gallery</h2>
          <p className="gallery-desc">Capturing the quiet glances, laughter, and romance along our way.</p>
        </div>

        <div className="story-gallery-grid">
          {galleryPhotos.map((photo, index) => (
            <figure key={photo.src} className={`gallery-figure ${index === 3 ? 'wide-figure' : ''}`}>
              <img src={photo.src} alt={photo.alt} loading="lazy" />
              <figcaption>{photo.caption}</figcaption>
            </figure>
          ))}
        </div>

        <div className="story-cta-bar">
          <Link href="/rsvp" className="story-rsvp-cta">
            Join Our Celebration — RSVP Now ↗
          </Link>
          <Link href="/gifts" className="story-gifts-cta">
            View Gift Registry 🎁
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
