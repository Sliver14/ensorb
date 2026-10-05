import React from 'react'

export function MonogramLogo({ className = '', size = 48 }: { className?: string; size?: number }) {
  return (
    <div className={`monogram-brand ${className}`} style={{ height: size, display: 'inline-flex', alignItems: 'center' }}>
      <img
        src="/logo.png"
        alt="ENSORB Ngozi & Sorbari Wedding Logo"
        style={{ height: size, width: 'auto', objectFit: 'contain' }}
        className="monogram-logo-img"
      />
    </div>
  )
}

export function BotanicalSprig({ className = '', style = {} }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`botanical-sprig ${className}`}
      style={style}
    >
      <path
        d="M20 100 C 40 70, 70 45, 100 20"
        stroke="#5E6140"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.75"
      />
      {/* Leaves */}
      <path d="M42 78 C 34 72, 38 62, 48 64 C 47 72, 43 76, 42 78 Z" fill="#7B9E8E" opacity="0.8" />
      <path d="M52 70 C 60 64, 66 70, 60 78 C 54 77, 51 73, 52 70 Z" fill="#5E6140" opacity="0.75" />
      <path d="M64 56 C 56 50, 60 40, 70 42 C 69 50, 65 54, 64 56 Z" fill="#8FAFA0" opacity="0.8" />
      <path d="M74 48 C 82 42, 88 48, 82 56 C 76 55, 73 51, 74 48 Z" fill="#5E6140" opacity="0.75" />
      <path d="M86 34 C 78 28, 82 18, 92 20 C 91 28, 87 32, 86 34 Z" fill="#7B9E8E" opacity="0.8" />
      <path d="M96 26 C 104 20, 110 26, 104 34 C 98 33, 95 29, 96 26 Z" fill="#5E6140" opacity="0.75" />
    </svg>
  )
}

export function ChurchIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className={className} width="28" height="28">
      <path d="M12 2v4M10 4h4" />
      <path d="M6 9l6-4 6 4v12H6V9z" />
      <path d="M10 21v-5a2 2 0 0 1 4 0v5" />
      <path d="M2 14l4-3v10H2z" />
      <path d="M22 14l-4-3v10h4z" />
    </svg>
  )
}

export function ChampagneIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className={className} width="28" height="28">
      <path d="M8 3l3 8a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3l3-8h1z" />
      <path d="M6 14v6M3 20h6" />
      <path d="M16 3l-3 8a3 3 0 0 0 3 3h1a3 3 0 0 0 3-3l-3-8h-1z" />
      <path d="M18 14v6M15 20h6" />
      <path d="M12 5v2" />
    </svg>
  )
}

export function CalendarEventIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className={className} width="28" height="28">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <circle cx="12" cy="15" r="1.5" fill="currentColor" />
    </svg>
  )
}

