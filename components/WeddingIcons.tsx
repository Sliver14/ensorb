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
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="sprigStemGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3E4424" />
          <stop offset="60%" stopColor="#5E6638" />
          <stop offset="100%" stopColor="#7E8850" />
        </linearGradient>
        <linearGradient id="sprigLeafSage" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C2DBD0" />
          <stop offset="60%" stopColor="#87ADA0" />
          <stop offset="100%" stopColor="#4F7366" />
        </linearGradient>
        <linearGradient id="sprigLeafOlive" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9FA768" />
          <stop offset="60%" stopColor="#69713C" />
          <stop offset="100%" stopColor="#3D4420" />
        </linearGradient>
        <linearGradient id="sprigLeafLight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E2EFE9" />
          <stop offset="60%" stopColor="#B2D0C4" />
          <stop offset="100%" stopColor="#799E90" />
        </linearGradient>
        <radialGradient id="sprigGoldBerry" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#FFF7D6" />
          <stop offset="45%" stopColor="#E5C058" />
          <stop offset="100%" stopColor="#9C7714" />
        </radialGradient>
      </defs>

      {/* Main Arching Stem */}
      <path
        d="M16 104 C 36 76, 66 48, 104 16"
        stroke="url(#sprigStemGrad)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Secondary Delicate Stem Branch */}
      <path
        d="M48 64 C 62 52, 76 56, 88 44"
        stroke="url(#sprigStemGrad)"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.8"
      />

      {/* Leaf Pair 1 (Lower) */}
      <g className="leaf-pair-1">
        {/* Left Leaf (Two-tone) */}
        <path d="M34 84 C 20 80, 18 68, 30 64 C 38 72, 36 80, 34 84 Z" fill="url(#sprigLeafSage)" />
        <path d="M34 84 C 28 82, 22 74, 30 64 C 32 70, 34 78, 34 84 Z" fill="url(#sprigLeafLight)" opacity="0.6" />
        <path d="M34 84 Q 28 72 30 64" stroke="#3A5648" strokeWidth="0.6" opacity="0.5" />

        {/* Right Leaf */}
        <path d="M42 76 C 52 66, 62 70, 58 82 C 48 84, 44 80, 42 76 Z" fill="url(#sprigLeafOlive)" />
        <path d="M42 76 C 48 70, 56 74, 58 82 C 52 82, 46 80, 42 76 Z" fill="#B3BC7E" opacity="0.4" />
        <path d="M42 76 Q 52 76 58 82" stroke="#2B2E18" strokeWidth="0.6" opacity="0.5" />
      </g>

      {/* Golden Berries at Node 1 */}
      <circle cx="37" cy="80" r="2.8" fill="url(#sprigGoldBerry)" />
      <circle cx="44" cy="74" r="2.2" fill="url(#sprigGoldBerry)" />

      {/* Leaf Pair 2 (Mid-Lower) */}
      <g className="leaf-pair-2">
        <path d="M50 62 C 34 54, 38 42, 50 44 C 54 52, 52 58, 50 62 Z" fill="url(#sprigLeafSage)" />
        <path d="M50 62 C 40 56, 42 46, 50 44 C 52 50, 52 56, 50 62 Z" fill="url(#sprigLeafLight)" opacity="0.6" />
        <path d="M50 62 Q 44 52 50 44" stroke="#3A5648" strokeWidth="0.6" opacity="0.5" />

        <path d="M58 54 C 70 46, 78 52, 72 64 C 62 64, 60 58, 58 54 Z" fill="url(#sprigLeafOlive)" />
        <path d="M58 54 Q 68 54 72 64" stroke="#2B2E18" strokeWidth="0.6" opacity="0.5" />
      </g>

      {/* Leaf Pair 3 (Mid-Upper) */}
      <g className="leaf-pair-3">
        <path d="M68 44 C 54 34, 60 22, 70 26 C 72 34, 70 40, 68 44 Z" fill="url(#sprigLeafSage)" />
        <path d="M68 44 C 60 36, 62 26, 70 26 C 71 32, 70 38, 68 44 Z" fill="url(#sprigLeafLight)" opacity="0.6" />
        <path d="M68 44 Q 64 34 70 26" stroke="#3A5648" strokeWidth="0.6" opacity="0.5" />

        <path d="M76 36 C 88 28, 96 34, 90 46 C 80 46, 78 40, 76 36 Z" fill="url(#sprigLeafOlive)" />
        <path d="M76 36 Q 86 36 90 46" stroke="#2B2E18" strokeWidth="0.6" opacity="0.5" />
      </g>

      {/* Golden Berries at Mid Node */}
      <circle cx="71" cy="40" r="2.6" fill="url(#sprigGoldBerry)" />
      <circle cx="78" cy="34" r="2" fill="url(#sprigGoldBerry)" />

      {/* Leaf Pair 4 (Upper) */}
      <g className="leaf-pair-4">
        <path d="M86 26 C 74 18, 80 8, 88 12 C 90 18, 88 23, 86 26 Z" fill="url(#sprigLeafSage)" />
        <path d="M86 26 C 78 20, 82 12, 88 12 C 89 16, 88 21, 86 26 Z" fill="url(#sprigLeafLight)" opacity="0.6" />

        <path d="M92 20 C 102 12, 110 18, 104 28 C 96 28, 94 23, 92 20 Z" fill="url(#sprigLeafOlive)" />
      </g>

      {/* Terminal Delicate Bud & White Petal Bloom */}
      <g className="terminal-bud" transform="translate(98, 14)">
        <path d="M0 6 C -3 0, 3 -4, 6 2 Z" fill="#FFFDF8" stroke="#E5DFD3" strokeWidth="0.5" />
        <circle cx="3" cy="1" r="2.2" fill="url(#sprigGoldBerry)" />
      </g>
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
        viewBox="0 0 300 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="hero-corner-flower-svg"
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        <defs>
          {/* Master Shading Gradients */}
          <linearGradient id="blushPetalSoft" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.99" />
            <stop offset="30%" stopColor="#FFF5F7" stopOpacity="0.97" />
            <stop offset="70%" stopColor="#F9D7DE" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#E49CA7" stopOpacity="0.92" />
          </linearGradient>

          <linearGradient id="blushPetalDeep" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF0F3" stopOpacity="0.98" />
            <stop offset="45%" stopColor="#F4B5C1" stopOpacity="0.95" />
            <stop offset="80%" stopColor="#D47385" stopOpacity="0.92" />
            <stop offset="100%" stopColor="#8C2237" stopOpacity="0.9" />
          </linearGradient>

          <radialGradient id="roseCoreGlow" cx="45%" cy="45%" r="55%">
            <stop offset="0%" stopColor="#FFF9FA" stopOpacity="1" />
            <stop offset="35%" stopColor="#F8CCD5" stopOpacity="0.98" />
            <stop offset="70%" stopColor="#D45A72" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#661424" stopOpacity="0.95" />
          </radialGradient>

          <radialGradient id="roseCenterDark" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#8B1D33" stopOpacity="0.95" />
            <stop offset="60%" stopColor="#54111F" stopOpacity="0.98" />
            <stop offset="100%" stopColor="#2E070F" stopOpacity="1" />
          </radialGradient>

          <linearGradient id="ivoryPeonyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.99" />
            <stop offset="50%" stopColor="#FAF5EE" stopOpacity="0.97" />
            <stop offset="85%" stopColor="#F0DFD7" stopOpacity="0.94" />
            <stop offset="100%" stopColor="#DCB8B4" stopOpacity="0.92" />
          </linearGradient>

          <linearGradient id="sageLeafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C8E2D6" stopOpacity="0.95" />
            <stop offset="55%" stopColor="#87B09F" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#4F7565" stopOpacity="0.88" />
          </linearGradient>

          <linearGradient id="sageLeafLight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E5F3ED" stopOpacity="0.98" />
            <stop offset="60%" stopColor="#B4D7C9" stopOpacity="0.92" />
            <stop offset="100%" stopColor="#7DA594" stopOpacity="0.9" />
          </linearGradient>

          <linearGradient id="oliveLeafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9FA865" stopOpacity="0.95" />
            <stop offset="55%" stopColor="#677038" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#3A401A" stopOpacity="0.95" />
          </linearGradient>

          <linearGradient id="oliveLeafLight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#CAD194" stopOpacity="0.98" />
            <stop offset="55%" stopColor="#939D58" stopOpacity="0.92" />
            <stop offset="100%" stopColor="#5B642B" stopOpacity="0.9" />
          </linearGradient>

          <linearGradient id="goldFiligreeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF8D9" />
            <stop offset="35%" stopColor="#E8C762" />
            <stop offset="70%" stopColor="#BA8E1E" />
            <stop offset="100%" stopColor="#8C660B" />
          </linearGradient>

          <radialGradient id="goldBerryGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FFFDF0" />
            <stop offset="40%" stopColor="#E8C762" />
            <stop offset="85%" stopColor="#AA7E14" />
            <stop offset="100%" stopColor="#664906" />
          </radialGradient>

          <radialGradient id="burgundyBerryGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FCE4E9" />
            <stop offset="40%" stopColor="#C94A65" />
            <stop offset="80%" stopColor="#751528" />
            <stop offset="100%" stopColor="#380610" />
          </radialGradient>

          {/* Realistic Petal Drop Shadows */}
          <filter id="petalShadow" x="-15%" y="-15%" width="135%" height="135%">
            <feDropShadow dx="-1" dy="2.5" stdDeviation="3" floodColor="#3D0B17" floodOpacity="0.16" />
          </filter>

          <filter id="foliageShadow" x="-15%" y="-15%" width="135%" height="135%">
            <feDropShadow dx="1" dy="2" stdDeviation="2.5" floodColor="#1C210E" floodOpacity="0.12" />
          </filter>
        </defs>

        {/* =================================================================
            LAYER 1: BACKGROUND GOLDEN FILIGREE VINES & SWIRLING TENDRILS
            ================================================================= */}
        <g className="flower-gold-filigree" opacity="0.9">
          {/* Main Gold Vine Arc */}
          <path
            d="M285 15 C255 45, 205 75, 155 135 C115 185, 75 235, 45 285"
            stroke="url(#goldFiligreeGrad)"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          {/* Secondary Delicate Gold Tendril */}
          <path
            d="M290 40 C250 85, 195 125, 125 145 C85 155, 45 175, 25 210"
            stroke="url(#goldFiligreeGrad)"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.75"
          />
          {/* Delicate Spiraling Gold Curls */}
          <path
            d="M175 60 C155 48, 145 35, 150 25 C155 15, 168 18, 165 28 C162 38, 150 42, 142 40"
            stroke="url(#goldFiligreeGrad)"
            strokeWidth="1.1"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M95 160 C75 165, 62 160, 60 150 C58 140, 70 135, 75 142 C80 150, 74 158, 66 160"
            stroke="url(#goldFiligreeGrad)"
            strokeWidth="1"
            fill="none"
            strokeLinecap="round"
          />
        </g>

        {/* =================================================================
            LAYER 2: MAIN GREENERY (OLIVE & SAGE EUCALYPTUS BRANCHES)
            ================================================================= */}
        {/* Main Woody Olive Stem */}
        <path
          d="M280 20 C240 55, 185 100, 135 155 C100 195, 65 245, 40 280"
          stroke="#444B22"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
        <path
          d="M282 22 C242 57, 187 102, 137 157 C102 197, 67 247, 42 282"
          stroke="#6E773E"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.6"
        />

        {/* Layered Foliage Group */}
        <g className="flower-leaves" filter="url(#foliageShadow)">
          {/* Leaf Cluster 1 - Top Far Corner */}
          <g transform="translate(255, 30) rotate(-15)">
            <path d="M0 0 C 15 -25, 40 -20, 48 5 C 38 25, 18 20, 0 0 Z" fill="url(#sageLeafGrad)" />
            <path d="M0 0 C 20 -20, 38 -15, 48 5 C 35 10, 15 5, 0 0 Z" fill="url(#sageLeafLight)" opacity="0.65" />
            <path d="M0 0 Q 25 -5 48 5" stroke="#3A5648" strokeWidth="0.8" opacity="0.6" />
          </g>

          {/* Leaf Cluster 2 - Top Arching Olive */}
          <g transform="translate(225, 25) rotate(-35)">
            <path d="M0 0 C 18 -32, 42 -26, 52 0 C 38 22, 15 18, 0 0 Z" fill="url(#oliveLeafGrad)" />
            <path d="M0 0 C 22 -28, 40 -20, 52 0 C 35 5, 15 2, 0 0 Z" fill="url(#oliveLeafLight)" opacity="0.6" />
            <path d="M0 0 Q 26 -10 52 0" stroke="#2B2E18" strokeWidth="0.8" opacity="0.6" />
          </g>

          {/* Leaf Cluster 3 - Upper Left Sage */}
          <g transform="translate(180, 38) rotate(-55)">
            <path d="M0 0 C 14 -28, 36 -24, 46 2 C 34 20, 12 16, 0 0 Z" fill="url(#sageLeafGrad)" />
            <path d="M0 0 C 18 -24, 32 -18, 46 2 C 30 8, 12 4, 0 0 Z" fill="url(#sageLeafLight)" opacity="0.65" />
            <path d="M0 0 Q 24 -8 46 2" stroke="#3A5648" strokeWidth="0.75" opacity="0.5" />
          </g>

          {/* Leaf Cluster 4 - Upper-Mid Olive */}
          <g transform="translate(145, 65) rotate(-65)">
            <path d="M0 0 C 16 -30, 38 -22, 48 0 C 35 18, 14 14, 0 0 Z" fill="url(#oliveLeafGrad)" />
            <path d="M0 0 C 20 -25, 36 -18, 48 0 C 32 4, 12 2, 0 0 Z" fill="url(#oliveLeafLight)" opacity="0.6" />
            <path d="M0 0 Q 24 -8 48 0" stroke="#2B2E18" strokeWidth="0.75" opacity="0.5" />
          </g>

          {/* Leaf Cluster 5 - Mid-Left Eucalyptus Pair */}
          <g transform="translate(115, 105) rotate(-75)">
            <path d="M0 0 C 18 -26, 38 -18, 44 6 C 30 22, 10 16, 0 0 Z" fill="url(#sageLeafGrad)" />
            <path d="M0 0 C 20 -20, 35 -14, 44 6 C 28 8, 10 4, 0 0 Z" fill="url(#sageLeafLight)" opacity="0.65" />
            <path d="M0 0 Q 22 -6 44 6" stroke="#3A5648" strokeWidth="0.7" opacity="0.5" />
          </g>

          {/* Leaf Cluster 6 - Mid-Lower Olive */}
          <g transform="translate(95, 145) rotate(-90)">
            <path d="M0 0 C 15 -28, 36 -20, 44 2 C 32 18, 12 14, 0 0 Z" fill="url(#oliveLeafGrad)" />
            <path d="M0 0 C 18 -24, 32 -16, 44 2 C 28 5, 10 2, 0 0 Z" fill="url(#oliveLeafLight)" opacity="0.6" />
            <path d="M0 0 Q 22 -8 44 2" stroke="#2B2E18" strokeWidth="0.7" opacity="0.5" />
          </g>

          {/* Leaf Cluster 7 - Lower Sage */}
          <g transform="translate(70, 195) rotate(-110)">
            <path d="M0 0 C 14 -24, 32 -16, 40 4 C 28 18, 10 14, 0 0 Z" fill="url(#sageLeafGrad)" />
            <path d="M0 0 C 16 -20, 28 -12, 40 4 C 26 6, 8 3, 0 0 Z" fill="url(#sageLeafLight)" opacity="0.65" />
            <path d="M0 0 Q 20 -6 40 4" stroke="#3A5648" strokeWidth="0.7" opacity="0.5" />
          </g>

          {/* Leaf Cluster 8 - Terminal Lower Olive Pair */}
          <g transform="translate(48, 245) rotate(-125)">
            <path d="M0 0 C 12 -22, 28 -14, 34 2 C 24 16, 8 12, 0 0 Z" fill="url(#oliveLeafGrad)" />
            <path d="M0 0 C 14 -18, 24 -10, 34 2 C 22 4, 8 2, 0 0 Z" fill="url(#oliveLeafLight)" opacity="0.6" />
          </g>
        </g>

        {/* =================================================================
            LAYER 3: BABY'S BREATH (GYPSOPHILA) SPRAYS & LUXURY GOLD BERRIES
            ================================================================= */}
        <g className="flower-gypsophila-berries">
          {/* Gypsophila Spray Top-Right */}
          <g className="gyp-spray-1" stroke="#87957A" strokeWidth="0.9" strokeLinecap="round">
            <path d="M245 48 Q 260 40 270 32" />
            <path d="M255 42 Q 268 46 276 42" />
            <path d="M248 46 Q 256 56 266 60" />
            {/* White florets */}
            <circle cx="270" cy="32" r="3.2" fill="#FFFFFF" stroke="#E8E0D2" strokeWidth="0.6" />
            <circle cx="276" cy="42" r="2.8" fill="#FFFBF5" stroke="#E8E0D2" strokeWidth="0.6" />
            <circle cx="266" cy="60" r="3" fill="#FFFFFF" stroke="#E8E0D2" strokeWidth="0.6" />
            <circle cx="270" cy="32" r="1" fill="#D4AF37" />
            <circle cx="276" cy="42" r="0.9" fill="#D4AF37" />
            <circle cx="266" cy="60" r="0.9" fill="#D4AF37" />
          </g>

          {/* Gypsophila Spray Mid-Left */}
          <g className="gyp-spray-2" stroke="#87957A" strokeWidth="0.9" strokeLinecap="round">
            <path d="M125 120 Q 105 110 95 98" />
            <path d="M115 114 Q 100 122 88 120" />
            <path d="M110 118 Q 98 132 86 138" />
            <circle cx="95" cy="98" r="3.2" fill="#FFFFFF" stroke="#E8E0D2" strokeWidth="0.6" />
            <circle cx="88" cy="120" r="2.8" fill="#FFFBF5" stroke="#E8E0D2" strokeWidth="0.6" />
            <circle cx="86" cy="138" r="3" fill="#FFFFFF" stroke="#E8E0D2" strokeWidth="0.6" />
            <circle cx="95" cy="98" r="1" fill="#D4AF37" />
            <circle cx="88" cy="120" r="0.9" fill="#D4AF37" />
            <circle cx="86" cy="138" r="0.9" fill="#D4AF37" />
          </g>

          {/* Gypsophila Spray Lower */}
          <g className="gyp-spray-3" stroke="#87957A" strokeWidth="0.9" strokeLinecap="round">
            <path d="M68 215 Q 52 210 42 202" />
            <path d="M60 212 Q 48 222 38 226" />
            <circle cx="42" cy="202" r="3" fill="#FFFFFF" stroke="#E8E0D2" strokeWidth="0.6" />
            <circle cx="38" cy="226" r="2.8" fill="#FFFBF5" stroke="#E8E0D2" strokeWidth="0.6" />
            <circle cx="42" cy="202" r="0.9" fill="#D4AF37" />
            <circle cx="38" cy="226" r="0.8" fill="#D4AF37" />
          </g>

          {/* Golden & Burgundy Pearl Berry Clusters */}
          <g className="berry-clusters">
            {/* Upper Cluster */}
            <circle cx="238" cy="36" r="3.6" fill="url(#goldBerryGrad)" />
            <circle cx="248" cy="28" r="2.8" fill="url(#burgundyBerryGrad)" />
            <circle cx="254" cy="38" r="3.2" fill="url(#goldBerryGrad)" />

            {/* Mid-Upper Cluster */}
            <circle cx="168" cy="52" r="3.8" fill="url(#goldBerryGrad)" />
            <circle cx="156" cy="46" r="3" fill="url(#burgundyBerryGrad)" />
            <circle cx="158" cy="58" r="3.2" fill="url(#goldBerryGrad)" />

            {/* Mid Cluster */}
            <circle cx="124" cy="98" r="3.8" fill="url(#burgundyBerryGrad)" />
            <circle cx="114" cy="92" r="3.2" fill="url(#goldBerryGrad)" />

            {/* Lower Cluster */}
            <circle cx="82" cy="172" r="3.6" fill="url(#goldBerryGrad)" />
            <circle cx="72" cy="166" r="3" fill="url(#burgundyBerryGrad)" />
            <circle cx="48" cy="228" r="3.4" fill="url(#goldBerryGrad)" />
          </g>
        </g>

        {/* =================================================================
            LAYER 4: ROSEBUDS & SIDE BLOOMS
            ================================================================= */}
        {/* Petite Rosebud 1 (Lower Branch, ~72, 225) */}
        <g transform="translate(68, 222) rotate(-40)" filter="url(#petalShadow)">
          {/* Green Calyx Sepals */}
          <path d="M-8 8 C -4 -4, 0 -8, 2 -12 C 4 -8, 8 -4, 12 8 Z" fill="url(#oliveLeafGrad)" />
          {/* Blush Petal Tip */}
          <path d="M-4 -2 C -2 -14, 4 -16, 6 -6 C 5 2, -2 4, -4 -2 Z" fill="url(#blushPetalDeep)" />
          <path d="M0 -4 C 1 -12, 5 -13, 6 -6 Z" fill="url(#blushPetalSoft)" />
          {/* Calyx Embrace */}
          <path d="M-6 4 C -4 -6, -2 -10, -1 -8" stroke="#444B22" strokeWidth="1.2" fill="none" />
          <path d="M8 4 C 6 -6, 4 -10, 3 -8" stroke="#444B22" strokeWidth="1.2" fill="none" />
        </g>

        {/* Petite Rosebud 2 (Upper-Mid Branch, ~165, 78) */}
        <g transform="translate(162, 75) rotate(25)" filter="url(#petalShadow)">
          <path d="M-10 10 C -5 -6, 0 -10, 3 -16 C 6 -10, 11 -6, 15 10 Z" fill="url(#oliveLeafGrad)" />
          <path d="M-5 -2 C -3 -18, 5 -20, 8 -8 C 6 2, -3 5, -5 -2 Z" fill="url(#blushPetalDeep)" />
          <path d="M0 -6 C 2 -16, 6 -17, 8 -8 Z" fill="url(#blushPetalSoft)" />
        </g>

        {/* =================================================================
            LAYER 5: SECONDARY GARDEN ROSE (Mid-Corner, ~140, 150)
            ================================================================= */}
        <g transform="translate(142, 152) scale(0.92)" filter="url(#petalShadow)">
          {/* Outer Petals */}
          <path
            d="M0 -28 C 14 -34, 28 -24, 26 -10 C 24 2, 8 6, 0 -28 Z"
            fill="url(#ivoryPeonyGrad)"
            stroke="#F0D9DE"
            strokeWidth="0.6"
          />
          <path
            d="M24 -12 C 36 -6, 38 12, 24 22 C 12 18, 8 4, 24 -12 Z"
            fill="url(#blushPetalSoft)"
            stroke="#F0D9DE"
            strokeWidth="0.6"
          />
          <path
            d="M18 18 C 14 34, -8 36, -18 24 C -12 10, 4 8, 18 18 Z"
            fill="url(#ivoryPeonyGrad)"
            stroke="#F0D9DE"
            strokeWidth="0.6"
          />
          <path
            d="M-16 22 C -32 16, -34 -6, -20 -18 C -8 -8, -6 10, -16 22 Z"
            fill="url(#blushPetalSoft)"
            stroke="#F0D9DE"
            strokeWidth="0.6"
          />
          <path
            d="M-18 -16 C -14 -32, 6 -34, 14 -22 C 4 -10, -10 -8, -18 -16 Z"
            fill="url(#ivoryPeonyGrad)"
            stroke="#F0D9DE"
            strokeWidth="0.6"
          />

          {/* Inner Cup Petals */}
          <ellipse cx="0" cy="-6" rx="14" ry="10" transform="rotate(-15)" fill="url(#blushPetalDeep)" />
          <ellipse cx="8" cy="2" rx="12" ry="9" transform="rotate(35)" fill="url(#blushPetalSoft)" />
          <ellipse cx="-6" cy="4" rx="13" ry="9" transform="rotate(-40)" fill="url(#blushPetalDeep)" />

          {/* Rosette Core */}
          <circle cx="0" cy="0" r="9" fill="url(#roseCoreGlow)" />
          <circle cx="0" cy="0" r="5" fill="url(#roseCenterDark)" />
          <path d="M-3 -1 C -1 -4, 3 -4, 3 0 C 3 3, -1 3, -3 -1 Z" fill="#FFF2F4" opacity="0.9" />

          {/* Gold Stamen Accents */}
          <circle cx="-3" cy="-3" r="1.1" fill="#E8C762" />
          <circle cx="3" cy="-2" r="1.1" fill="#E8C762" />
          <circle cx="2" cy="3" r="1.1" fill="#E8C762" />
          <circle cx="-2" cy="2" r="1.1" fill="#E8C762" />
        </g>

        {/* =================================================================
            LAYER 6: PRIMARY MAGNIFICENT PEONY / ENGLISH GARDEN ROSE (~205, 95)
            ================================================================= */}
        <g transform="translate(202, 95)" filter="url(#petalShadow)">
          {/* Back Outer Petals (Base Skirt) */}
          <path
            d="M0 -42 C 22 -50, 44 -36, 40 -14 C 36 2, 12 8, 0 -42 Z"
            fill="url(#ivoryPeonyGrad)"
            stroke="#F5E4E8"
            strokeWidth="0.7"
          />
          <path
            d="M34 -20 C 52 -10, 56 18, 36 34 C 18 28, 12 8, 34 -20 Z"
            fill="url(#blushPetalSoft)"
            stroke="#F5E4E8"
            strokeWidth="0.7"
          />
          <path
            d="M28 26 C 22 50, -12 54, -28 36 C -18 16, 6 12, 28 26 Z"
            fill="url(#ivoryPeonyGrad)"
            stroke="#F5E4E8"
            strokeWidth="0.7"
          />
          <path
            d="M-24 32 C -48 24, -52 -8, -32 -26 C -12 -12, -8 14, -24 32 Z"
            fill="url(#blushPetalSoft)"
            stroke="#F5E4E8"
            strokeWidth="0.7"
          />
          <path
            d="M-28 -22 C -22 -46, 8 -50, 20 -32 C 6 -14, -14 -12, -28 -22 Z"
            fill="url(#ivoryPeonyGrad)"
            stroke="#F5E4E8"
            strokeWidth="0.7"
          />

          {/* Intermediate Layer Petals (Cupped Around Core) */}
          <path
            d="M-10 -30 C 12 -38, 30 -26, 26 -8 C 18 0, 0 -4, -10 -30 Z"
            fill="url(#blushPetalDeep)"
            stroke="#ECC5CE"
            strokeWidth="0.6"
          />
          <path
            d="M22 -12 C 36 -2, 38 20, 22 26 C 10 16, 6 2, 22 -12 Z"
            fill="url(#blushPetalSoft)"
            stroke="#ECC5CE"
            strokeWidth="0.6"
          />
          <path
            d="M16 18 C 8 34, -16 36, -24 20 C -12 8, 2 6, 16 18 Z"
            fill="url(#blushPetalDeep)"
            stroke="#ECC5CE"
            strokeWidth="0.6"
          />
          <path
            d="M-18 18 C -34 10, -34 -12, -18 -22 C -6 -8, -4 8, -18 18 Z"
            fill="url(#blushPetalSoft)"
            stroke="#ECC5CE"
            strokeWidth="0.6"
          />

          {/* Inner Swirl Petal Layers */}
          <ellipse cx="0" cy="-10" rx="18" ry="12" transform="rotate(-15)" fill="url(#blushPetalSoft)" />
          <ellipse cx="12" cy="0" rx="16" ry="11" transform="rotate(35)" fill="url(#blushPetalDeep)" />
          <ellipse cx="6" cy="12" rx="18" ry="12" transform="rotate(80)" fill="url(#blushPetalSoft)" />
          <ellipse cx="-10" cy="6" rx="16" ry="11" transform="rotate(-45)" fill="url(#blushPetalDeep)" />
          <ellipse cx="-10" cy="-8" rx="17" ry="11" transform="rotate(-85)" fill="url(#blushPetalSoft)" />

          {/* Rosette Heart Core */}
          <circle cx="0" cy="0" r="14" fill="url(#roseCoreGlow)" />
          <circle cx="0" cy="0" r="8" fill="url(#roseCenterDark)" />

          {/* Velvet Rosette Petal Folds */}
          <path
            d="M-5 -2 C -3 -7, 4 -7, 5 0 C 5 5, -2 6, -5 -2 Z"
            fill="#FFF5F7"
            opacity="0.95"
          />
          <path
            d="M-2 -3 C 0 -6, 3 -5, 3 -1 C 2 2, -1 2, -2 -3 Z"
            fill="#C94A65"
            opacity="0.8"
          />

          {/* Radiating Luxury Gold Filigree Stamens & Pearl Dots */}
          <g className="core-stamens" stroke="#E5C35E" strokeWidth="0.9" strokeLinecap="round">
            <line x1="0" y1="0" x2="-6" y2="-7" />
            <line x1="0" y1="0" x2="0" y2="-9" />
            <line x1="0" y1="0" x2="6" y2="-7" />
            <line x1="0" y1="0" x2="9" y2="-2" />
            <line x1="0" y1="0" x2="8" y2="5" />
            <line x1="0" y1="0" x2="3" y2="9" />
            <line x1="0" y1="0" x2="-4" y2="8" />
            <line x1="0" y1="0" x2="-8" y2="4" />
            <line x1="0" y1="0" x2="-9" y2="-2" />

            {/* Pearl Heads */}
            <circle cx="-6" cy="-7" r="1.4" fill="url(#goldBerryGrad)" stroke="none" />
            <circle cx="0" cy="-9" r="1.5" fill="url(#goldBerryGrad)" stroke="none" />
            <circle cx="6" cy="-7" r="1.4" fill="url(#goldBerryGrad)" stroke="none" />
            <circle cx="9" cy="-2" r="1.5" fill="url(#goldBerryGrad)" stroke="none" />
            <circle cx="8" cy="5" r="1.4" fill="url(#goldBerryGrad)" stroke="none" />
            <circle cx="3" cy="9" r="1.5" fill="url(#goldBerryGrad)" stroke="none" />
            <circle cx="-4" cy="8" r="1.4" fill="url(#goldBerryGrad)" stroke="none" />
            <circle cx="-8" cy="4" r="1.4" fill="url(#goldBerryGrad)" stroke="none" />
            <circle cx="-9" cy="-2" r="1.5" fill="url(#goldBerryGrad)" stroke="none" />
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
        viewBox="0 0 160 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        <defs>
          <linearGradient id="tallStemGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#3A401A" />
            <stop offset="50%" stopColor="#5E6732" />
            <stop offset="100%" stopColor="#87934E" />
          </linearGradient>
          <linearGradient id="tallSageGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C4DDD2" />
            <stop offset="60%" stopColor="#87B09F" />
            <stop offset="100%" stopColor="#4A7060" />
          </linearGradient>
          <linearGradient id="tallOliveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A3AC68" />
            <stop offset="60%" stopColor="#677038" />
            <stop offset="100%" stopColor="#3B421C" />
          </linearGradient>
          <radialGradient id="tallGoldBerry" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FFF9E0" />
            <stop offset="45%" stopColor="#E5C158" />
            <stop offset="100%" stopColor="#8C660B" />
          </radialGradient>
        </defs>

        {/* Tall Arching Stem */}
        <path
          d="M25 385 C 45 295, 68 185, 82 25"
          stroke="url(#tallStemGrad)"
          strokeWidth="2.6"
          strokeLinecap="round"
        />

        {/* Tier 1 (Base, ~320) */}
        <g transform="translate(42, 320)">
          <path d="M0 0 C -26 -18, -32 -46, -10 -60 C 5 -44, 4 -12, 0 0 Z" fill="url(#tallSageGrad)" />
          <path d="M0 0 C 26 -18, 44 -10, 34 16 C 18 20, 8 10, 0 0 Z" fill="url(#tallOliveGrad)" />
          <circle cx="2" cy="-10" r="3.2" fill="url(#tallGoldBerry)" />
        </g>

        {/* Tier 2 (~260) */}
        <g transform="translate(56, 260)">
          <path d="M0 0 C -30 -16, -34 -44, -12 -56 C 4 -40, 4 -10, 0 0 Z" fill="url(#tallSageGrad)" />
          <path d="M0 0 C 28 -16, 46 -8, 36 18 C 18 22, 6 12, 0 0 Z" fill="url(#tallOliveGrad)" />
          <circle cx="-4" cy="-12" r="3" fill="url(#tallGoldBerry)" />
          <circle cx="12" cy="-6" r="2.6" fill="url(#tallGoldBerry)" />
        </g>

        {/* Tier 3 (~200) */}
        <g transform="translate(68, 200)">
          <path d="M0 0 C -28 -14, -32 -40, -10 -50 C 4 -36, 4 -8, 0 0 Z" fill="url(#tallSageGrad)" />
          <path d="M0 0 C 26 -14, 42 -6, 32 16 C 16 20, 6 10, 0 0 Z" fill="url(#tallOliveGrad)" />
          <circle cx="0" cy="-8" r="3" fill="url(#tallGoldBerry)" />
        </g>

        {/* Tier 4 (~140) */}
        <g transform="translate(76, 140)">
          <path d="M0 0 C -24 -12, -28 -34, -8 -44 C 4 -30, 4 -6, 0 0 Z" fill="url(#tallSageGrad)" />
          <path d="M0 0 C 24 -12, 38 -4, 28 14 C 14 18, 4 8, 0 0 Z" fill="url(#tallOliveGrad)" />
          <circle cx="-6" cy="-8" r="2.8" fill="url(#tallGoldBerry)" />
        </g>

        {/* Tier 5 (~80) */}
        <g transform="translate(80, 80)">
          <path d="M0 0 C -20 -10, -22 -28, -6 -36 C 4 -24, 2 -4, 0 0 Z" fill="url(#tallSageGrad)" />
          <path d="M0 0 C 20 -10, 32 -2, 24 12 C 12 14, 4 6, 0 0 Z" fill="url(#tallOliveGrad)" />
        </g>

        {/* Terminal Crown (~25) */}
        <g transform="translate(82, 25)">
          <path d="M0 0 C -12 -18, 8 -26, 18 -10 C 16 4, 8 6, 0 0 Z" fill="url(#tallSageGrad)" />
          <circle cx="6" cy="-8" r="2.5" fill="url(#tallGoldBerry)" />
        </g>
      </svg>
    </div>
  )
}

