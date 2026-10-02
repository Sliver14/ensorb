'use client'

import { useState } from 'react'
import { dressColors } from '@/lib/data'

export function ColorCodeSection() {
  const [copiedHex, setCopiedHex] = useState<string | null>(null)

  const handleCopy = (hex: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(hex)
      setCopiedHex(hex)
      setTimeout(() => setCopiedHex(null), 2000)
    }
  }

  return (
    <section id="dress-code" className="dress-code-section section-shell" aria-labelledby="dress-code-title">
      <div className="dress-code-header">
        <p className="eyebrow">Attire &amp; Palette</p>
        <h2 id="dress-code-title">Dress Color Code</h2>
        <p className="dress-code-desc">
          We invite you to celebrate with us in style! Our official wedding palette features four curated shades. Click any color below to copy its HEX code for your styling and tailoring.
        </p>
      </div>

      <div className="simple-color-grid">
        {dressColors.map((color) => (
          <div
            key={color.name}
            className="simple-color-card"
            onClick={() => handleCopy(color.hex)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') handleCopy(color.hex)
            }}
            title="Click to copy HEX code"
          >
            {/* Rounded Color Swatch Circle */}
            <div className="simple-swatch-circle-wrap">
              <div
                className="simple-swatch-circle"
                style={{ backgroundColor: color.hex }}
              >
                <span className="simple-copy-toast">
                  {copiedHex === color.hex ? '✓ Copied' : 'Copy'}
                </span>
              </div>
            </div>

            {/* Color Info */}
            <div className="simple-color-info">
              <span className="simple-color-tag">{color.tag}</span>
              <h3 className="simple-color-name">{color.name}</h3>
              <button
                type="button"
                className={`simple-hex-pill ${copiedHex === color.hex ? 'copied' : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  handleCopy(color.hex)
                }}
              >
                {copiedHex === color.hex ? '✓ Copied' : color.hex}
              </button>
              <p className="simple-color-desc">{color.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Simple Rounded Guidelines Card */}
      <div className="simple-guide-card">
        <span className="simple-guide-icon">✨</span>
        <div className="simple-guide-text">
          <h4>Attire Guidelines &amp; Palette Notes</h4>
          <p>
            <strong>Dress Code:</strong> Black Tie / Formal Traditional &amp; Contemporary Elegance.
            Guests are welcome to style in any of our four official shades (Burgundy, Blush, Mint Green, or Olive Green), or pair them gracefully with classic neutrals (black, ivory, gold, or champagne).
          </p>
        </div>
      </div>
    </section>
  )
}