export function HeroCornerFlower({ className = '', style = {} }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`hero-corner-flower-wrap ${className}`} style={style} aria-hidden="true">
      <svg
        viewBox="0 0 280 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="hero-corner-flower-svg"
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        <defs>
          <radialGradient id="blushPetalGrad" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#F8DCE0" stopOpacity="0.95" />
            <stop offset="60%" stopColor="#E5A1A8" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#C97A84" stopOpacity="0.9" />
          </radialGradient>
          <radialGradient id="rosebudGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FAF0F2" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#EAA7AF" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#8A2840" stopOpacity="0.8" />
          </radialGradient>
          <linearGradient id="sageLeafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A4C4B5" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#7B9E8E" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#4E7060" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="oliveLeafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8C9160" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#5E6140" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#3C4026" stopOpacity="0.8" />
          </linearGradient>
        </defs>

        {/* Main Arching Olive & Vine Stems */}
        <path
          d="M260 20 C230 45, 180 85, 130 140 C95 180, 60 230, 40 260"
          stroke="#4D5230"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.8"
        />
        <path
          d="M270 35 C245 80, 195 130, 150 185"
          stroke="#687042"
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.65"
        />
        <path
          d="M210 30 C175 60, 130 90, 80 120"
          stroke="#5E6140"
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.6"
        />

        {/* Large Olive & Sage Leaves - Outer Arc */}
        <g className="flower-leaves-outer">
          <path d="M245 42 C230 25, 205 28, 215 50 C228 65, 240 58, 245 42 Z" fill="url(#sageLeafGrad)" />
          <path d="M225 35 Q225 50 238 45" stroke="#3A5648" strokeWidth="0.8" opacity="0.6" />

          <path d="M215 70 C195 55, 175 68, 188 88 C202 98, 216 88, 215 70 Z" fill="url(#oliveLeafGrad)" />
          <path d="M196 68 Q200 82 208 81" stroke="#2B2E18" strokeWidth="0.8" opacity="0.6" />

          <path d="M185 45 C160 35, 142 52, 158 72 C170 82, 184 65, 185 45 Z" fill="url(#sageLeafGrad)" />
          <path d="M166 48 Q168 64 176 66" stroke="#3A5648" strokeWidth="0.8" opacity="0.6" />

          <path d="M150 95 C125 80, 110 100, 126 120 C140 132, 155 115, 150 95 Z" fill="url(#oliveLeafGrad)" />
          <path d="M130 94 Q136 110 144 112" stroke="#2B2E18" strokeWidth="0.8" opacity="0.6" />

          <path d="M125 60 C100 48, 85 70, 102 88 C116 98, 128 80, 125 60 Z" fill="url(#sageLeafGrad)" />
          
          <path d="M110 120 C85 110, 72 135, 92 150 C108 160, 120 140, 110 120 Z" fill="url(#oliveLeafGrad)" />

          <path d="M85 90 C62 80, 50 102, 70 118 C85 128, 95 108, 85 90 Z" fill="url(#sageLeafGrad)" />

          <path d="M75 145 C55 138, 45 160, 62 172 C78 180, 88 162, 75 145 Z" fill="url(#oliveLeafGrad)" />

          <path d="M55 185 C38 180, 32 200, 48 210 C62 216, 70 200, 55 185 Z" fill="url(#sageLeafGrad)" />
        </g>

        {/* Small Golden & Burgundy Berries */}
        <g className="flower-berries" opacity="0.85">
          <circle cx="230" cy="25" r="3.5" fill="#D4AF37" />
          <circle cx="242" cy="20" r="2.8" fill="#C97A84" />
          <circle cx="195" cy="40" r="3.2" fill="#D4AF37" />
          <circle cx="170" cy="35" r="2.8" fill="#C97A84" />
          <circle cx="140" cy="80" r="3.5" fill="#D4AF37" />
          <circle cx="105" cy="110" r="3" fill="#C97A84" />
          <circle cx="70" cy="140" r="3.2" fill="#D4AF37" />
        </g>

        {/* Blossom Petals & Watercolor Flower Buds */}
        <g className="flower-blooms">
          {/* Main Top Corner Blossom Cluster */}
          <g transform="translate(195, 80)">
            <ellipse cx="0" cy="-12" rx="14" ry="9" transform="rotate(-20)" fill="url(#blushPetalGrad)" />
            <ellipse cx="12" cy="-4" rx="13" ry="8" transform="rotate(25)" fill="url(#blushPetalGrad)" />
            <ellipse cx="10" cy="12" rx="14" ry="9" transform="rotate(70)" fill="url(#blushPetalGrad)" />
            <ellipse cx="-6" cy="12" rx="13" ry="8" transform="rotate(120)" fill="url(#blushPetalGrad)" />
            <ellipse cx="-12" cy="-2" rx="14" ry="9" transform="rotate(-70)" fill="url(#blushPetalGrad)" />
            {/* Center Rosebud Core */}
            <circle cx="0" cy="0" r="8" fill="url(#rosebudGrad)" />
            <circle cx="0" cy="0" r="4" fill="#6B1D2F" opacity="0.6" />
            <circle cx="-1" cy="-1" r="1.5" fill="#FFF2F4" opacity="0.8" />
          </g>

          {/* Secondary Delicate Blossom */}
          <g transform="translate(150, 145) scale(0.8)">
            <ellipse cx="0" cy="-10" rx="12" ry="7" transform="rotate(-15)" fill="url(#blushPetalGrad)" />
            <ellipse cx="10" cy="-3" rx="11" ry="7" transform="rotate(30)" fill="url(#blushPetalGrad)" />
            <ellipse cx="8" cy="10" rx="12" ry="7" transform="rotate(75)" fill="url(#blushPetalGrad)" />
            <ellipse cx="-5" cy="10" rx="11" ry="7" transform="rotate(130)" fill="url(#blushPetalGrad)" />
            <ellipse cx="-10" cy="-2" rx="12" ry="7" transform="rotate(-65)" fill="url(#blushPetalGrad)" />
            <circle cx="0" cy="0" r="6.5" fill="url(#rosebudGrad)" />
            <circle cx="0" cy="0" r="3" fill="#6B1D2F" opacity="0.6" />
          </g>

          {/* Small Bud Cluster along Lower Stem */}
          <g transform="translate(95, 185) scale(0.65)">
            <ellipse cx="0" cy="-8" rx="10" ry="6" fill="url(#blushPetalGrad)" />
            <ellipse cx="6" cy="4" rx="9" ry="6" transform="rotate(60)" fill="url(#blushPetalGrad)" />
            <ellipse cx="-6" cy="4" rx="9" ry="6" transform="rotate(-60)" fill="url(#blushPetalGrad)" />
            <circle cx="0" cy="0" r="5" fill="url(#rosebudGrad)" />
          </g>
        </g>
      </svg>
    </div>
  )
}

