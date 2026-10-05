'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { wishlistItems, WishlistItem, bankDetails } from '@/lib/data'
import {
  SideTallBotanical,
  BotanicalSprig,
  HeroBottomTornWithWash,
  TornBannerEdge,
  GiftBoxIcon,
  BankBuildingIcon,
  CardCornerBotanical,
} from '@/components/WeddingIcons'

type StatusFilter = 'all' | 'needed' | 'gifted'
type SortOption = 'featured' | 'progress-desc' | 'price-asc' | 'price-desc'

export default function WishlistPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [sortBy, setSortBy] = useState<SortOption>('featured')
  
  // Traditional bank details reveal state
  const [showBankDetails, setShowBankDetails] = useState(false)

  // FAQ Accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)

  // Modal state
  const [selectedItem, setSelectedItem] = useState<WishlistItem | null>(null)
  const [contributionMode, setContributionMode] = useState<'full' | 'half' | 'preset50k' | 'preset25k' | 'custom'>('full')
  const [customAmount, setCustomAmount] = useState<string>('')
  const [contributorName, setContributorName] = useState<string>('')
  const [copiedAccount, setCopiedAccount] = useState(false)
  const [copiedRef, setCopiedRef] = useState(false)

  // Lock body scroll and listen for Escape key when modal is open
  useEffect(() => {
    if (!selectedItem) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedItem(null)
    }
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedItem])

  const handleCopy = (text: string, type: 'account' | 'ref') => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text)
      if (type === 'account') {
        setCopiedAccount(true)
        setTimeout(() => setCopiedAccount(false), 2500)
      } else {
        setCopiedRef(true)
        setTimeout(() => setCopiedRef(false), 2500)
      }
    }
  }

  // Calculate high-level stats
  const stats = useMemo(() => {
    const totalItems = wishlistItems.length
    const fullyGifted = wishlistItems.filter(
      (item) => item.isFullyGifted || item.contributedAmount >= item.numericPrice
    ).length
    const inProgress = wishlistItems.filter(
      (item) =>
        !item.isFullyGifted &&
        item.contributedAmount > 0 &&
        item.contributedAmount < item.numericPrice
    ).length
    const openItems = totalItems - fullyGifted

    return { totalItems, fullyGifted, inProgress, openItems }
  }, [])

  // Filter and sort items
  const filteredAndSortedItems = useMemo(() => {
    let result = [...wishlistItems]

    // Status filter
    if (statusFilter === 'needed') {
      result = result.filter(
        (item) => !item.isFullyGifted && item.contributedAmount < item.numericPrice
      )
    } else if (statusFilter === 'gifted') {
      result = result.filter(
        (item) => item.isFullyGifted || item.contributedAmount >= item.numericPrice
      )
    }

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter((item) => item.category === selectedCategory)
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.categoryLabel.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q)
      )
    }

    // Sorting
    if (sortBy === 'progress-desc') {
      result.sort((a, b) => {
        const pctA = Math.min(100, (a.contributedAmount / a.numericPrice) * 100)
        const pctB = Math.min(100, (b.contributedAmount / b.numericPrice) * 100)
        return pctB - pctA
      })
    } else if (sortBy === 'price-asc') {
      result.sort((a, b) => a.numericPrice - b.numericPrice)
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.numericPrice - a.numericPrice)
    }

    return result
  }, [statusFilter, selectedCategory, searchQuery, sortBy])

  // Open modal handler
  const handleOpenModal = (item: WishlistItem) => {
    setSelectedItem(item)
    const remaining = Math.max(0, item.numericPrice - item.contributedAmount)
    if (remaining > 0) {
      setContributionMode('full')
    } else {
      setContributionMode('custom')
    }
    setCustomAmount('')
    setContributorName('')
    setCopiedAccount(false)
    setCopiedRef(false)
  }

  // Calculate chosen contribution amount in modal
  const modalContributionDetails = useMemo(() => {
    if (!selectedItem) return { amount: 0, remaining: 0, percentage: 0, isComplete: false }

    const remaining = Math.max(0, selectedItem.numericPrice - selectedItem.contributedAmount)
    const isComplete = selectedItem.isFullyGifted || remaining === 0
    const percentage = Math.min(
      100,
      Math.round((selectedItem.contributedAmount / selectedItem.numericPrice) * 100)
    )

    let amount = 0
    if (isComplete) {
      amount = Number(customAmount) || 20000
    } else if (contributionMode === 'full') {
      amount = remaining
    } else if (contributionMode === 'half') {
      amount = Math.round(remaining / 2)
    } else if (contributionMode === 'preset50k') {
      amount = Math.min(remaining, 50000)
    } else if (contributionMode === 'preset25k') {
      amount = Math.min(remaining, 25000)
    } else if (contributionMode === 'custom') {
      amount = Number(customAmount.replace(/[^0-9]/g, '')) || 0
    }

    return { amount, remaining, percentage, isComplete }
  }, [selectedItem, contributionMode, customAmount])

  const referenceCode = selectedItem
    ? `Wishlist-${selectedItem.title.replace(/[^a-zA-Z0-9]/g, '').slice(0, 14)}${
        contributorName ? `-${contributorName.trim().replace(/\s+/g, '')}` : ''
      }`
    : ''

  const emailSubject = selectedItem
    ? encodeURIComponent(
        `Wedding Wishlist Contribution - ${selectedItem.title} (₦${modalContributionDetails.amount.toLocaleString()})`
      )
    : ''

  const emailBody = selectedItem
    ? encodeURIComponent(
        `Dear Ngozi & Sorbari,\n\nI am delighted to contribute towards your Wedding Wishlist!\n\n` +
          `• Item: ${selectedItem.title}\n` +
          `• Contribution Amount: ₦${modalContributionDetails.amount.toLocaleString()}\n` +
          `• Reference: ${referenceCode}\n` +
          `• Contributor Name: ${contributorName || '[Your Name]'}\n\n` +
          `Congratulations and praying for endless joy and blessings in your new home!`
      )
    : ''

  const whatsappText = selectedItem
    ? encodeURIComponent(
        `Hello Ngozi & Sorbari! 🎉\n\nI have contributed *₦${modalContributionDetails.amount.toLocaleString()}* towards your wishlist item: *${selectedItem.title}*.\n\nReference: ${referenceCode}\nFrom: ${contributorName || 'Your Well-Wisher'}\n\nCongratulations!`
      )
    : ''

  // Icon mapping for card top-right badges
  const getItemIcon = (item: WishlistItem) => {
    if (item.id === 'honeymoon-fund') return '♡'
    if (item.id === 'new-home-fund') return '⌂'
    if (item.id === 'dinner-for-two') return '🍴'
    if (item.id === 'kitchen-essentials') return '🍳'
    if (item.id === 'weekend-getaway') return '✈'
    if (item.id === 'future-adventures') return '🧭'
    if (item.category === 'kitchen') return '🍳'
    if (item.category === 'tableware') return '🍴'
    return '🎁'
  }

  const wishlistFaqItems = [
    {
      question: 'How do I choose a gift?',
      answer:
        'You can browse our curated wishlist items above, click "Gift This" on any item, and choose whether to fund the entire item or make a partial contribution of any amount that feels comfortable for you.',
    },
    {
      question: 'Can I contribute any amount?',
      answer:
        'Yes, absolutely! Every gift and contribution—no matter the size—is received with immense gratitude. You can choose full, half, preset, or any custom amount in the contribution modal.',
    },
    {
      question: 'Can I send a physical gift?',
      answer:
        'If you would like to arrange delivery of a physical gift item, please reach out to us directly or email hello@ensorb.com and we will gladly share our preferred delivery address.',
    },
    {
      question: 'What if I cannot attend?',
      answer:
        'If you are unable to attend in person, your warm prayers and wishes from afar mean the world to us. You can still leave a loving message for the couple and contribute via this digital wishlist portal.',
    },
  ]

  return (
    <main className="elegant-burgundy-theme wishlist-page-layout">
      <Navbar />

      {/* ====================================================================
          SECTION 1: HERO (A LITTLE SOMETHING FROM YOU)
         ==================================================================== */}
      <section className="wishlist-hero-section">
        {/* Tall botanical foliage on far left */}
        <SideTallBotanical className="wishlist-hero-tall-sprig floating-botanical-sway" />

        <div className="wishlist-hero-container">
          {/* Left Text Block */}
          <div className="wishlist-hero-copy reveal-fade-left">
            <span className="eyebrow-spaced">OUR WEDDING WISHLIST</span>
            <h1 className="wishlist-hero-title">
              A Little Something
              <br />
              From You
              <span className="wishlist-script-subtitle">would mean the world to us ♡</span>
            </h1>
            <p className="wishlist-hero-desc">
              Your presence at our wedding is the greatest gift of all. For those who wish to bless us further, we have curated a wishlist of meaningful gifts to help us build our future together.
            </p>
          </div>

          {/* Right Visual Block: Tilted Polaroid + Names Badge */}
          <div className="wishlist-hero-visual reveal-fade-right">
            <div className="wishlist-polaroid-wrap">
              <div className="washi-polaroid-frame wishlist-hero-polaroid floating-polaroid-motion">
                <div className="washi-tape-strip" />
                <div className="polaroid-photo-inner">
                  <img
                    src="/couple/quote-portrait.jpg"
                    alt="Ngozi & Sorbari loving embrace"
                    className="polaroid-img"
                  />
                </div>
                <BotanicalSprig className="polaroid-botanical-corner floating-botanical-sway" />
              </div>

              {/* Side Names Stamp */}
              <div className="wishlist-names-stamp floating-gentle">
                <span className="stamp-names">NGOZI &amp; SORBARI</span>
                <span className="stamp-date">21 NOVEMBER 2026</span>
                <span className="stamp-heart">♡</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 2: GIFT REGISTRY TORN BURGUNDY RIBBON BANNER
         ==================================================================== */}
      <section className="wishlist-ribbon-section reveal-fade-up">
        <TornBannerEdge position="top" color="#FAF7F2" />

        <div className="wishlist-ribbon-bar">
          <div className="ribbon-inner-grid">
            {/* Left Box Icon */}
            <div className="ribbon-icon-col">
              <div className="ribbon-gift-box">
                <GiftBoxIcon size={32} />
              </div>
            </div>

            {/* Center Content */}
            <div className="ribbon-copy-col">
              <h2 className="ribbon-title">Gift Registry</h2>
              <p className="ribbon-desc">
                Your kindness and generosity mean so much to us. If you would like to give, you can contribute to our wishlist or make a traditional gift (details below).
              </p>
            </div>

            {/* Right Action Button & Botanical Sprig */}
            <div className="ribbon-action-col">
              <a href="#wishlist-grid" className="btn-ribbon-view-registry">
                View Registry <span>→</span>
              </a>
              <BotanicalSprig className="ribbon-botanical-right floating-botanical-sway" />
            </div>
          </div>
        </div>

        <TornBannerEdge position="bottom" color="#FAF7F2" />
      </section>

      {/* ====================================================================
          SECTION 3: OUR WISHLIST (3-COLUMN CARD GRID)
         ==================================================================== */}
      <section className="wishlist-grid-section" id="wishlist-grid">
        <div className="wishlist-section-header reveal-fade-up">
          <span className="eyebrow-spaced">OUR WISHLIST</span>
        </div>

        {/* Filter Controls Bar */}
        <div className="wishlist-controls-bar reveal-fade-up">
          <div className="wishlist-status-tabs" role="tablist" aria-label="Filter wishlist by gift status">
            <button
              type="button"
              role="tab"
              aria-selected={statusFilter === 'all'}
              className={`status-tab-btn ${statusFilter === 'all' ? 'active' : ''}`}
              onClick={() => setStatusFilter('all')}
            >
              <span className="status-tab-text">
                <span className="tab-full-label">All Wishlist</span>
                <span className="tab-short-label">All</span>
              </span>
              <span className="status-tab-count">{stats.totalItems}</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={statusFilter === 'needed'}
              className={`status-tab-btn ${statusFilter === 'needed' ? 'active' : ''}`}
              onClick={() => setStatusFilter('needed')}
            >
              <span className="status-tab-text">
                <span className="tab-full-label">Still Needed</span>
                <span className="tab-short-label">Needed</span>
              </span>
              <span className="status-tab-count">{stats.openItems}</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={statusFilter === 'gifted'}
              className={`status-tab-btn ${statusFilter === 'gifted' ? 'active' : ''}`}
              onClick={() => setStatusFilter('gifted')}
            >
              <span className="tab-check-icon" aria-hidden="true">✓</span>
              <span className="status-tab-text">
                <span className="tab-full-label">100% Gifted</span>
                <span className="tab-short-label">Gifted</span>
              </span>
              <span className="status-tab-count">{stats.fullyGifted}</span>
            </button>
          </div>

          <div className="wishlist-search-wrap">
            <span className="search-icon" aria-hidden="true">🔍</span>
            <input
              type="text"
              placeholder="Search wishlist items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="wishlist-search-input"
              aria-label="Search wishlist items"
            />
            {searchQuery && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search query"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* 3-Column Card Grid */}
        {filteredAndSortedItems.length > 0 ? (
          <div className="wishlist-cards-grid reveal-stagger">
            {filteredAndSortedItems.map((item) => {
              const percent = Math.min(
                100,
                Math.round((item.contributedAmount / item.numericPrice) * 100)
              )
              const isGifted100 = item.isFullyGifted || percent >= 100
              const itemIcon = getItemIcon(item)

              return (
                <article
                  key={item.id}
                  className={`wishlist-fund-card ${isGifted100 ? 'is-complete' : ''}`}
                >
                  {/* Card Image */}
                  <div
                    className="fund-card-image-wrap"
                    onClick={() => handleOpenModal(item)}
                  >
                    <img src={item.image} alt={item.title} loading="lazy" />
                  </div>

                  {/* Card Content */}
                  <div className="fund-card-body">
                    <div className="fund-card-header-row">
                      <h3 className="fund-card-title">{item.title}</h3>
                      <span className="fund-card-icon" title={item.categoryLabel}>
                        {itemIcon}
                      </span>
                    </div>

                    <p className="fund-card-desc">{item.description}</p>

                    <div className="fund-card-price-row">
                      <span className="fund-target-price">{item.price}</span>
                      <span className="fund-percent-label">{percent}% funded</span>
                    </div>

                    {/* Green Two-Tone Progress Bar */}
                    <div className="fund-progress-track">
                      <div
                        className="fund-progress-fill"
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    {/* Card Action Button */}
                    <button
                      type="button"
                      className={`btn-gift-this-card ${isGifted100 ? 'btn-complete' : ''}`}
                      onClick={() => handleOpenModal(item)}
                    >
                      {isGifted100 ? '100% Gifted' : 'Gift This'}
                    </button>

                    {/* Botanical corner sprig tucked at bottom right */}
                    <CardCornerBotanical className="fund-card-corner-botanical" />
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <div className="no-gifts-found">
            <p>No wishlist items match your search or filter.</p>
            <button
              type="button"
              className="reset-search-btn"
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('all')
                setStatusFilter('all')
              }}
            >
              Reset Filters &amp; View All
            </button>
          </div>
        )}
      </section>

      {/* ====================================================================
          SECTION 4: YOUR LOVE IS THE GREATEST GIFT
         ==================================================================== */}
      <section className="wishlist-love-section">
        {/* Soft Blush Watercolor Wash Underlayer */}
        <div className="wishlist-love-wash-bg" />

        <div className="wishlist-love-container">
          {/* Left Text */}
          <div className="wishlist-love-copy">
            <span className="eyebrow-spaced">OUR GREATEST GIFT</span>
            <h2 className="wishlist-love-title">
              Your Love Is The
              <br />
              Greatest Gift <span className="script-heart">♡</span>
            </h2>
            <p className="wishlist-love-desc">
              No gift is more meaningful than your love, support and presence. We are truly grateful to have you in our lives and to share this special moment with you.
            </p>
          </div>

          {/* Right Polaroid Photo */}
          <div className="wishlist-love-visual">
            <div className="washi-polaroid-frame wishlist-love-polaroid">
              <div className="washi-tape-strip" />
              <div className="polaroid-photo-inner">
                <img
                  src="/couple/hero-portrait.png"
                  alt="Ngozi & Sorbari in black & velvet attire"
                  className="polaroid-img"
                />
              </div>
              <BotanicalSprig className="polaroid-botanical-corner" />
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 5: PREFER SOMETHING TRADITIONAL? (BANK TRANSFER / CASH GIFT)
         ==================================================================== */}
      <section className="wishlist-traditional-section">
        <div className="traditional-section-inner">
          <span className="eyebrow-spaced">PREFER SOMETHING TRADITIONAL?</span>

          <div className="traditional-bank-card">
            {/* Left Column */}
            <div className="bank-intro-col">
              <div className="bank-icon-wrap">
                <BankBuildingIcon size={36} />
              </div>
              <div className="bank-intro-text">
                <h3 className="bank-card-heading">Bank Transfer / Cash Gift</h3>
                <p className="bank-card-desc">
                  If you prefer to give a cash gift or make a bank transfer, please use the details below. You can also contact us for the account details.
                </p>
              </div>
            </div>

            {/* Right Column: Reveal Box */}
            <div className="bank-reveal-col">
              {!showBankDetails ? (
                <div className="bank-locked-box">
                  <div className="lock-icon-circle">🔒</div>
                  <div className="locked-copy">
                    <strong>Account Details Hidden</strong>
                    <p>For security reasons, our bank details are hidden on this page.</p>
                  </div>
                  <button
                    type="button"
                    className="btn-show-bank-details"
                    onClick={() => setShowBankDetails(true)}
                  >
                    Show Details
                  </button>
                </div>
              ) : (
                <div className="bank-unlocked-box">
                  <div className="unlocked-header">
                    <span className="secure-badge">✓ Official Wedding Account</span>
                    <button
                      type="button"
                      className="btn-hide-bank-details"
                      onClick={() => setShowBankDetails(false)}
                    >
                      Hide
                    </button>
                  </div>

                  <div className="bank-details-grid">
                    <div className="bank-detail-item">
                      <span className="lbl">Bank Name:</span>
                      <strong>{bankDetails.bankName}</strong>
                    </div>
                    <div className="bank-detail-item">
                      <span className="lbl">Account Number:</span>
                      <div className="acct-copy-row">
                        <strong className="font-mono acct-num">{bankDetails.accountNumber}</strong>
                        <button
                          type="button"
                          className="btn-copy-num"
                          onClick={() => handleCopy(bankDetails.accountNumber, 'account')}
                        >
                          {copiedAccount ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                    </div>
                    <div className="bank-detail-item">
                      <span className="lbl">Account Name:</span>
                      <strong className="acct-name">{bankDetails.accountName}</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 6: FREQUENTLY ASKED QUESTIONS
         ==================================================================== */}
      <section className="wishlist-faq-section">
        <div className="wishlist-faq-inner">
          <span className="eyebrow-spaced">FREQUENTLY ASKED QUESTIONS</span>

          <div className="faq-accordions-list">
            {wishlistFaqItems.map((item, index) => {
              const isOpen = openFaqIndex === index
              return (
                <div
                  key={item.question}
                  className={`wishlist-faq-item ${isOpen ? 'is-open' : ''}`}
                >
                  <button
                    type="button"
                    className="wishlist-faq-btn"
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                  >
                    <span className="faq-q-text">{item.question}</span>
                    <span className="faq-chevron">{isOpen ? '∧' : '∨'}</span>
                  </button>
                  {isOpen && (
                    <div className="wishlist-faq-body">
                      <p>{item.answer}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Interactive Contribution & Gift Modal */}
      {selectedItem && (
        <div className="gift-modal-backdrop" onClick={() => setSelectedItem(null)}>
          <div
            className="gift-modal wishlist-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <button
              className="modal-close-btn"
              onClick={() => setSelectedItem(null)}
              aria-label="Close dialog"
            >
              ✕
            </button>

            <div className="modal-grid">
              <div className="modal-photo">
                <img src={selectedItem.image} alt={selectedItem.title} />
                {modalContributionDetails.isComplete && (
                  <div className="modal-complete-overlay">
                    <span>🎉 100% Gifted</span>
                  </div>
                )}
              </div>

              <div className="modal-info">
                <div className="modal-header-tag-row">
                  <span className="modal-tag">{selectedItem.categoryLabel}</span>
                  {modalContributionDetails.isComplete ? (
                    <span className="badge-gifted-100-modal">✓ Fully Gifted</span>
                  ) : (
                    <span className="badge-in-progress-modal">
                      {modalContributionDetails.percentage}% Funded
                    </span>
                  )}
                </div>

                <h2>{selectedItem.title}</h2>
                <div className="modal-price-tag">{selectedItem.price}</div>
                <p className="modal-summary">{selectedItem.description}</p>

                {/* Progress Bar inside Modal */}
                <div className="modal-progress-box">
                  <div className="modal-progress-bar-wrap">
                    <div
                      className={`wishlist-progress-fill ${
                        modalContributionDetails.isComplete ? 'fill-complete' : ''
                      }`}
                      style={{ width: `${modalContributionDetails.percentage}%` }}
                    />
                  </div>
                  <div className="modal-progress-stats">
                    <span>
                      Contributed: <strong>₦{selectedItem.contributedAmount.toLocaleString()}</strong>
                    </span>
                    <span>
                      {modalContributionDetails.isComplete ? (
                        <strong className="text-gold">100% Gifted</strong>
                      ) : (
                        `Remaining: ₦${modalContributionDetails.remaining.toLocaleString()}`
                      )}
                    </span>
                  </div>
                </div>

                {/* Contribution Mode Selection */}
                {modalContributionDetails.isComplete ? (
                  <div className="modal-completed-notice">
                    <div className="notice-icon">🎉</div>
                    <div>
                      <strong>This item has been 100% gifted!</strong>
                      <p>
                        Thank you to our amazing contributors. If you would still like to bless us with a general cash gift, you can transfer to our wedding account below.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="modal-contribution-selector">
                    <label className="selector-label">Choose Contribution Amount:</label>
                    <div className="contribution-chips-grid">
                      <button
                        type="button"
                        className={`chip-btn ${contributionMode === 'full' ? 'active' : ''}`}
                        onClick={() => setContributionMode('full')}
                      >
                        <span className="chip-title">Full Remaining</span>
                        <span className="chip-amt">₦{modalContributionDetails.remaining.toLocaleString()}</span>
                      </button>

                      <button
                        type="button"
                        className={`chip-btn ${contributionMode === 'half' ? 'active' : ''}`}
                        onClick={() => setContributionMode('half')}
                      >
                        <span className="chip-title">50% Share</span>
                        <span className="chip-amt">
                          ₦{Math.round(modalContributionDetails.remaining / 2).toLocaleString()}
                        </span>
                      </button>

                      {modalContributionDetails.remaining >= 50000 && (
                        <button
                          type="button"
                          className={`chip-btn ${contributionMode === 'preset50k' ? 'active' : ''}`}
                          onClick={() => setContributionMode('preset50k')}
                        >
                          <span className="chip-title">Contribution</span>
                          <span className="chip-amt">₦50,000</span>
                        </button>
                      )}

                      {modalContributionDetails.remaining >= 25000 && (
                        <button
                          type="button"
                          className={`chip-btn ${contributionMode === 'preset25k' ? 'active' : ''}`}
                          onClick={() => setContributionMode('preset25k')}
                        >
                          <span className="chip-title">Contribution</span>
                          <span className="chip-amt">₦25,000</span>
                        </button>
                      )}

                      <button
                        type="button"
                        className={`chip-btn ${contributionMode === 'custom' ? 'active' : ''}`}
                        onClick={() => setContributionMode('custom')}
                      >
                        <span className="chip-title">Custom Amount</span>
                        <span className="chip-amt">Enter value</span>
                      </button>
                    </div>

                    {contributionMode === 'custom' && (
                      <div className="custom-amount-input-wrap">
                        <span className="currency-prefix">₦</span>
                        <input
                          type="number"
                          placeholder="e.g. 15000"
                          min="1000"
                          max={modalContributionDetails.remaining}
                          value={customAmount}
                          onChange={(e) => setCustomAmount(e.target.value)}
                          className="custom-amount-field"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Contributor Name Input */}
                <div className="contributor-name-input-box">
                  <label htmlFor="contributorName">Your Name / Family Name (Optional):</label>
                  <input
                    id="contributorName"
                    type="text"
                    placeholder="e.g. Uncle John &amp; Aunt Mary"
                    value={contributorName}
                    onChange={(e) => setContributorName(e.target.value)}
                  />
                </div>

                {/* Bank Account Transfer Box */}
                <div className="modal-bank-transfer-card">
                  <div className="transfer-header">
                    <span className="transfer-badge">Direct Bank Transfer</span>
                    <span className="transfer-note">Instant Confirmation</span>
                  </div>

                  <div className="transfer-details">
                    <div className="transfer-row">
                      <span className="transfer-label">Bank:</span>
                      <strong>{bankDetails.bankName}</strong>
                    </div>

                    <div className="transfer-row">
                      <span className="transfer-label">Account Number:</span>
                      <div className="copy-num-group">
                        <strong className="font-mono text-burgundy">
                          {bankDetails.accountNumber}
                        </strong>
                        <button
                          type="button"
                          className="copy-btn-sm"
                          onClick={() => handleCopy(bankDetails.accountNumber, 'account')}
                        >
                          {copiedAccount ? '✓ Copied' : 'Copy'}
                        </button>
                      </div>
                    </div>

                    <div className="transfer-row">
                      <span className="transfer-label">Account Name:</span>
                      <strong className="account-name-text">{bankDetails.accountName}</strong>
                    </div>

                    <div className="transfer-row reference-row">
                      <span className="transfer-label">Transfer Ref / Narration:</span>
                      <div className="copy-num-group">
                        <code className="font-mono ref-code">{referenceCode}</code>
                        <button
                          type="button"
                          className="copy-btn-sm"
                          onClick={() => handleCopy(referenceCode, 'ref')}
                        >
                          {copiedRef ? '✓ Copied' : 'Copy'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Direct Action Notification Buttons */}
                <div className="modal-actions-grid">
                  <a
                    href={`https://wa.me/?text=${whatsappText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp-notify"
                  >
                    <span>💬</span> Notify Couple via WhatsApp
                  </a>

                  <a
                    href={`mailto:hello@ensorb.com?subject=${emailSubject}&body=${emailBody}`}
                    className="btn-email-notify"
                  >
                    <span>✉️</span> Notify via Email
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </main>
  )
}
