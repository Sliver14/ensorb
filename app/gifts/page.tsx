'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { registryGifts, GiftItem } from '@/lib/data'

export default function GiftsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured')
  const [selectedGift, setSelectedGift] = useState<GiftItem | null>(null)
  const [copiedBank, setCopiedBank] = useState(false)

  const handleCopyAccount = (text: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text)
      setCopiedBank(true)
      setTimeout(() => setCopiedBank(false), 2500)
    }
  }

  const filteredAndSortedGifts = useMemo(() => {
    let result = [...registryGifts]

    if (selectedCategory !== 'all') {
      result = result.filter((item) => item.category === selectedCategory)
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.categoryLabel.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q)
      )
    }

    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.numericPrice - b.numericPrice)
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.numericPrice - a.numericPrice)
    }

    return result
  }, [selectedCategory, searchQuery, sortBy])

  return (
    <main className="wedding-site">
      <Navbar />

      <section className="subpage-hero section-shell">
        <div className="breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <strong>Wedding Gifts</strong>
        </div>
        <p className="eyebrow">A Little Something</p>
        <h1>Wedding Gifts Registry</h1>
        <p className="subpage-hero-desc">
          Your presence at our wedding is the greatest gift of all. For beloved friends and family who have kindly inquired about blessing our new home, we have curated this wishlist of cherished essentials.
        </p>

        <div className="registry-stats-bar">
          <div className="stat-pill">
            <strong>{registryGifts.length}</strong>
            <span>Curated Gifts</span>
          </div>
          <div className="stat-pill">
            <strong>3</strong>
            <span>Categories</span>
          </div>
          <div className="stat-pill">
            <strong>100%</strong>
            <span>Love &amp; Gratitude</span>
          </div>
        </div>
      </section>

      <section className="registry-main-section section-shell">
        <div className="registry-controls-bar">
          <div className="registry-filter-tabs">
            <button
              type="button"
              className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              All Items ({registryGifts.length})
            </button>
            <button
              type="button"
              className={`filter-btn ${selectedCategory === 'kitchen' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('kitchen')}
            >
              Kitchen Essentials
            </button>
            <button
              type="button"
              className={`filter-btn ${selectedCategory === 'appliances' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('appliances')}
            >
              Home Appliances
            </button>
            <button
              type="button"
              className={`filter-btn ${selectedCategory === 'tableware' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('tableware')}
            >
              Dining &amp; Tableware
            </button>
          </div>

          <div className="registry-search-sort">
            <div className="search-input-wrap">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search gifts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="registry-search-input"
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

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="registry-sort-select"
              aria-label="Sort gifts"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {filteredAndSortedGifts.length > 0 ? (
          <div className="registry-gifts-grid">
            {filteredAndSortedGifts.map((gift) => (
              <article key={gift.id} className="gift-item-card">
                <div className="gift-image-wrap" onClick={() => setSelectedGift(gift)}>
                  <img src={gift.image} alt={gift.title} loading="lazy" />
                  <span className="gift-category-tag">{gift.categoryLabel}</span>
                  {gift.featured && <span className="featured-badge">Top Wish</span>}
                </div>
                <div className="gift-card-body">
                  <div className="gift-card-main">
                    <h3>{gift.title}</h3>
                    <div className="gift-price-tag">{gift.price}</div>
                    <p>{gift.description}</p>
                  </div>
                  <div className="gift-card-footer">
                    <button
                      type="button"
                      className="gift-btn"
                      onClick={() => setSelectedGift(gift)}
                    >
                      Gift This Item <span>↗</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="no-gifts-found">
            <p>No gifts match your search &quot;{searchQuery}&quot;.</p>
            <button
              type="button"
              className="reset-search-btn"
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('all')
              }}
            >
              View All Gifts
            </button>
          </div>
        )}

        {/* Cash Blessings Support Section */}
        <div className="cash-blessings-banner">
          <div className="cash-banner-copy">
            <span className="eyebrow">Monetary Contributions</span>
            <h3>Prefer to send cash blessings?</h3>
            <p>
              If you wish to honor us with a cash blessing towards our new home and honeymoon, you may make a direct transfer using our designated wedding account details:
            </p>
          </div>
          <div className="cash-banner-card">
            <div className="bank-info-item">
              <span className="bank-info-label">Bank Name</span>
              <strong className="bank-info-val">Guaranty Trust Bank (GTB)</strong>
            </div>
            <div className="bank-info-item">
              <span className="bank-info-label">Account Name</span>
              <strong className="bank-info-val">Ngozi &amp; Sorbari Wedding</strong>
            </div>
            <div className="bank-info-item">
              <span className="bank-info-label">Account Number</span>
              <strong className="bank-info-val font-mono">0123456789</strong>
            </div>
            <button
              type="button"
              className="copy-account-btn"
              onClick={() => handleCopyAccount('0123456789')}
            >
              {copiedBank ? '✓ Account Number Copied!' : 'Copy Account Number'}
            </button>
          </div>
        </div>

        {/* Gifting FAQ / Instructions */}
        <div className="gifting-guidelines-card">
          <h4>Gifting Instructions &amp; FAQ</h4>
          <div className="guidelines-grid">
            <div className="guide-col">
              <h5>1. How to reserve an item</h5>
              <p>Click &quot;Gift This Item&quot; on any product card to see its full details and make a transfer equivalent to the item price with the gift name as reference.</p>
            </div>
            <div className="guide-col">
              <h5>2. Notify the couple</h5>
              <p>After your gift transfer, click &quot;Notify Couple via Email&quot; or send a WhatsApp message so we can properly thank you and celebrate your generosity!</p>
            </div>
            <div className="guide-col">
              <h5>3. Cash contributions</h5>
              <p>Monetary gifts can be sent directly to our wedding account anytime before or after the ceremony.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gift Details Modal */}
      {selectedGift && (
        <div className="gift-modal-backdrop" onClick={() => setSelectedGift(null)}>
          <div className="gift-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <button
              className="modal-close-btn"
              onClick={() => setSelectedGift(null)}
              aria-label="Close dialog"
            >
              ✕
            </button>
            <div className="modal-grid">
              <div className="modal-photo">
                <img src={selectedGift.image} alt={selectedGift.title} />
              </div>
              <div className="modal-info">
                <span className="modal-tag">{selectedGift.categoryLabel}</span>
                <h2>{selectedGift.title}</h2>
                <div className="modal-price-tag">{selectedGift.price}</div>
                <p className="modal-summary">{selectedGift.description}</p>

                <div className="modal-gifting-guide">
                  <h4>How to Gift This:</h4>
                  <p>
                    You may purchase this item directly or transfer the value (<strong>{selectedGift.price}</strong>) using the account details below with reference <strong>&quot;{selectedGift.title}&quot;</strong>.
                  </p>
                  <div className="modal-bank-box">
                    <div className="bank-line">
                      <span>Bank:</span> <strong>Guaranty Trust Bank (GTB)</strong>
                    </div>
                    <div className="bank-line">
                      <span>Account Name:</span> <strong>Ngozi &amp; Sorbari Wedding</strong>
                    </div>
                    <div className="bank-line">
                      <span>Account Number:</span> <strong>0123456789</strong>
                    </div>
                    <div className="bank-line">
                      <span>Item Value:</span> <strong>{selectedGift.price}</strong>
                    </div>
                    <button
                      type="button"
                      className="modal-copy-btn"
                      onClick={() => handleCopyAccount('0123456789')}
                    >
                      {copiedBank ? '✓ Account Copied!' : 'Copy Account Number'}
                    </button>
                  </div>
                </div>

                <div className="modal-actions">
                  <a
                    className="modal-email-btn"
                    href={`mailto:hello@example.com?subject=Wedding%20Gift%20-%20${encodeURIComponent(selectedGift.title)}%20(${encodeURIComponent(selectedGift.price)})&body=Hello%20Ngozi%20%26%20Sorbari,%0A%0AI%20would%20like%20to%20bless%20you%20with%20the%20${encodeURIComponent(selectedGift.title)}%20(${encodeURIComponent(selectedGift.price)})!`}
                  >
                    Notify Couple via Email <span>↗</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  )
}