export function TornPaperDivider({ position = 'top', color = '#FAF7F2' }: { position?: 'top' | 'bottom'; color?: string }) {
  const isTop = position === 'top'
  return (
    <div className={`torn-paper-divider torn-${position}`} aria-hidden="true">
      <svg
        viewBox="0 0 1440 44"
        fill="none"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block', width: '100%', height: '34px' }}
      >
        {isTop ? (
          <path
            d="M0,0 L1440,0 L1440,18 C1395,24 1335,8 1270,18 C1195,28 1135,8 1060,18 C985,26 925,4 850,16 C775,28 710,6 640,18 C570,28 515,4 450,16 C385,26 330,8 270,20 C210,30 165,12 110,24 C65,32 30,20 0,26 Z"
            fill={color}
          />
        ) : (
          <path
            d="M0,22 C30,16 65,28 110,18 C165,8 210,26 270,16 C330,4 385,22 450,12 C515,2 570,24 640,14 C710,2 775,22 850,12 C925,2 985,22 1060,14 C1135,4 1195,24 1270,14 C1335,4 1395,20 1440,16 L1440,44 L0,44 Z"
            fill={color}
          />
        )}
      </svg>
    </div>
  )
}

export function HeroBottomTornWithWash({
  className = '',
  paperColor = '#FAF7F2',
  washColor = 'rgba(229, 161, 168, 0.45)'
}: {
  className?: string;
  paperColor?: string;
  washColor?: string;
}) {
  return (
    <div className={`hero-bottom-torn-container ${className}`} aria-hidden="true">
      {/* Underlying Organic Blush Pink Watercolor Wash Ribbon */}
      <div className="hero-blush-wash-layer">
        <svg
          viewBox="0 0 1440 64"
          fill="none"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: 'block', width: '100%', height: '52px' }}
        >
          <path
            d="M0,24 C40,12 90,36 150,22 C220,8 280,32 360,18 C440,4 510,30 600,16 C690,2 760,34 850,20 C940,6 1010,32 1100,18 C1190,4 1260,28 1350,14 C1395,8 1425,20 1440,24 L1440,64 L0,64 Z"
            fill={washColor}
          />
        </svg>
      </div>

      {/* Main Foreground Cream Torn Paper Edge */}
      <div className="hero-cream-torn-layer">
        <svg
          viewBox="0 0 1440 50"
          fill="none"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: 'block', width: '100%', height: '42px' }}
        >
          <path
            d="M0,22 C35,12 80,30 135,18 C195,6 250,28 320,14 C390,2 455,26 530,12 C605,0 670,28 750,14 C830,2 895,26 975,12 C1055,0 1120,24 1200,12 C1275,2 1345,22 1440,14 L1440,50 L0,50 Z"
            fill={paperColor}
          />
        </svg>
      </div>
    </div>
  )
}

