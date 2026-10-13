'use client'

import React, { useEffect, useState, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
} from 'lucide-react'

export interface GalleryPhoto {
  src: string
  alt: string
  caption: string
  objectPosition?: string
}

interface GalleryLightboxModalProps {
  photos: GalleryPhoto[]
  initialIndex: number | null
  onClose: () => void
}

export default function GalleryLightboxModal({
  photos,
  initialIndex,
  onClose,
}: GalleryLightboxModalProps) {
  const [mounted, setMounted] = useState(false)
  const [currentIndex, setCurrentIndex] = useState<number | null>(initialIndex)
  const [isZoomed, setIsZoomed] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Touch tracking for mobile swipe
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const thumbnailStripRef = useRef<HTMLDivElement>(null)

  // Client-side mount for createPortal
  useEffect(() => {
    setMounted(true)
  }, [])

  // Keep currentIndex in sync when initialIndex changes
  useEffect(() => {
    setCurrentIndex(initialIndex)
    setIsZoomed(false)
  }, [initialIndex])

  // Lock body scroll when open
  useEffect(() => {
    if (currentIndex !== null) {
      const originalOverflow = document.body.style.overflow
      const originalPaddingRight = document.body.style.paddingRight
      // Prevent layout shift from scrollbar
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth
      if (scrollBarWidth > 0) {
        document.body.style.paddingRight = `${scrollBarWidth}px`
      }
      document.body.style.overflow = 'hidden'

      return () => {
        document.body.style.overflow = originalOverflow
        document.body.style.paddingRight = originalPaddingRight
      }
    }
  }, [currentIndex])

  const handleNext = useCallback(() => {
    setIsZoomed(false)
    setCurrentIndex((prev) =>
      prev !== null && prev < photos.length - 1 ? prev + 1 : 0
    )
  }, [photos.length])

  const handlePrev = useCallback(() => {
    setIsZoomed(false)
    setCurrentIndex((prev) =>
      prev !== null && prev > 0 ? prev - 1 : photos.length - 1
    )
  }, [photos.length])

  // Keyboard navigation
  useEffect(() => {
    if (currentIndex === null) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowRight') {
        handleNext()
      } else if (e.key === 'ArrowLeft') {
        handlePrev()
      } else if (e.key === '+' || e.key === '=') {
        setIsZoomed(true)
      } else if (e.key === '-') {
        setIsZoomed(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [currentIndex, handleNext, handlePrev, onClose])

  // Scroll active thumbnail into view
  useEffect(() => {
    if (currentIndex !== null && thumbnailStripRef.current) {
      const activeThumb = thumbnailStripRef.current.children[currentIndex] as HTMLElement
      if (activeThumb) {
        activeThumb.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        })
      }
    }
  }, [currentIndex])

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => {})
      setIsFullscreen(true)
    } else {
      document.exitFullscreen().catch(() => {})
      setIsFullscreen(false)
    }
  }

  // Mobile swipe handlers
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX
    touchEndX.current = null
  }

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX
  }

  const onTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return
    const diff = touchStartX.current - touchEndX.current
    const minSwipeDistance = 45

    if (diff > minSwipeDistance) {
      handleNext()
    } else if (diff < -minSwipeDistance) {
      handlePrev()
    }
    touchStartX.current = null
    touchEndX.current = null
  }

  if (!mounted || currentIndex === null || !photos[currentIndex]) {
    return null
  }

  const currentPhoto = photos[currentIndex]

  const modalContent = (
    <div
      ref={containerRef}
      className="custom-gallery-modal-root"
      role="dialog"
      aria-modal="true"
      aria-label="Couple photo viewer"
      onClick={onClose}
    >
      {/* Top Header Bar */}
      <header
        className="custom-gallery-modal-header"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="custom-gallery-counter-badge">
          <span className="dot-gold" />
          <span>
            PHOTO {currentIndex + 1} OF {photos.length}
          </span>
        </div>

        <div className="custom-gallery-header-title">
          <span className="header-couple-caption">{currentPhoto.caption}</span>
        </div>

        <div className="custom-gallery-header-actions">
          {/* Zoom Toggle */}
          <button
            type="button"
            className="custom-gallery-btn-action"
            onClick={() => setIsZoomed((prev) => !prev)}
            title={isZoomed ? 'Zoom Out (-)' : 'Zoom In (+)'}
            aria-label={isZoomed ? 'Zoom Out' : 'Zoom In'}
          >
            {isZoomed ? <ZoomOut size={19} /> : <ZoomIn size={19} />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            className="custom-gallery-btn-action"
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            aria-label="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 size={19} /> : <Maximize2 size={19} />}
          </button>

          {/* Close Button */}
          <button
            type="button"
            className="custom-gallery-btn-close"
            onClick={onClose}
            title="Close Preview (Esc)"
            aria-label="Close photo preview"
          >
            <X size={20} />
          </button>
        </div>
      </header>

      {/* Main Stage (Image + Side Chevrons) */}
      <main
        className="custom-gallery-stage"
        onClick={onClose}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Previous Button */}
        <button
          type="button"
          className="custom-gallery-nav-btn prev"
          onClick={(e) => {
            e.stopPropagation()
            handlePrev()
          }}
          title="Previous Photo (Left Arrow)"
          aria-label="Previous photo"
        >
          <ChevronLeft size={30} />
        </button>

        {/* Central Photo Viewport */}
        <div
          className={`custom-gallery-img-viewport ${isZoomed ? 'is-zoomed' : ''}`}
          onClick={(e) => e.stopPropagation()}
          onDoubleClick={() => setIsZoomed((prev) => !prev)}
        >
          <img
            key={currentPhoto.src}
            src={currentPhoto.src}
            alt={currentPhoto.alt}
            className={`custom-gallery-active-img ${isZoomed ? 'zoomed-active' : ''}`}
            draggable={false}
          />
        </div>

        {/* Next Button */}
        <button
          type="button"
          className="custom-gallery-nav-btn next"
          onClick={(e) => {
            e.stopPropagation()
            handleNext()
          }}
          title="Next Photo (Right Arrow)"
          aria-label="Next photo"
        >
          <ChevronRight size={30} />
        </button>
      </main>

      {/* Bottom Thumbnail Strip & Caption */}
      <footer
        className="custom-gallery-footer"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="custom-gallery-caption-box">
          <p className="caption-text">{currentPhoto.caption}</p>
          <p className="caption-sub">Ngozi &amp; Sorbari • Holy Matrimony Celebration</p>
        </div>

        {/* Scrollable Thumbnails Strip */}
        <div className="custom-gallery-thumbs-wrapper" ref={thumbnailStripRef}>
          {photos.map((photo, idx) => (
            <button
              key={photo.src + idx}
              type="button"
              className={`custom-gallery-thumb-item ${
                idx === currentIndex ? 'active-thumb' : ''
              }`}
              onClick={() => {
                setIsZoomed(false)
                setCurrentIndex(idx)
              }}
              title={`View Photo ${idx + 1}`}
              aria-label={`Jump to photo ${idx + 1}`}
            >
              <img src={photo.src} alt={photo.alt} />
            </button>
          ))}
        </div>
      </footer>
    </div>
  )

  return createPortal(modalContent, document.body)
}
