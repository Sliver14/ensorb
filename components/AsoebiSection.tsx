'use client'

import { useState } from 'react'
import {
  MessageCircle,
  Phone,
  Copy,
  Check,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  X,
  ZoomIn,
} from 'lucide-react'
import { BotanicalSprig } from '@/components/WeddingIcons'

export function AsoebiSection() {
  const [copiedAcc, setCopiedAcc] = useState(false)
  const [showFlyerModal, setShowFlyerModal] = useState(false)

  const asoebiData = {
    whatsappNumber: '09075720446',
    whatsappLink: 'https://wa.me/2349075720446',
    phoneCall: '08106690387',
    bankName: 'Parallex Bank',
    accountNumber: '2000079513',
    accountName: 'Ngozi Kalu Emele',
    packages: [
      {
        id: 'female',
        title: 'Female Asoebi',
        tag: 'LADIES’ COLLECTION',
        price: '₦35,000',
        numericPrice: 35000,
        description:
          'Exquisite blush-mauve luxury sequin-beaded lace fabric with matching headgear styling for the celebration.',
        fabricDetail: 'Beaded & Sequined Lace Material',
        whatsappMessage:
          'Hello! I would like to order the Female Wedding Asoebi (₦35,000) for Ngozi & Sorbari’s wedding celebration.',
      },
      {
        id: 'male',
        title: 'Male Asoebi',
        tag: 'GENTLEMEN’S COLLECTION',
        price: '₦30,000',
        numericPrice: 30000,
        description:
          'Lustrous blush-mauve matching textured Senator / Agbada fabric with matching cap styling for the celebration.',
        fabricDetail: 'Premium Shimmering Senator / Agbada Material',
        whatsappMessage:
          'Hello! I would like to order the Male Wedding Asoebi (₦30,000) for Ngozi & Sorbari’s wedding celebration.',
      },
    ],
  }

  const handleCopyAccount = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(asoebiData.accountNumber)
      setCopiedAcc(true)
      setTimeout(() => setCopiedAcc(false), 2200)
    }
  }

  return (
    <section id="asoebi" className="wedding-asoebi-section" aria-labelledby="asoebi-heading">
      <BotanicalSprig className="asoebi-sprig-left floating-botanical-sway" />
      <BotanicalSprig className="asoebi-sprig-right floating-botanical-sway" />

      <div className="asoebi-container">
        {/* Section Header */}
        <div className="asoebi-header-center reveal-fade-up">
          <div className="asoebi-crest-badge">
            <Sparkles size={14} className="text-gold" />
            <span className="eyebrow-spaced">OUR WEDDING ASOEBI</span>
            <Sparkles size={14} className="text-gold" />
          </div>
          <h2 id="asoebi-heading" className="asoebi-main-title">
            Order Your Asoebi
          </h2>
          <p className="asoebi-subtitle">
            Celebrate with us in elegance! We warmly invite our dear family and friends to join in
            the bridal train splendor with our official blush-mauve wedding attire.
          </p>
        </div>

        {/* Content Grid: Left Flyer Showcase & Right Package Options */}
        <div className="asoebi-content-grid">
          {/* Left Column: Luxury Flyer Card */}
          <div className="asoebi-flyer-col reveal-fade-left">
            <div className="asoebi-flyer-card">
              <div className="flyer-img-wrap" onClick={() => setShowFlyerModal(true)}>
                <img
                  src="/wedding-asoebi.jpeg"
                  alt="Ngozi & Sorbari Wedding Asoebi Flyer"
                  className="asoebi-flyer-img"
                  loading="lazy"
                  decoding="async"
                />
                <div className="flyer-zoom-overlay">
                  <ZoomIn size={22} />
                  <span>Tap to view full flyer</span>
                </div>
              </div>

              <div className="flyer-card-footer">
                <div className="flyer-meta-row">
                  <span className="flyer-tag">Official Wedding Fabric</span>
                  <span className="flyer-event-date">21 Nov 2026</span>
                </div>
                <div className="flyer-price-pills">
                  <span className="price-chip female">Female: ₦35,000</span>
                  <span className="price-chip male">Male: ₦30,000</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Packages, Bank Details & Direct WhatsApp Actions */}
          <div className="asoebi-details-col reveal-fade-right">
            {/* Packages Row */}
            <div className="asoebi-packages-grid">
              {asoebiData.packages.map((pkg) => (
                <div key={pkg.id} className={`asoebi-package-card ${pkg.id}`}>
                  <div className="package-card-header">
                    <span className="package-tag">{pkg.tag}</span>
                    <strong className="package-price">{pkg.price}</strong>
                  </div>
                  <h3 className="package-title">{pkg.title}</h3>
                  <p className="package-fabric-lbl">
                    <strong>Fabric:</strong> {pkg.fabricDetail}
                  </p>
                  <p className="package-desc">{pkg.description}</p>

                  <a
                    href={`${asoebiData.whatsappLink}?text=${encodeURIComponent(
                      pkg.whatsappMessage
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-asoebi-whatsapp"
                  >
                    <MessageCircle size={16} />
                    <span>Order {pkg.id === 'female' ? 'Female' : 'Male'} on WhatsApp</span>
                    <ExternalLink size={13} className="ext-icon" />
                  </a>
                </div>
              ))}
            </div>

            {/* Bank Payment Card */}
            <div className="asoebi-payment-box">
              <div className="payment-box-header">
                <span className="payment-crest-icon">🏛️</span>
                <div>
                  <h4 className="payment-title">Payment &amp; Bank Details</h4>
                  <p className="payment-hint">
                    Make your direct transfer below and send your receipt on WhatsApp for instant confirmation.
                  </p>
                </div>
              </div>

              <div className="asoebi-bank-grid">
                <div className="bank-field">
                  <span className="field-lbl">Bank Name</span>
                  <strong className="field-val">{asoebiData.bankName}</strong>
                </div>

                <div className="bank-field highlight">
                  <span className="field-lbl">Account Number</span>
                  <div className="account-number-group">
                    <strong className="field-val account-num">{asoebiData.accountNumber}</strong>
                    <button
                      type="button"
                      onClick={handleCopyAccount}
                      className={`btn-copy-account-mini ${copiedAcc ? 'copied' : ''}`}
                      title="Copy account number"
                    >
                      {copiedAcc ? (
                        <>
                          <Check size={13} className="text-emerald" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={13} />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="bank-field full-row">
                  <span className="field-lbl">Account Beneficiary</span>
                  <strong className="field-val name-val">{asoebiData.accountName}</strong>
                </div>
              </div>
            </div>

            {/* Direct Contact Bar */}
            <div className="asoebi-contact-bar">
              <div className="contact-prompt">
                <strong>Need Assistance or Custom Lengths?</strong>
                <span>Reach out directly to order or ask questions:</span>
              </div>
              <div className="contact-actions-row">
                <a
                  href={`${asoebiData.whatsappLink}?text=${encodeURIComponent(
                    'Hello! I would like to enquire about ordering our Wedding Asoebi for Ngozi & Sorbari’s wedding.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-contact-whatsapp"
                >
                  <MessageCircle size={16} />
                  <span>WhatsApp: {asoebiData.whatsappNumber}</span>
                </a>

                <a href={`tel:${asoebiData.phoneCall}`} className="btn-contact-phone">
                  <Phone size={15} />
                  <span>Call: {asoebiData.phoneCall}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Flyer Lightbox Modal */}
      {showFlyerModal && (
        <div
          className="asoebi-modal-backdrop"
          onClick={() => setShowFlyerModal(false)}
          role="presentation"
        >
          <div
            className="asoebi-modal-content"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Wedding Asoebi Full Flyer"
          >
            <button
              type="button"
              className="asoebi-modal-close-btn"
              onClick={() => setShowFlyerModal(false)}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
            <img
              src="/wedding-asoebi.jpeg"
              alt="Ngozi & Sorbari Wedding Asoebi Full Flyer"
              className="asoebi-modal-img"
            />
            <div className="asoebi-modal-footer">
              <a
                href={`${asoebiData.whatsappLink}?text=${encodeURIComponent(
                  'Hello! I would like to order our Wedding Asoebi for Ngozi & Sorbari’s wedding celebration.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-modal-order-wa"
              >
                <MessageCircle size={18} />
                <span>Order on WhatsApp (09075720446)</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