export function TornBannerEdge({
  position = 'top',
  color = '#FAF7F2',
  flip = false
}: {
  position?: 'top' | 'bottom';
  color?: string;
  flip?: boolean;
}) {
  const isTop = position === 'top'
  return (
    <div className={`torn-banner-edge edge-${position} ${flip ? 'flipped' : ''}`} aria-hidden="true">
      <svg
        viewBox="0 0 1440 38"
        fill="none"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block', width: '100%', height: '28px' }}
      >
        {isTop ? (
          <path
            d="M0,0 L1440,0 L1440,16 C1395,24 1335,4 1265,16 C1185,26 1120,6 1040,16 C960,26 895,4 815,16 C735,28 670,6 590,18 C510,28 445,4 370,16 C295,26 230,8 160,20 C95,30 45,12 0,22 Z"
            fill={color}
          />
        ) : (
          <path
            d="M0,16 C45,6 95,24 160,12 C230,2 295,20 370,8 C445,0 510,22 590,10 C670,0 735,22 815,10 C895,0 960,20 1040,10 C1120,0 1185,20 1265,10 C1335,0 1395,18 1440,12 L1440,38 L0,38 Z"
            fill={color}
          />
        )}
      </svg>
    </div>
  )
}

export function GiftBoxIcon({ className = '', size = 32 }: { className?: string; size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      width={size}
      height={size}
    >
      <polyline points="20 12 20 22 4 22 4 12" />
      <rect x="2" y="7" width="20" height="5" />
      <line x1="12" y1="22" x2="12" y2="7" />
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
    </svg>
  )
}

export function BankBuildingIcon({ className = '', size = 36 }: { className?: string; size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      width={size}
      height={size}
    >
      <line x1="3" y1="21" x2="21" y2="21" />
      <line x1="4" y1="10" x2="20" y2="10" />
      <polygon points="12 2 20 7 4 7" />
      <line x1="6" y1="10" x2="6" y2="18" />
      <line x1="10" y1="10" x2="10" y2="18" />
      <line x1="14" y1="10" x2="14" y2="18" />
      <line x1="18" y1="10" x2="18" y2="18" />
    </svg>
  )
}

export function SideTallBotanical({ className = '', style = {} }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`side-tall-botanical ${className}`} style={style} aria-hidden="true">
      <svg
        viewBox="0 0 160 380"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        <path
          d="M30 360 C 50 280, 70 190, 85 40"
          stroke="#4D5230"
          strokeWidth="2.2"
          strokeLinecap="round"
          opacity="0.8"
        />
        {/* Branch 1 */}
        <path d="M68 280 C 45 260, 38 230, 60 215 C 75 230, 75 265, 68 280 Z" fill="#7B9E8E" opacity="0.8" />
        <path d="M72 260 C 95 240, 115 250, 105 275 C 88 280, 78 270, 72 260 Z" fill="#5E6140" opacity="0.75" />
        
        {/* Branch 2 */}
        <path d="M76 200 C 48 185, 42 155, 66 142 C 82 155, 82 185, 76 200 Z" fill="#8FAFA0" opacity="0.8" />
        <path d="M80 180 C 108 165, 126 175, 114 200 C 96 205, 86 190, 80 180 Z" fill="#5E6140" opacity="0.75" />

        {/* Branch 3 */}
        <path d="M82 120 C 58 105, 52 75, 74 65 C 90 78, 88 108, 82 120 Z" fill="#7B9E8E" opacity="0.8" />
        <path d="M84 100 C 112 85, 128 98, 118 120 C 100 125, 90 110, 84 100 Z" fill="#5E6140" opacity="0.75" />

        {/* Top leaves */}
        <path d="M85 40 C 72 20, 92 10, 102 25 C 100 38, 92 42, 85 40 Z" fill="#7B9E8E" opacity="0.85" />
      </svg>
    </div>
  )
}

export function CardCornerBotanical({ className = '', style = {} }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      viewBox="0 0 70 70"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`card-corner-botanical ${className}`}
      style={style}
    >
      <path
        d="M10 60 C 25 45, 45 30, 60 10"
        stroke="#5E6140"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.75"
      />
      <path d="M26 48 C 18 42, 22 34, 30 36 C 29 42, 27 46, 26 48 Z" fill="#7B9E8E" opacity="0.8" />
      <path d="M34 42 C 40 36, 46 42, 40 48 C 36 47, 34 44, 34 42 Z" fill="#5E6140" opacity="0.75" />
      <path d="M42 30 C 35 24, 38 16, 46 18 C 45 24, 43 28, 42 30 Z" fill="#8FAFA0" opacity="0.8" />
      <path d="M50 24 C 56 18, 62 24, 56 30 C 52 29, 50 26, 50 24 Z" fill="#5E6140" opacity="0.75" />
    </svg>
  )
}

