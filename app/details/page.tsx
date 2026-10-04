'use client'

import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { ColorCodeSection } from '@/components/ColorCodeSection'
import { weddingSchedule } from '@/lib/data'

export default function DetailsPage() {
  return (
    <main className="elegant-burgundy-theme details-page-wrapper">
      <Navbar />

      <section className="subpage-hero section-shell">
        <div className="breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <strong>Details &amp; Dress Code</strong>
        </div>
        <p className="eyebrow">The Celebration Details</p>
        <h1>Schedule, Venue &amp; Dress Code</h1>
        <p className="subpage-hero-desc">
          Everything you need to know for our special day — from the order of events and ceremony venue to our official wedding color palette and travel recommendations.
        </p>
      </section>

      {/* Program Schedule Section */}
      <section className="schedule-section section-shell" aria-labelledby="schedule-heading">
        <div className="section-header-center">
          <p className="eyebrow">Order of Events</p>
          <h2 id="schedule-heading">The Wedding Program</h2>
          <p className="section-subtext">Saturday, October 31, 2026 • Christ Embassy Ogba 1, Lagos</p>
        </div>

        <div className="schedule-timeline">
          {weddingSchedule.map((item) => (
            <article key={item.title} className="schedule-card">
              <div className="schedule-time-box">
                <span className="schedule-icon">{item.icon}</span>
                <span className="schedule-time">{item.time}</span>
              </div>
              <div className="schedule-content">
                <span className="schedule-loc-tag">{item.location}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Dress Color Code Section */}
      <ColorCodeSection />

      {/* Venue & Logistics Section */}
      <section className="venue-logistics-section section-shell">
        <div className="venue-grid">
          <div className="venue-card">
            <span className="venue-badge">Main Venue</span>
            <h3>Christ Embassy Ogba 1</h3>
            <p className="venue-address">
              Plot 12/14 Acme Road, Ogba Industrial Estate, Ikeja / Ogba, Lagos, Nigeria
            </p>
            <div className="venue-features">
              <div className="feature-item">
                <span>🚗</span>
                <div>
                  <strong>Complimentary Parking</strong>
                  <p>Dedicated secure guest parking is available inside the premises.</p>
                </div>
              </div>
              <div className="feature-item">
                <span>🛡️</span>
                <div>
                  <strong>Event Security</strong>
                  <p>Uniformed protocol and security teams will guide your entry with your digital pass.</p>
                </div>
              </div>
            </div>
            <a
              href="https://maps.google.com/?q=Christ+Embassy+Ogba+1+Lagos"
              target="_blank"
              rel="noopener noreferrer"
              className="venue-map-btn"
            >
              Open in Google Maps ↗
            </a>
          </div>

          <div className="accommodation-card">
            <span className="venue-badge">Guest Stay</span>
            <h3>Nearby Accommodations</h3>
            <p>For guests traveling from out of state or abroad, we recommend the following comfortable hotels nearby:</p>
            <div className="hotels-list">
              <div className="hotel-item">
                <strong>Sheraton Lagos Hotel</strong>
                <span>Ikeja • Approx. 15 mins to venue</span>
              </div>
              <div className="hotel-item">
                <strong>Radisson Blu Hotel</strong>
                <span>Ikeja GRA • Approx. 20 mins to venue</span>
              </div>
              <div className="hotel-item">
                <strong>Ibis Lagos Ikeja</strong>
                <span>Murtala Muhammed Airport axis • Approx. 20 mins</span>
              </div>
            </div>
            <Link href="/rsvp" className="venue-rsvp-btn">
              Confirm Your Attendance ↗
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
