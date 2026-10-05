'use client'

import { useEffect, useState } from 'react'

interface SparkleParticle {
  id: number
  x: number
  y: number
  size: number
  duration: number
  delay: number
  drift: number
  opacity: number
}

interface PetalParticle {
  id: number
  x: number
  y: number
  size: number
  rotation: number
  duration: number
  delay: number
  drift: number
  color: string
}

interface AmbientAtmosphereProps {
  className?: string
  sparkleCount?: number
  petalCount?: number
}

export function AmbientAtmosphere({
  className = '',
  sparkleCount = 8,
  petalCount = 5,
}: AmbientAtmosphereProps) {
  const [sparkles, setSparkles] = useState<SparkleParticle[]>([])
  const [petals, setPetals] = useState<PetalParticle[]>([])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)

    // Generate lightweight gold sparkles within section boundaries (5% to 92%)
    const generatedSparkles: SparkleParticle[] = Array.from({ length: sparkleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 86 + 6,
      y: Math.random() * 85 + 8,
      size: Math.random() * 3 + 3, // 3px to 6px
      duration: Math.random() * 5 + 6, // 6s to 11s
      delay: Math.random() * 4,
      drift: (Math.random() - 0.5) * 24, // gentle drift within container
      opacity: Math.random() * 0.35 + 0.3,
    }))

    // Generate romantic delicate burgundy/gold floating petals
    const petalColors = ['#5C1D2E', '#8B263E', '#D4AF37', '#E5A1A8']
    const generatedPetals: PetalParticle[] = Array.from({ length: petalCount }, (_, i) => ({
      id: i,
      x: Math.random() * 84 + 8,
      y: Math.random() * 85 + 8,
      size: Math.random() * 7 + 7, // 7px to 14px
      rotation: Math.random() * 360,
      duration: Math.random() * 8 + 12, // 12s to 20s
      delay: Math.random() * 6,
      drift: (Math.random() - 0.5) * 36,
      color: petalColors[i % petalColors.length],
    }))

    setSparkles(generatedSparkles)
    setPetals(generatedPetals)
  }, [sparkleCount, petalCount])

  if (!isClient) return null

  return (
    <div className={`section-atmosphere-layer ${className}`} aria-hidden="true">
      {/* Floating Gold Sparkle Stars */}
      {sparkles.map((s) => (
        <div
          key={`sparkle-${s.id}`}
          className="ambient-sparkle-star"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animationDuration: `${s.duration}s`,
            animationDelay: `${s.delay}s`,
            opacity: s.opacity,
            ['--drift' as any]: `${s.drift}px`,
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" className="sparkle-svg">
            <path
              d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z"
              fill="url(#goldSparkleGrad)"
            />
            <defs>
              <linearGradient id="goldSparkleGrad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FFF4D0" />
                <stop offset="0.5" stopColor="#D4AF37" />
                <stop offset="1" stopColor="#B38728" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      ))}

      {/* Floating Soft Petals */}
      {petals.map((p) => (
        <div
          key={`petal-${p.id}`}
          className="ambient-floating-petal"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size * 1.3}px`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            transform: `rotate(${p.rotation}deg)`,
            ['--drift' as any]: `${p.drift}px`,
          }}
        >
          <div
            className="petal-shape"
            style={{
              background: `radial-gradient(ellipse at 30% 30%, ${p.color}, rgba(92, 29, 46, 0.4))`,
            }}
          />
        </div>
      ))}
    </div>
  )
}
