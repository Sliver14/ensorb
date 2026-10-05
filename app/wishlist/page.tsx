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

  // Handle submitting the contribution
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
      a: 'You can choose to gift the entire remaining balance of an item or contribute any partial amount of your choice. Once your bank transfer is verified by the couple, the progress bar updates automatically.',
    },
    {
      q: 'Can I send a general cash blessing instead of a specific item?',
      a: 'Yes, absolutely! You can use the "Direct Wedding Cash Blessings" section above to make a transfer of any amount directly to the couple\'s designated wedding account.',
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
    <main className="wedding-site wishlist-page-refined">
      {/* ----------------------------------------------------------------------
          HERO SECTION
          ---------------------------------------------------------------------- */}
      <section className="wishlist-hero-refined section-shell">
        <SideTallBotanical className="side-botanical-left" />
        <SideTallBotanical className="side-botanical-right" />

        <div className="wishlist-hero-content reveal-fade-up">
          <div className="badge-luxury">
            <BotanicalSprig className="sprig-icon-left" />
            <span>Celebration &amp; Registry</span>
            <BotanicalSprig className="sprig-icon-right" />
          </div>

          <h1 className="wishlist-hero-title">Wedding Registry &amp; Blessings</h1>

          <p className="wishlist-hero-subtitle">
            Your presence, prayers, and warm love are our greatest gifts. For friends and
            family who wish to celebrate us with a gift or home contribution, we have curated
            items to help us build our new home together.
          </p>

          <div className="hero-button-group">
            <a href="#registry-grid" className="btn-primary-burgundy">
              <span>Browse Registry Items</span>
              <span className="arrow-icon">↓</span>
            </a>
            <button
              type="button"
              className="btn-secondary-outline"
              onClick={() => setShowBankDetails(!showBankDetails)}
            >
              <span>{showBankDetails ? 'Hide Bank Details' : 'Direct Cash Blessing'}</span>
            </button>
          </div>
        </div>

        <HeroBottomTornWithWash className="hero-bottom-torn" />
      </section>

      {/* ----------------------------------------------------------------------
          TRADITIONAL CASH BLESSING SECTION (Collapsible & Direct)
          ---------------------------------------------------------------------- */}
      <section
        className={`cash-blessing-section section-shell ${showBankDetails ? 'is-open' : ''}`}
        id="bank-details"
      >
        <div className="cash-blessing-card card-luxury-border">
          <CardCornerBotanical className="corner-botanical top-left" />
          <CardCornerBotanical className="corner-botanical top-right" />

          <div className="cash-card-header">
            <div className="icon-badge-gold">
              <BankBuildingIcon />
            </div>
            <span className="eyebrow-accent">Direct Celebration Transfer</span>
            <h2>Wedding Cash Account</h2>
            <p className="cash-card-desc">
              For general monetary blessings, traditional cash gifts, or monetary support
              towards our wedding celebrations and future together.
            </p>
          </div>

          <div className="cash-card-body">
            <div className="bank-account-box">
              <div className="bank-account-row">
                <span className="bank-row-label">Bank Name</span>
                <strong className="bank-row-value">{bankDetails.bankName}</strong>
              </div>

              <div className="bank-account-row highlight-row">
                <span className="bank-row-label">Account Number</span>
                <div className="account-number-copy-wrap">
                  <span className="account-number-digits font-mono">{bankDetails.accountNumber}</span>
                  <button
                    type="button"
                    className="btn-copy-account"
                    onClick={() => handleCopy(bankDetails.accountNumber, 'account')}
                  >
                    {copiedAccount ? '✓ Copied' : 'Copy Number'}
                  </button>
                </div>
              </div>

              <div className="bank-account-row">
                <span className="bank-row-label">Account Name</span>
                <strong className="bank-row-value text-burgundy">{bankDetails.accountName}</strong>
              </div>
            </div>

            <div className="cash-card-footer-notes">
              <p>
                💡 <em>Tip: Please use your name or phone number as the transfer narration so we can send our warmest personal thank you!</em>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------------
          REGISTRY CONTROLS & FILTER BAR
          ---------------------------------------------------------------------- */}
      <section className="wishlist-controls-section section-shell" id="registry-grid">
        <div className="wishlist-controls-bar reveal-fade-up">
          {/* Top Row: Search & Stats */}
          <div className="controls-top-row">
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search registry (e.g. Solar, Inverter, Pots, Blender)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-field"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="clear-search-btn"
                  onClick={() => setSearchQuery('')}
                >
                  ✕
                </button>
              )}
            </div>

            <div className="registry-stats-badge">
              <div className="stat-pill">
                <span className="stat-num">{stats.totalItems}</span>
                <span className="stat-text">Items</span>
              </div>
              <div className="stat-pill">
                <span className="stat-num text-green">{stats.fullyGifted}</span>
                <span className="stat-text">Gifted</span>
              </div>
              <div className="stat-pill">
                <span className="stat-num text-gold">{stats.inProgress}</span>
                <span className="stat-text">In Progress</span>
              </div>
            </div>
          </div>

          {/* Bottom Row: Filter Pills & Sorting */}
          <div className="controls-bottom-row">
            {/* Status Pills */}
            <div className="filter-pill-group">
              <button
                type="button"
                className={`filter-pill ${statusFilter === 'all' ? 'active' : ''}`}
                onClick={() => setStatusFilter('all')}
              >
                All Items
              </button>
              <button
                type="button"
                className={`filter-pill ${statusFilter === 'needed' ? 'active' : ''}`}
                onClick={() => setStatusFilter('needed')}
              >
                Needs Gifting ({stats.openItems})
              </button>
              <button
                type="button"
                className={`filter-pill ${statusFilter === 'gifted' ? 'active' : ''}`}
                onClick={() => setStatusFilter('gifted')}
              >
                Fully Gifted ({stats.fullyGifted})
              </button>
            </div>

            {/* Category Dropdown & Sort */}
            <div className="dropdowns-group">
              <div className="select-wrapper">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="custom-select"
                >
                  <option value="all">All Categories</option>
                  <option value="appliances">Home Power &amp; Appliances</option>
                  <option value="kitchen">Kitchen Essentials</option>
                  <option value="tableware">Dining &amp; Tableware</option>
                </select>
              </div>

              <div className="select-wrapper">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="custom-select"
                >
                  <option value="featured">Featured First</option>
                  <option value="progress-desc">Highest Progress</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------------
          REGISTRY GRID
          ---------------------------------------------------------------------- */}
      <section className="wishlist-grid-section section-shell">
        {filteredAndSortedItems.length === 0 ? (
          <div className="no-items-placeholder">
            <div className="placeholder-icon">🎁</div>
            <h3>No matching items found</h3>
            <p>Try clearing your search query or selecting a different category filter.</p>
            <button
              type="button"
              className="btn-primary-burgundy"
              onClick={() => {
                setSearchQuery('')
                setStatusFilter('all')
                setSelectedCategory('all')
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="wishlist-items-grid">
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
                  className={`gift-card card-luxury-border ${isCompleted ? 'is-completed' : ''} ${item.featured ? 'is-featured' : ''}`}
                >
                  {/* Card Image Wrap */}
                  <div className="gift-card-media">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="gift-card-img"
                      loading="lazy"
                    />
                    
                    {/* Category & Status Badges */}
                    <div className="gift-card-badges">
                      <span className="category-badge">{item.categoryLabel}</span>
                      {isCompleted ? (
                        <span className="status-badge-completed">✓ Fully Gifted</span>
                      ) : percentage > 0 ? (
                        <span className="status-badge-progress">{percentage}% Funded</span>
                      ) : null}
                    </div>

                    {item.featured && (
                      <div className="featured-ribbon">
                        <span>★ Priority</span>
                      </div>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="gift-card-content">
                    <div className="gift-card-header">
                      <h3 className="gift-card-title">{item.title}</h3>
                      <p className="gift-card-desc">{item.description}</p>
                    </div>

                    <div className="gift-card-pricing">
                      <div className="price-tag-wrap">
                        <span className="price-label">Target Goal</span>
                        <strong className="price-amount">{item.price}</strong>
                      </div>

                      {item.contributorCount > 0 && (
                        <span className="contributors-count">
                          👥 {item.contributorCount} {item.contributorCount === 1 ? 'gift' : 'gifts'}
                        </span>
                      )}
                    </div>

                    {/* Progress Bar */}
                    <div className="progress-bar-container">
                      <div className="progress-bar-header">
                        <span className="progress-raised">
                          ₦{item.contributedAmount.toLocaleString()} raised
                        </span>
                        <span className="progress-remaining">
                          {isCompleted
                            ? 'Goal Reached!'
                            : `₦${remaining.toLocaleString()} left`}
                        </span>
                      </div>
                      <div className="progress-track">
                        <div
                          className={`progress-fill ${isCompleted ? 'completed-fill' : ''}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="gift-card-action">
                      <button
                        type="button"
                        className={`btn-gift-action ${isCompleted ? 'btn-gifted-view' : 'btn-gift-contribute'}`}
                        onClick={() => handleOpenModal(item)}
                      >
                        {isCompleted ? (
                          <>
                            <span>View Details / Extra Blessing</span>
                            <span className="btn-icon">→</span>
                          </>
                        ) : (
                          <>
                            <span>Contribute or Gift Item</span>
                            <span className="btn-icon">🎁</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>

      {/* ----------------------------------------------------------------------
          REGISTRY FAQ SECTION
          ---------------------------------------------------------------------- */}
      <section className="wishlist-faq-section section-shell">
        <div className="faq-container card-luxury-border">
          <div className="faq-header">
            <span className="eyebrow-accent">Questions &amp; Answers</span>
            <h2>Wishlist &amp; Gifting FAQ</h2>
            <p>Everything you need to know about celebrating Ngozi &amp; Sorbari</p>
          </div>

          <div className="faq-accordion-list">
            {faqList.map((faq, idx) => {
              const isOpen = openFaqIndex === idx
              return (
                <div key={idx} className={`faq-accordion-item ${isOpen ? 'is-open' : ''}`}>
                  <button
                    type="button"
                    className="faq-accordion-trigger"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                  >
                    <span className="faq-question-text">{faq.q}</span>
                    <span className="faq-accordion-icon">{isOpen ? '−' : '+'}</span>
                  </button>
                  {isOpen && (
                    <div className="faq-accordion-body">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------------
          INTERACTIVE CONTRIBUTION & GIFT MODAL (React Portal directly to body)
          ---------------------------------------------------------------------- */}
      {selectedItem && mounted && createPortal(
        <div className="gift-modal-backdrop" onClick={() => setSelectedItem(null)}>
          <div
            className="gift-modal wishlist-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            {/* Modal Close Button */}
            <button
              type="button"
              className="modal-close-btn"
              onClick={() => setSelectedItem(null)}
              aria-label="Close modal"
            >
              ✕
            </button>

            {/* Modal Header Media */}
            <div className="modal-header-hero">
              <img
                src={selectedItem.image}
                alt={selectedItem.title}
                className="modal-header-img"
              />
              <div className="modal-header-overlay">
                <span className="modal-cat-tag">{selectedItem.categoryLabel}</span>
                <h2 id="modal-title" className="modal-item-title">
                  {selectedItem.title}
                </h2>
                <div className="modal-price-strip">
                  <span className="target-label">Target: {selectedItem.price}</span>
                  {modalContributionDetails.isComplete ? (
                    <span className="badge-complete">✓ Goal Fully Funded</span>
                  ) : (
                    <span className="badge-remaining">
                      ₦{modalContributionDetails.remaining.toLocaleString()} needed
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Scrollable Body */}
            <div className="modal-body-scroll">
              <div className="modal-inner-content">
                {/* Progress Visual in Modal */}
                <div className="modal-progress-box">
                  <div className="progress-labels-row">
                    <span>
                      <strong>₦{selectedItem.contributedAmount.toLocaleString()}</strong> raised (
                      {modalContributionDetails.percentage}%)
                    </span>
                    <span>
                      Goal: <strong>{selectedItem.price}</strong>
                    </span>
                  </div>
                  <div className="progress-track modal-track">
                    <div
                      className="progress-fill modal-fill"
                      style={{ width: `${modalContributionDetails.percentage}%` }}
                    />
                  </div>
                </div>

                {submitSuccess ? (
                  /* Success Celebration State */
                  <div className="modal-success-state">
                    <div className="success-icon-badge">✨</div>
                    <h3 className="success-heading">Thank You for Your Blessing!</h3>
                    <p className="success-subtext">
                      Your gift contribution of{' '}
                      <strong className="text-burgundy">
                        ₦{successDetails?.amount.toLocaleString()}
                      </strong>{' '}
                      towards <em>&quot;{successDetails?.itemTitle}&quot;</em> has been submitted.
                    </p>
                    <div className="success-ref-card">
                      <span className="ref-title">Transfer Reference</span>
                      <strong className="ref-val font-mono">{successDetails?.reference}</strong>
                      <p className="ref-note">
                        Once verified by Ngozi &amp; Sorbari from the admin dashboard, the progress bar will update automatically!
                      </p>
                    </div>

                    <div className="modal-actions-grid mt-4">
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

                    <button
                      type="button"
                      className="btn-primary-burgundy w-full mt-4"
                      onClick={() => setSelectedItem(null)}
                    >
                      Back to Wishlist
                    </button>
                  </div>
                ) : (
                  /* Standard Contribution Form */
                  <form onSubmit={handleConfirmTransferSubmit}>
                    {/* Amount Selector Chips */}
                    {!modalContributionDetails.isComplete && (
                      <div className="contribution-selector-box">
                        <label className="selector-title">Select Contribution Amount:</label>
                        <div className="amount-chips-grid">
                          <button
                            type="button"
                            className={`chip-btn ${contributionMode === 'full' ? 'active' : ''}`}
                            onClick={() => setContributionMode('full')}
                          >
                            <span className="chip-title">Gift Full Balance</span>
                            <span className="chip-amt">
                              ₦{modalContributionDetails.remaining.toLocaleString()}
                            </span>
                          </button>

                          {modalContributionDetails.remaining > 50000 && (
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
                          )}

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
                              required
                            />
                          </div>
                        )}
                      </div>
                    )}

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

                    {/* Contributor Details Input Box */}
                    <div className="contributor-name-input-box">
                      <label htmlFor="contributorName">Your Name / Family Name *</label>
                      <input
                        id="contributorName"
                        type="text"
                        placeholder="e.g. Uncle John &amp; Aunt Mary"
                        value={contributorName}
                        onChange={(e) => setContributorName(e.target.value)}
                        required
                      />

                      <div className="grid-2-col mt-2">
                        <div>
                          <label htmlFor="contributorEmail" className="text-xs text-muted">Email (Optional)</label>
                          <input
                            id="contributorEmail"
                            type="email"
                            placeholder="john@example.com"
                            value={contributorEmail}
                            onChange={(e) => setContributorEmail(e.target.value)}
                          />
                        </div>
                        <div>
                          <label htmlFor="contributorPhone" className="text-xs text-muted">Phone / WhatsApp (Optional)</label>
                          <input
                            id="contributorPhone"
                            type="tel"
                            placeholder="080 1234 5678"
                            value={contributorPhone}
                            onChange={(e) => setContributorPhone(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="mt-2">
                        <label htmlFor="customNote" className="text-xs text-muted">Personal Blessing Message (Optional)</label>
                        <textarea
                          id="customNote"
                          rows={2}
                          placeholder="Warmest congratulations to Ngozi &amp; Sorbari on your union!"
                          value={customNote}
                          onChange={(e) => setCustomNote(e.target.value)}
                          className="w-full text-sm"
                        />
                      </div>
                    </div>

                    {/* Primary Confirmation Submit Button */}
                    <div className="modal-submit-wrap">
                      <button
                        type="submit"
                        className="btn-primary-burgundy w-full btn-confirm-gift"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <span>Submitting Contribution...</span>
                        ) : (
                          <span>
                            ✓ I Have Transferred ₦{modalContributionDetails.amount.toLocaleString()} — Confirm Gift
                          </span>
                        )}
                      </button>
                    </div>

                    {/* Direct Action Notification Buttons */}
                    <div className="modal-actions-grid mt-3">
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
