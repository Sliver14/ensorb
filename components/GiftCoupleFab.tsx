'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Gift, X, Copy, Check, ExternalLink } from 'lucide-react'
import { bankDetails } from '@/lib/data'

export function GiftCoupleFab() {
  const pathname = usePathname()
  const [showQuickModal, setShowQuickModal] = useState(false)
  const [copied, setCopied] = useState(false)

  // Don't render on admin page
  if (pathname && pathname.startsWith('/admin')) {
    return null
  }

  const handleCopyAccount = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(bankDetails.accountNumber)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
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
          aria-label="Gift Couple"
          title="Bless Ngozi & Sorbari"
        >
          <span className="fab-gift-icon">🎁</span>
          <span className="fab-text">Gift Couple</span>
        </button>
      </div>

      {/* Quick Bank Details / Gift Modal */}
      {showQuickModal && (
        <div className="gift-modal-backdrop" onClick={() => setShowQuickModal(false)}>
          <div
            className="gift-modal fab-quick-gift-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              className="modal-close-btn"
              onClick={() => setShowQuickModal(false)}
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className="fab-modal-header">
              <div className="fab-modal-icon">
                <Gift size={28} />
              </div>
              <span className="eyebrow">WEDDING REGISTRY &amp; GIFTS</span>
              <h2>Bless Ngozi &amp; Sorbari</h2>
              <p>
                You can make an instant bank transfer or select an item from their curated wedding registry.
              </p>
            </div>

            <div className="fab-modal-bank-card">
              <div className="bank-header-pill">Direct Bank Transfer</div>
              <div className="fab-bank-grid">
                <div className="fab-bank-row">
                  <span className="lbl">Bank Name</span>
                  <strong className="val">{bankDetails.bankName}</strong>
                </div>

                <div className="fab-bank-row">
                  <span className="lbl">Account Number</span>
                  <div className="acc-copy-wrap">
                    <strong className="val font-mono">{bankDetails.accountNumber}</strong>
                    <button
                      type="button"
                      onClick={handleCopyAccount}
                      className="btn-quick-copy"
                    >
                      {copied ? (
                        <>
                          <Check size={13} className="text-green" />
                          <span>Copied</span>
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

                <div className="fab-bank-row">
                  <span className="lbl">Account Name</span>
                  <strong className="val text-small">{bankDetails.accountName}</strong>
                </div>
              </div>
            </div>

            <div className="fab-modal-actions">
              <Link
                href="/wishlist"
                className="btn-primary-burgundy w-full"
                onClick={() => setShowQuickModal(false)}
              >
                <Gift size={16} />
                <span>Browse Registry Catalog &amp; Items →</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
