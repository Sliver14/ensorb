'use client'

import { useState } from 'react'
import Link from 'next/link'
import { bankDetails } from '@/lib/data'
import { Gift, Copy, Check, Heart, ArrowRight } from 'lucide-react'
import { BotanicalSprig } from '@/components/WeddingIcons'

interface GiftCoupleBannerProps {
  variant?: 'footer' | 'registration' | 'compact'
}

export function GiftCoupleBanner({ variant = 'footer' }: GiftCoupleBannerProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyAccount = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(bankDetails.accountNumber)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  if (variant === 'registration') {
    return (
      <div className="gift-couple-post-reg-card">
        <div className="post-reg-header">
          <div className="gift-icon-badge">
            <Gift size={24} />
          </div>
          <span className="eyebrow-accent">— BLESS THE COUPLE —</span>
          <h3>Would You Love to Send a Wedding Gift?</h3>
          <p>
            Your love, prayers, and attendance mean everything to us. If you feel led to bless Ngozi &amp; Sorbari as they begin their home together, you can send a direct transfer or pick an item from our registry catalog.
          </p>
        </div>

        {/* Bank Account Details Box */}
        <div className="post-reg-bank-card">
          <div className="bank-info-col">
            <span className="bank-label">Direct Bank Transfer (Nigeria)</span>
            <div className="bank-meta-row">
              <strong className="bank-name">{bankDetails.bankName}</strong>
              <span className="bank-acc-name">{bankDetails.accountName}</span>
            </div>
            <div className="bank-num-row">
              <span className="acc-number-text">{bankDetails.accountNumber}</span>
              <button
                type="button"
                onClick={handleCopyAccount}
                className="btn-copy-account"
                title="Copy Account Number"
              >
                {copied ? (
                  <>
                    <Check size={14} className="text-green" />
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
        </div>

        <div className="post-reg-actions">
          <Link href="/wishlist" className="btn-gift-wishlist-cta">
            <Gift size={16} />
            <span>Browse Gift Registry Catalog</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <section className="gift-couple-footer-banner">
      <div className="gift-banner-inner">
        <BotanicalSprig className="banner-botanical-left" />
        <BotanicalSprig className="banner-botanical-right" />

        <div className="gift-banner-content">
          <div className="gift-banner-icon-wrap">
            <Gift size={28} />
          </div>

          <span className="eyebrow-spaced">— BLESS THE COUPLE —</span>
          <h2 className="gift-banner-title">Gift Ngozi &amp; Sorbari</h2>
          <p className="gift-banner-desc">
            As we step into this beautiful lifetime journey, your prayers, love, and presence are our greatest treasures. If you wish to honour us with a wedding gift or financial blessing, you may transfer directly or browse our registry catalog.
          </p>

          {/* Bank Transfer Box */}
          <div className="gift-banner-bank-box">
            <div className="bank-tag-pill">Official Wedding Account</div>
            <div className="bank-details-grid">
              <div className="bank-detail-item">
                <span className="lbl">Bank</span>
                <strong className="val">{bankDetails.bankName}</strong>
              </div>
              <div className="bank-detail-item">
                <span className="lbl">Account Number</span>
                <div className="acc-copy-group">
                  <strong className="val acc-num">{bankDetails.accountNumber}</strong>
                  <button
                    type="button"
                    onClick={handleCopyAccount}
                    className="btn-copy-mini"
                    title="Copy Account Number"
                  >
                    {copied ? <Check size={13} className="text-green" /> : <Copy size={13} />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
              <div className="bank-detail-item full-span">
                <span className="lbl">Account Name</span>
                <strong className="val name-val">{bankDetails.accountName}</strong>
              </div>
            </div>
          </div>

          <div className="gift-banner-button-row">
            <Link href="/wishlist" className="btn-gift-couple-primary">
              <Gift size={16} />
              <span>Explore Gift Registry Items</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