export function PinLocationIcon({ className = '', size = 24 }: { className?: string; size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      width={size}
      height={size}
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

export function PaperPlaneIcon({ className = '', size = 16 }: { className?: string; size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      width={size}
      height={size}
    >
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  )
}

export function HeartDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`wedding-heart-divider ${className}`}>
      <span className="heart-divider-line" />
      <span className="heart-divider-symbol">♡</span>
      <span className="heart-divider-line" />
    </div>
  )
}

export function WaxSealMedallion({ className = '', size = 96 }: { className?: string; size?: number }) {
  return (
    <div className={`wax-seal-medallion ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
        <defs>
          <radialGradient id="waxBurgundyGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#7A2238" />
            <stop offset="45%" stopColor="#4A1525" />
            <stop offset="90%" stopColor="#2E0C16" />
            <stop offset="100%" stopColor="#1A060C" />
          </radialGradient>
          <linearGradient id="goldSealTrim" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="35%" stopColor="#D4AF37" />
            <stop offset="70%" stopColor="#AA7C11" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
          <filter id="sealShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#000000" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* Outer Melted Wax Ring (Organic Rim) */}
        <path
          d="M60 4 C78 2, 94 10, 106 24 C118 38, 120 56, 116 74 C112 92, 98 108, 80 114 C62 120, 42 116, 26 106 C10 96, 2 78, 4 60 C6 42, 18 24, 34 12 C44 4, 52 6, 60 4 Z"
          fill="url(#waxBurgundyGrad)"
          filter="url(#sealShadow)"
        />

        {/* Inner Gold Foil Rim */}
        <circle cx="60" cy="60" r="44" stroke="url(#goldSealTrim)" strokeWidth="1.8" strokeDasharray="3 2" opacity="0.85" />
        <circle cx="60" cy="60" r="40" stroke="url(#goldSealTrim)" strokeWidth="1.2" opacity="0.9" />

        {/* Laurel Wreath */}
        <g stroke="url(#goldSealTrim)" strokeWidth="1.2" fill="none" opacity="0.9">
          {/* Left arc */}
          <path d="M36 68 C 30 52, 34 38, 46 28" strokeLinecap="round" />
          <path d="M30 50 C 26 48, 28 44, 33 46 Z" fill="url(#goldSealTrim)" />
          <path d="M33 40 C 30 38, 32 34, 38 36 Z" fill="url(#goldSealTrim)" />
          <path d="M39 32 C 37 29, 41 27, 45 30 Z" fill="url(#goldSealTrim)" />

          {/* Right arc */}
          <path d="M84 68 C 90 52, 86 38, 74 28" strokeLinecap="round" />
          <path d="M90 50 C 94 48, 92 44, 87 46 Z" fill="url(#goldSealTrim)" />
          <path d="M87 40 C 90 38, 88 34, 82 36 Z" fill="url(#goldSealTrim)" />
          <path d="M81 32 C 83 29, 79 27, 75 30 Z" fill="url(#goldSealTrim)" />
        </g>

        {/* Center Embossed Monogram N & S */}
        <text
          x="60"
          y="66"
          textAnchor="middle"
          fill="url(#goldSealTrim)"
          fontFamily="var(--font-serif, 'Cormorant Garamond', serif)"
          fontSize="24"
          fontWeight="600"
          letterSpacing="1"
        >
          N&amp;S
        </text>

        {/* Bottom Year 2026 */}
        <text
          x="60"
          y="84"
          textAnchor="middle"
          fill="url(#goldSealTrim)"
          fontFamily="var(--font-body, 'Montserrat', sans-serif)"
          fontSize="7"
          letterSpacing="2.5"
          opacity="0.8"
        >
          2026
        </text>
      </svg>
    </div>
  )
}

export function GoldSparklesIcon({ className = '', size = 20 }: { className?: string; size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      width={size}
      height={size}
      style={{ color: '#D4AF37' }}
    >
      <path d="M12 0L14.5 8.5L23 11L14.5 13.5L12 22L9.5 13.5L1 11L9.5 8.5L12 0Z" />
    </svg>
  )
}


