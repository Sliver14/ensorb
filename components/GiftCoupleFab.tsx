'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Gift, X, Copy, Check, Sparkles, Building2, User, CreditCard, ArrowRight, Heart } from 'lucide-react'
import { bankDetails } from '@/lib/data'

export function GiftCoupleFab() {
  const pathname = usePathname()
  const [showQuickModal, setShowQuickModal] = useState(false)
  const [copiedAcc, setCopiedAcc] = useState(false)
  const [copiedAll, setCopiedAll] = useState(false)

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showQuickModal) {
        setShowQuickModal(false)
      }
    }
    if (showQuickModal) {
      window.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [showQuickModal])

  // Don't render on admin page
  if (pathname && pathname.startsWith('/admin')) {
    return null
  }

  const handleCopyAccount = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(bankDetails.accountNumber)
      setCopiedAcc(true)
      setTimeout(() => setCopiedAcc(false), 2500)
    }
  }

  const handleCopyAllDetails = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      const fullText = `💍 Ngozi & Sorbari Wedding Gift Bank Details:\n\nBank: ${bankDetails.bankName}\nAccount Number: ${bankDetails.accountNumber}\nAccount Name: ${bankDetails.accountName}\n\nThank you for blessing our union!`
      navigator.clipboard.writeText(fullText)
      setCopiedAll(true)
      setTimeout(() => setCopiedAll(false), 2500)
    }
  }

  return (
    <>
      {/* Floating Action Button */}
      <div className="gift-couple-fab-container">
        <button
          type="button"
          onClick={() => setShowQuickModal(true)}
          className="gift-couple-fab-btn"
          aria-label="Gift Ngozi & Sorbari"
          title="Send a wedding blessing or browse gift registry"
        >
          <span className="fab-shimmer-sweep" />
          <span className="fab-gift-icon-wrap">
            <Gift size={18} className="fab-lucide-gift" />
            <span className="fab-sparkle-dot">✨</span>
          </span>
          <span className="fab-text-wrap">
            <span className="fab-text-primary">Gift Couple</span>
            <span className="fab-text-sub">Bless Ngozi &amp; Sorbari</span>
          </span>
        </button>
      </div>

      {/* Quick Bank Details & Registry Modal */}
      {showQuickModal && (
        <div 
          className="gift-modal-backdrop reveal-modal-fade" 
          onClick={() => setShowQuickModal(false)}
          role="presentation"
        >
          <div
            className="gift-modal fab-quick-gift-modal reveal-modal-card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="gift-modal-title"
          >
            {/* Close Button */}
            <button
              type="button"
              className="fab-modal-close-btn"
              onClick={() => setShowQuickModal(false)}
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            {/* Modal Header */}
            <div className="fab-modal-header">
              <div className="fab-modal-crest">
                <Sparkles size={14} className="text-gold" />
                <span className="eyebrow">WEDDING REGISTRY &amp; BLESSINGS</span>
                <Sparkles size={14} className="text-gold" />
              </div>
              <h2 id="gift-modal-title">Bless Ngozi &amp; Sorbari</h2>
              <p>
                Your prayers, love, and presence are our greatest treasures. If you wish to honour our new beginning with a financial blessing or wedding gift, you may transfer directly below or select a registry item.
              </p>
            </div>

            {/* VIP Metal Bank Transfer Card */}
            <div className="fab-luxury-bank-card">
              <div className="bank-card-glass-glow" />
              
              <div className="bank-card-top-row">
                <div className="bank-brand-pill">
                  <Building2 size={13} className="text-gold" />
                  <span>{bankDetails.bankName}</span>
                </div>
                <span className="bank-instant-badge">Direct Wire / Transfer</span>
              </div>

              {/* Account Number Main Highlight */}
              <div className="bank-acc-hero-box">
                <div className="acc-label-row">
                  <span className="acc-lbl-text">ACCOUNT NUMBER</span>
                  <span className="acc-tap-hint">Tap to copy</span>
                </div>
                <div className="acc-number-row" onClick={handleCopyAccount}>
                  <strong className="acc-number-display">{bankDetails.accountNumber}</strong>
                  <button
                    type="button"
                    onClick={handleCopyAccount}
                    className={`btn-bank-copy ${copiedAcc ? 'copied' : ''}`}
                    aria-label="Copy account number"
                  >
                    {copiedAcc ? (
                      <>
                        <Check size={14} className="text-emerald" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Account Name */}
              <div className="bank-acc-name-row">
                <span className="acc-name-lbl">ACCOUNT BENEFICIARY</span>
                <strong className="acc-name-val">{bankDetails.accountName}</strong>
              </div>

              {/* Action row to copy all info */}
              <div className="bank-card-footer-actions">
                <button
                  type="button"
                  onClick={handleCopyAllDetails}
                  className="btn-copy-all-details"
                >
                  {copiedAll ? (
                    <>
                      <Check size={13} className="text-emerald" />
                      <span>All Banking Info Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={13} />
                      <span>Copy Full Banking Details</span>
                    </>
                  )}
                </button>
                <span className="bank-narration-hint">
                  💡 Please include your name in the transfer narration
                </span>
              </div>
            </div>

            {/* Registry Divider */}
            <div className="fab-modal-divider">
              <span>OR CHOOSE FROM REGISTRY</span>
            </div>

            {/* Browse Registry Action CTA */}
            <div className="fab-modal-actions">
              <Link
                href="/wishlist"
                className="btn-luxury-registry-cta"
                onClick={() => setShowQuickModal(false)}
              >
                <div className="btn-cta-content">
                  <div className="btn-cta-icon-box">
                    <Gift size={18} />
                  </div>
                  <div className="btn-cta-text">
                    <strong>Browse Gift Registry Catalog</strong>
                    <span>Solar power, kitchen appliances &amp; honeymoon fund</span>
                  </div>
                </div>
                <ArrowRight size={18} className="btn-cta-arrow" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