export function CardCornerBotanical({ className = '', style = {} }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`card-corner-botanical ${className}`}
      style={style}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="cardCornerStem" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4A5228" />
          <stop offset="100%" stopColor="#7E8850" />
        </linearGradient>
        <linearGradient id="cardCornerSage" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C4DDD2" />
          <stop offset="100%" stopColor="#547A6A" />
        </linearGradient>
        <linearGradient id="cardCornerOlive" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A3AC68" />
          <stop offset="100%" stopColor="#3E4420" />
        </linearGradient>
        <radialGradient id="cardCornerGold" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#FFF9E0" />
          <stop offset="50%" stopColor="#E5C158" />
          <stop offset="100%" stopColor="#8C660B" />
        </radialGradient>
      </defs>

      {/* Curved Branch */}
      <path
        d="M10 70 C 26 50, 48 32, 70 10"
        stroke="url(#cardCornerStem)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      {/* Leaf Pair 1 */}
      <path d="M28 56 C 18 50, 22 40, 32 42 C 31 48, 29 53, 28 56 Z" fill="url(#cardCornerSage)" />
      <path d="M36 48 C 44 40, 52 46, 46 54 C 40 53, 37 50, 36 48 Z" fill="url(#cardCornerOlive)" />
      <circle cx="32" cy="50" r="2.2" fill="url(#cardCornerGold)" />

      {/* Leaf Pair 2 */}
      <path d="M48 34 C 38 26, 42 16, 52 18 C 51 24, 49 30, 48 34 Z" fill="url(#cardCornerSage)" />
      <path d="M56 26 C 64 18, 72 24, 66 32 C 60 31, 57 28, 56 26 Z" fill="url(#cardCornerOlive)" />
      <circle cx="52" cy="28" r="2" fill="url(#cardCornerGold)" />

      {/* Terminal bud */}
      <circle cx="68" cy="12" r="2.4" fill="url(#cardCornerGold)" />
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


