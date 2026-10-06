'use client'

import { useState, useMemo, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
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
  const [items, setItems] = useState<WishlistItem[]>(wishlistItems)
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
  const [contributorEmail, setContributorEmail] = useState<string>('')
  const [contributorPhone, setContributorPhone] = useState<string>('')
  const [customNote, setCustomNote] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [successDetails, setSuccessDetails] = useState<{ amount: number; reference: string; itemTitle: string } | null>(null)
  const [copiedAccount, setCopiedAccount] = useState(false)
  const [copiedRef, setCopiedRef] = useState(false)
  const [copiedTraditionalAccount, setCopiedTraditionalAccount] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Fetch live gifts from backend
  const fetchGifts = async () => {
    try {
      const res = await fetch('/api/gifts')
      const data = await res.json()
      if (data.success && Array.isArray(data.gifts) && data.gifts.length > 0) {
        setItems(data.gifts)
      }
    } catch {
      // Fallback silently to initial data
    }
  }

  useEffect(() => {
    setMounted(true)
    fetchGifts()
  }, [])

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

  const handleCopy = (text: string, type: 'account' | 'ref' | 'traditional') => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text)
      if (type === 'account') {
        setCopiedAccount(true)
        setTimeout(() => setCopiedAccount(false), 2500)
      } else if (type === 'ref') {
        setCopiedRef(true)
        setTimeout(() => setCopiedRef(false), 2500)
      } else if (type === 'traditional') {
        setCopiedTraditionalAccount(true)
        setTimeout(() => setCopiedTraditionalAccount(false), 2500)
      }
    }
  }

  // Calculate stats
  const stats = useMemo(() => {
    const totalItems = items.length
    const fullyGifted = items.filter(
      (item) => item.isFullyGifted || item.contributedAmount >= item.numericPrice
    ).length
    const inProgress = items.filter(
      (item) =>
        !item.isFullyGifted &&
        item.contributedAmount > 0 &&
        item.contributedAmount < item.numericPrice
    ).length
    const openItems = totalItems - fullyGifted

    return { totalItems, fullyGifted, inProgress, openItems }
  }, [items])

  // Filter and sort items
  const filteredAndSortedItems = useMemo(() => {
    let result = [...items]

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

    // Search query filter
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
  }, [items, statusFilter, selectedCategory, searchQuery, sortBy])

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
    setContributorEmail('')
    setContributorPhone('')
    setCustomNote('')
    setIsSubmitting(false)
    setSubmitSuccess(false)
    setSuccessDetails(null)
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

  // Generate Reference Code
  const referenceCode = useMemo(() => {
    if (!selectedItem) return 'GIFT-NS2026'
    const cleanId = selectedItem.id.replace(/[^a-zA-Z0-9]/g, '').substring(0, 5).toUpperCase()
    return `GIFT-${cleanId}`
  }, [selectedItem])

  // Handle submitting contribution
  const handleConfirmTransferSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedItem) return

    if (!contributorName.trim()) {
      alert('Please enter your Name or Family Name.')
      return
    }

    if (modalContributionDetails.amount <= 0) {
      alert('Please choose or enter a valid contribution amount.')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/gifts/contribute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          giftId: selectedItem.id,
          giftTitle: selectedItem.title,
          contributorName,
          contributorEmail,
          contributorPhone,
          amount: modalContributionDetails.amount,
          paymentReference: referenceCode,
          customNote,
        }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setSubmitSuccess(true)
        setSuccessDetails({
          amount: modalContributionDetails.amount,
          reference: referenceCode,
          itemTitle: selectedItem.title,
        })
        fetchGifts()
      } else {
        alert(data.error || 'Failed to submit gift contribution.')
      }
    } catch {
      alert('Network error while recording gift contribution. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Pre-filled notification links
  const formattedAmt = modalContributionDetails.amount.toLocaleString()
  const whatsappText = encodeURIComponent(
    `Hello Ngozi & Sorbari! ❤️ I have made a gift contribution of ₦${formattedAmt} towards "${selectedItem?.title}" (Ref: ${referenceCode}). With love from ${contributorName || 'a well wisher'}!`
  )
  const emailSubject = encodeURIComponent(
    `Wedding Gift Contribution — ${selectedItem?.title} (Ref: ${referenceCode})`
  )
  const emailBody = encodeURIComponent(
    `Dear Ngozi & Sorbari,\n\nI have made a gift transfer of ₦${formattedAmt} towards "${selectedItem?.title}".\n\nTransfer Reference: ${referenceCode}\nFrom: ${contributorName || 'Friend / Family'}\nNote: ${customNote || 'Warmest congratulations!'}\n\nCongratulations on your holy matrimony!\n`
  )

  const faqList = [
    {
      q: 'How does item gifting & contribution work?',
      a: 'You can choose to gift the entire remaining balance of an item or contribute any partial amount of your choice. Once your bank transfer is made, you can submit the confirmation form with your transfer reference.',
    },
    {
      q: 'Can I send a general cash blessing instead of a specific item?',
      a: 'Yes, absolutely! You can use the "Traditional Cash Blessings" section below to make a direct transfer of any amount to the couple\'s designated joint wedding account.',
    },
    {
      q: 'Is there a minimum or maximum contribution amount?',
      a: 'There is no minimum or maximum limit. Every gift and contribution—large or small—is received with immense gratitude and love.',
    },
    {
      q: 'How do I ensure my transfer is acknowledged?',
      a: 'Please use the unique Transfer Reference provided in the modal as your bank transfer narration/remark, then submit the confirmation form or notify the couple via WhatsApp or Email.',
    },
  ]

  return (
    <main className="elegant-burgundy-theme wishlist-page-layout">
      {/* ====================================================================
          SECTION 1: HERO
         ==================================================================== */}
      <section className="wishlist-hero-section">
        <SideTallBotanical className="wishlist-hero-tall-sprig floating-botanical-sway" />

        <div className="wishlist-hero-container">
          {/* Left Text Block */}
          <div className="wishlist-hero-copy reveal-fade-left">
            <span className="eyebrow-spaced">— CELEBRATION &amp; REGISTRY —</span>

            <h1 className="wishlist-hero-title">
              A Little Something
              <span className="wishlist-script-subtitle">From You to Us</span>
            </h1>

            <p className="wishlist-hero-desc">
              Your presence, prayers, and warm love are our greatest gifts. For friends and
              family who wish to celebrate us with a home contribution or blessing, we have
              curated items to help us build our new beginning together.
            </p>

            <div style={{ display: 'flex', gap: '14px', marginTop: '28px', flexWrap: 'wrap' }}>
              <a
                href="#registry-grid"
                className="btn-ribbon-view-registry"
                style={{
                  background: '#4A1525',
                  color: '#FAF7F2',
                  boxShadow: '0 4px 14px rgba(74, 21, 37, 0.25)',
                }}
              >
                <span>Browse Registry</span>
                <span>↓</span>
              </a>
              <a
                href="#traditional-gifts"
                className="btn-ribbon-view-registry"
                style={{
                  background: '#FAF7F2',
                  color: '#4A1525',
                  border: '1px solid #D5CDC0',
                }}
              >
                <span>Direct Cash Blessing</span>
                <span>→</span>
              </a>
            </div>
          </div>

          {/* Right Visual Block: Polaroid Frame */}
          <div className="wishlist-hero-visual reveal-fade-right">
            <div className="wishlist-polaroid-wrap">
              <div className="washi-polaroid-frame wishlist-hero-polaroid">
                <div className="washi-tape-strip" />
                <div className="polaroid-photo-inner">
                  <img
                    src="/couple/quote-portrait.jpg"
                    alt="Ngozi & Sorbari loving portrait"
                    className="polaroid-img"
                    loading="lazy"
                    decoding="async"
                  />
                  <CardCornerBotanical className="polaroid-botanical-corner" />
                </div>
              </div>

              {/* Names Stamp Badge */}
              <div className="wishlist-names-stamp">
                <span>NGOZI &amp; SORBARI</span>
                <span className="stamp-heart">♡</span>
                <span>2026</span>
              </div>
            </div>
          </div>
        </div>

        <HeroBottomTornWithWash />
      </section>

      {/* ====================================================================
          SECTION 2: RIBBON BANNER
         ==================================================================== */}
      <section className="wishlist-ribbon-section">
        <TornBannerEdge position="top" color="#FAF7F2" />

        <div className="wishlist-ribbon-bar">
          <div className="ribbon-inner-grid">
            <div className="ribbon-icon-col">
              <div className="ribbon-gift-box">
                <GiftBoxIcon />
              </div>
            </div>

            <div className="ribbon-copy-col">
              <h2 className="ribbon-title">Building Our Home With Love</h2>
              <p className="ribbon-desc">
                Every contribution brings us one step closer to setting up our new beginning together.
                You can contribute any amount towards our wishlist or gift an entire item.
              </p>
            </div>

            <div className="ribbon-action-col">
              <a href="#registry-grid" className="btn-ribbon-view-registry">
                <span>View Wishlist</span>
                <span>↓</span>
              </a>
              <BotanicalSprig className="ribbon-botanical-right" />
            </div>
          </div>
        </div>

        <TornBannerEdge position="bottom" color="#FAF7F2" />
      </section>

      {/* ====================================================================
          SECTION 3: OUR WISHLIST GRID
         ==================================================================== */}
      <section className="wishlist-grid-section" id="registry-grid">
        {/* Section Header */}
        <div className="wishlist-section-header reveal-fade-up">
          <span className="eyebrow-spaced">— OUR CURATED REGISTRY —</span>
          <h2
            className="font-serif"
            style={{
              fontSize: 'clamp(32px, 4.5vw, 46px)',
              margin: '0 0 12px',
              color: '#3D101C',
              fontWeight: 500,
            }}
          >
            Wedding Registry Items
          </h2>
          <p
            style={{
              maxWidth: '600px',
              margin: '0 auto',
              color: '#6B6056',
              fontSize: '15px',
              lineHeight: 1.7,
            }}
          >
            Select an item to gift in full, contribute any portion of your choice, or help complete a goal in progress.
          </p>
        </div>

        {/* Controls Bar: Status Tabs + Search */}
        <div className="wishlist-controls-bar reveal-fade-up">
          {/* Status Tabs */}
          <div className="wishlist-status-tabs">
            <button
              type="button"
              className={`status-tab-btn ${statusFilter === 'all' ? 'active' : ''}`}
              onClick={() => setStatusFilter('all')}
            >
              <span className="status-tab-text">
                <span className="tab-full-label">All Items</span>
                <span className="tab-short-label">All</span>
              </span>
              <span className="status-tab-count">{stats.totalItems}</span>
            </button>

            <button
              type="button"
              className={`status-tab-btn ${statusFilter === 'needed' ? 'active' : ''}`}
              onClick={() => setStatusFilter('needed')}
            >
              <span className="status-tab-text">
                <span className="tab-full-label">Needs Gifting</span>
                <span className="tab-short-label">Open</span>
              </span>
              <span className="status-tab-count">{stats.openItems}</span>
            </button>

            <button
              type="button"
              className={`status-tab-btn ${statusFilter === 'gifted' ? 'active' : ''}`}
              onClick={() => setStatusFilter('gifted')}
            >
              <span className="tab-check-icon">✓</span>
              <span className="status-tab-text">
                <span className="tab-full-label">Fully Gifted</span>
                <span className="tab-short-label">Gifted</span>
              </span>
              <span className="status-tab-count">{stats.fullyGifted}</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="wishlist-search-wrap">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search items (e.g. Inverter, Blender)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="wishlist-search-input"
            />
            {searchQuery && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Category Pills & Sort Bar */}
        <div className="category-filter-row reveal-fade-up">
          <div className="category-pills-wrap">
            <button
              type="button"
              className={`category-pill-btn ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              All Categories
            </button>
            <button
              type="button"
              className={`category-pill-btn ${selectedCategory === 'appliances' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('appliances')}
            >
              ⚡ Appliances &amp; Power
            </button>
            <button
              type="button"
              className={`category-pill-btn ${selectedCategory === 'kitchen' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('kitchen')}
            >
              🍳 Kitchen Essentials
            </button>
            <button
              type="button"
              className={`category-pill-btn ${selectedCategory === 'tableware' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('tableware')}
            >
              🍽️ Dining &amp; Tableware
            </button>
          </div>

          <div className="sort-dropdown-wrap">
            <span style={{ fontSize: '11.5px', color: '#7A6F64', fontWeight: 600 }}>Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="sort-select-input"
            >
              <option value="featured">Featured First</option>
              <option value="progress-desc">Highest Progress</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* 3-Column Card Grid */}
        <div style={{ marginTop: '28px' }}>
          {filteredAndSortedItems.length === 0 ? (
            <div className="no-gifts-found">
              <p style={{ fontSize: '16px', fontWeight: 600, color: '#3D101C', marginBottom: '6px' }}>
                No matching wishlist items found.
              </p>
              <p style={{ fontSize: '13.5px', color: '#7A6F64', margin: 0 }}>
                Try adjusting your search query or selecting a different category.
              </p>
              <button
                type="button"
                className="reset-search-btn"
                onClick={() => {
                  setSearchQuery('')
                  setStatusFilter('all')
                  setSelectedCategory('all')
                }}
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="wishlist-cards-grid">
              {filteredAndSortedItems.map((item) => {
                const remaining = Math.max(0, item.numericPrice - item.contributedAmount)
                const percentage = Math.min(
                  100,
                  Math.round((item.contributedAmount / item.numericPrice) * 100)
                )
                const isCompleted = item.isFullyGifted || percentage >= 100

                return (
                  <article
                    key={item.id}
                    className={`wishlist-fund-card ${isCompleted ? 'is-complete' : ''}`}
                  >
                    {/* Media Wrap */}
                    <div
                      className="fund-card-image-wrap"
                      onClick={() => handleOpenModal(item)}
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        loading="lazy"
                      />

                      {/* Top Badges */}
                      <div className="fund-card-badges">
                        <span className="category-badge-tag">{item.categoryLabel}</span>
                        {isCompleted ? (
                          <span className="status-badge-chip funded">✓ Fully Gifted</span>
                        ) : percentage > 0 ? (
                          <span className="status-badge-chip progress">{percentage}% Funded</span>
                        ) : null}
                      </div>

                      {item.featured && (
                        <div className="featured-priority-ribbon">
                          ★ Priority
                        </div>
                      )}
                    </div>

                    {/* Body */}
                    <div className="fund-card-body">
                      <div className="fund-card-header-row">
                        <h3 className="fund-card-title">{item.title}</h3>
                        <span className="fund-card-icon" title={item.categoryLabel}>
                          {item.category === 'kitchen' ? '🍳' : item.category === 'tableware' ? '🍽️' : '⚡'}
                        </span>
                      </div>

                      <p className="fund-card-desc">{item.description}</p>

                      {/* Pricing & Progress Header */}
                      <div className="fund-card-price-row">
                        <span className="fund-target-price">{item.price}</span>
                        <span className="fund-percent-label">
                          {isCompleted
                            ? '✓ 100% Goal Reached'
                            : `₦${item.contributedAmount.toLocaleString()} raised (${percentage}%)`}
                        </span>
                      </div>

                      {/* Progress Track */}
                      <div className="fund-progress-track">
                        <div
                          className="fund-progress-fill"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>

                      {/* Action Button */}
                      <button
                        type="button"
                        className={`btn-gift-this-card ${isCompleted ? 'btn-complete' : ''}`}
                        onClick={() => handleOpenModal(item)}
                      >
                        {isCompleted ? 'View Details / Extra Blessing →' : 'Contribute or Gift Item 🎁'}
                      </button>

                      {/* Corner Botanical Accent */}
                      <CardCornerBotanical className="fund-card-corner-botanical" />
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* ====================================================================
          SECTION 4: YOUR LOVE IS THE GREATEST GIFT
         ==================================================================== */}
      <section className="wishlist-love-section">
        <div className="wishlist-love-wash-bg" />

        <div className="wishlist-love-container">
          <div className="wishlist-love-copy reveal-fade-left">
            <span className="eyebrow-spaced">— A HEARTFELT NOTE —</span>
            <h2 className="wishlist-love-title">
              Your Love is the Greatest Gift{' '}
              <span className="script-heart">of All</span>
            </h2>
            <p className="wishlist-love-desc">
              From serving together in campus fellowship to stepping into God&apos;s beautiful plan
              for our lives, your love, prayers, and presence in our journey mean everything to us.
              Thank you for celebrating our union and being a vital part of our story!
            </p>
          </div>

          <div className="wishlist-love-visual reveal-fade-right">
            <div className="washi-polaroid-frame wishlist-love-polaroid">
              <div className="washi-tape-strip" />
              <div className="polaroid-photo-inner">
                <img
                  src="/couple/hero-portrait.png"
                  alt="Ngozi & Sorbari heartfelt portrait"
                  className="polaroid-img"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 5: TRADITIONAL CASH BLESSINGS (BANK TRANSFER)
         ==================================================================== */}
      <section className="wishlist-traditional-section" id="traditional-gifts">
        <div className="traditional-section-inner reveal-fade-up">
          <span className="eyebrow-spaced">— TRADITIONAL CASH BLESSINGS —</span>

          <div className="traditional-bank-card">
            {/* Left Column: Icon & Intro */}
            <div className="bank-intro-col">
              <div className="bank-icon-wrap">
                <BankBuildingIcon />
              </div>
              <div className="bank-intro-text">
                <h3 className="bank-card-heading">Direct Wedding Cash Account</h3>
                <p className="bank-card-desc">
                  For general monetary blessings, traditional cash gifts, or direct support towards
                  our wedding celebrations and future together.
                </p>
              </div>
            </div>

            {/* Right Column: Interactive Reveal / Account Box */}
            <div className="bank-reveal-col">
              {!showBankDetails ? (
                <div className="bank-locked-box">
                  <div className="lock-icon-circle">🎁</div>
                  <div className="locked-copy">
                    <strong>Direct Bank Transfer Details</strong>
                    <p>Click below to view the official wedding bank account for transfers</p>
                  </div>
                  <button
                    type="button"
                    className="btn-show-bank-details"
                    onClick={() => setShowBankDetails(true)}
                  >
                    View Account Details
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
                        <strong className="acct-num font-mono">{bankDetails.accountNumber}</strong>
                        <button
                          type="button"
                          className="btn-copy-num"
                          onClick={() => handleCopy(bankDetails.accountNumber, 'traditional')}
                        >
                          {copiedTraditionalAccount ? '✓ Copied' : 'Copy'}
                        </button>
                      </div>
                    </div>

                    <div className="bank-detail-item">
                      <span className="lbl">Account Name:</span>
                      <strong style={{ fontSize: '12px', textAlign: 'right' }}>
                        {bankDetails.accountName}
                      </strong>
                    </div>
                  </div>

                  <p style={{ fontSize: '11px', color: '#7A6F64', margin: '4px 0 0 0' }}>
                    💡 <em>Tip: Please include your name in the transfer remark so we can send our warmest personal thank you!</em>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 6: FAQ ACCORDION
         ==================================================================== */}
      <section className="wishlist-faq-section">
        <div className="wishlist-faq-inner reveal-fade-up">
          <span className="eyebrow-spaced">— QUESTIONS &amp; ANSWERS —</span>
          <h2
            className="font-serif"
            style={{
              fontSize: 'clamp(28px, 4vw, 38px)',
              margin: '0 0 24px',
              color: '#3D101C',
              fontWeight: 500,
            }}
          >
            Wishlist &amp; Gifting FAQ
          </h2>

          <div className="faq-accordions-list">
            {faqList.map((faq, idx) => {
              const isOpen = openFaqIndex === idx
              return (
                <div key={idx} className={`wishlist-faq-item ${isOpen ? 'is-open' : ''}`}>
                  <button
                    type="button"
                    className="wishlist-faq-btn"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                  >
                    <span className="faq-q-text">{faq.q}</span>
                    <span className="faq-chevron">{isOpen ? '−' : '+'}</span>
                  </button>
                  {isOpen && (
                    <div className="wishlist-faq-body">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ====================================================================
          INTERACTIVE CONTRIBUTION MODAL (React Portal)
         ==================================================================== */}
      {selectedItem && mounted && createPortal(
        <div className="gift-modal-backdrop" onClick={() => setSelectedItem(null)}>
          <div
            className="gift-modal wishlist-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            {/* Close Button */}
            <button
              type="button"
              className="modal-close-btn"
              onClick={() => setSelectedItem(null)}
              aria-label="Close modal"
            >
              ✕
            </button>

            <div className="modal-grid simplified-gift-modal">
              {/* Left Column: Product Photo & Details */}
              <div className="modal-photo-col">
                <div className="modal-photo-wrap">
                  <img
                    src={selectedItem.image}
                    alt={selectedItem.title}
                    className="modal-gift-img"
                  />
                  {modalContributionDetails.isComplete && (
                    <div className="modal-complete-overlay">
                      <span>✓ Fully Funded</span>
                    </div>
                  )}
                </div>

                <div className="modal-item-summary-box">
                  <span className="modal-cat-tag">{selectedItem.categoryLabel}</span>
                  <h2 id="modal-title" className="modal-item-heading">{selectedItem.title}</h2>
                  <div className="modal-item-price-row">
                    <span className="lbl">Target Cost:</span>
                    <strong className="val">{selectedItem.price}</strong>
                  </div>
                  
                  {/* Clean Mini Progress */}
                  <div className="modal-mini-progress-box">
                    <div className="modal-progress-bar-wrap">
                      <div
                        className={`wishlist-progress-fill ${modalContributionDetails.isComplete ? 'fill-complete' : ''}`}
                        style={{ width: `${modalContributionDetails.percentage}%` }}
                      />
                    </div>
                    <div className="modal-progress-text-row">
                      <span>₦{selectedItem.contributedAmount.toLocaleString()} funded</span>
                      <span>₦{modalContributionDetails.remaining.toLocaleString()} remaining</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Clean Bank Details & Transfer Confirmation */}
              <div className="modal-form-col">
                {submitSuccess ? (
                  /* Success Celebration State */
                  <div className="modal-success-state">
                    <div className="success-icon-badge">✨</div>
                    <h3 className="success-heading">Thank You for Your Gift!</h3>
                    <p className="success-subtext">
                      Your contribution of{' '}
                      <strong className="text-burgundy">
                        ₦{successDetails?.amount.toLocaleString()}
                      </strong>{' '}
                      towards <em>&quot;{successDetails?.itemTitle}&quot;</em> has been recorded.
                    </p>

                    <div className="success-ref-card">
                      <span className="ref-title">Payment Reference</span>
                      <div className="ref-val">{successDetails?.reference}</div>
                      <p className="ref-note">
                        Once verified by Ngozi &amp; Sorbari, the registry balance will update automatically!
                      </p>
                    </div>

                    <button
                      type="button"
                      className="btn-back-to-wishlist"
                      onClick={() => setSelectedItem(null)}
                    >
                      Done &amp; Return to Wishlist
                    </button>
                  </div>
                ) : (
                  /* Simplified Contribution Form */
                  <form onSubmit={handleConfirmTransferSubmit} className="simplified-modal-form">
                    {/* 1. Official Bank Account Box */}
                    <div className="modal-bank-highlight-box">
                      <div className="bank-box-top">
                        <span className="bank-box-title">1. Transfer to Wedding Account</span>
                        <span className="bank-box-sub">Parallex Bank</span>
                      </div>

                      <div className="bank-acc-display-row">
                        <div className="acc-info">
                          <span className="acc-num-display">{bankDetails.accountNumber}</span>
                          <span className="acc-name-display">{bankDetails.accountName}</span>
                        </div>
                        <button
                          type="button"
                          className="btn-copy-acc-prominent"
                          onClick={() => handleCopy(bankDetails.accountNumber, 'account')}
                        >
                          {copiedAccount ? '✓ Copied' : 'Copy Number'}
                        </button>
                      </div>
                    </div>

                    {/* 2. Amount Selection */}
                    <div className="modal-step-group">
                      <label className="step-label">2. Select Your Gift Amount</label>
                      <div className="clean-amount-chips-grid">
                        {!modalContributionDetails.isComplete && (
                          <button
                            type="button"
                            className={`amount-chip ${contributionMode === 'full' ? 'selected' : ''}`}
                            onClick={() => setContributionMode('full')}
                          >
                            <span className="chip-sub">Full Balance</span>
                            <span className="chip-val">₦{modalContributionDetails.remaining.toLocaleString()}</span>
                          </button>
                        )}

                        {modalContributionDetails.remaining >= 50000 && (
                          <button
                            type="button"
                            className={`amount-chip ${contributionMode === 'preset50k' ? 'selected' : ''}`}
                            onClick={() => setContributionMode('preset50k')}
                          >
                            <span className="chip-sub">Share</span>
                            <span className="chip-val">₦50,000</span>
                          </button>
                        )}

                        {modalContributionDetails.remaining >= 20000 && (
                          <button
                            type="button"
                            className={`amount-chip ${contributionMode === 'preset25k' ? 'selected' : ''}`}
                            onClick={() => setContributionMode('preset25k')}
                          >
                            <span className="chip-sub">Share</span>
                            <span className="chip-val">₦25,000</span>
                          </button>
                        )}

                        <button
                          type="button"
                          className={`amount-chip ${contributionMode === 'custom' ? 'selected' : ''}`}
                          onClick={() => setContributionMode('custom')}
                        >
                          <span className="chip-sub">Custom</span>
                          <span className="chip-val">Other Amount</span>
                        </button>
                      </div>

                      {contributionMode === 'custom' && (
                        <div className="custom-input-wrapper">
                          <span className="currency-mark">₦</span>
                          <input
                            type="number"
                            placeholder="Enter amount (e.g. 15000)"
                            min="1000"
                            value={customAmount}
                            onChange={(e) => setCustomAmount(e.target.value)}
                            className="clean-text-input"
                            required
                          />
                        </div>
                      )}
                    </div>

                    {/* 3. Contributor Name & Info */}
                    <div className="modal-step-group">
                      <label htmlFor="contributorName" className="step-label">
                        3. Your Name / Family Name <span className="req">*</span>
                      </label>
                      <input
                        id="contributorName"
                        type="text"
                        placeholder="e.g. Samuel &amp; Grace Adeleke"
                        value={contributorName}
                        onChange={(e) => setContributorName(e.target.value)}
                        className="clean-text-input"
                        required
                      />

                      <div className="modal-two-col-inputs">
                        <input
                          id="contributorPhone"
                          type="tel"
                          placeholder="Phone / WhatsApp (Optional)"
                          value={contributorPhone}
                          onChange={(e) => setContributorPhone(e.target.value)}
                          className="clean-text-input"
                        />
                        <input
                          id="contributorEmail"
                          type="email"
                          placeholder="Email Address (Optional)"
                          value={contributorEmail}
                          onChange={(e) => setContributorEmail(e.target.value)}
                          className="clean-text-input"
                        />
                      </div>

                      <textarea
                        id="customNote"
                        rows={2}
                        placeholder="Personal blessing or note for the couple (Optional)..."
                        value={customNote}
                        onChange={(e) => setCustomNote(e.target.value)}
                        className="clean-textarea"
                      />
                    </div>

                    {/* 4. Prominent Submit Action */}
                    <button
                      type="submit"
                      className="btn-submit-gift-direct"
                      disabled={isSubmitting || modalContributionDetails.amount <= 0}
                    >
                      {isSubmitting ? (
                        <span>Submitting Blessing...</span>
                      ) : (
                        <span>
                          ✓ I Have Transferred ₦{modalContributionDetails.amount.toLocaleString()} — Confirm Blessing
                        </span>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Footer */}
      <Footer />
    </main>
  )
}
