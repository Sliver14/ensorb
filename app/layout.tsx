import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Great_Vibes, Montserrat } from 'next/font/google'
import { WelcomeGate } from '@/components/WelcomeGate'
import { ScrollAnimationProvider } from '@/components/ScrollAnimationProvider'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
})

const greatVibes = Great_Vibes({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-script',
  display: 'swap',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ensorb.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Ngozi & Sorbari — Our Wedding Celebration | November 21, 2026',
    template: '%s | Ngozi & Sorbari Wedding',
  },
  description:
    'Join Ngozi and Sorbari in celebrating their holy matrimony and wedding celebration on Saturday, November 21, 2026 at Christ Embassy Ogba 1, Lagos, Nigeria. Explore our love story, event schedule, dress color code palette, gift registry, and RSVP for your digital wedding pass.',
  applicationName: 'ENSORB Wedding Portal',
  authors: [{ name: 'Ngozi & Sorbari', url: siteUrl }],
  generator: 'Next.js',
  keywords: [
    'Ngozi and Sorbari',
    'Ngozi & Sorbari',
    'ENSORB',
    'ENSORB 2026',
    'Nigerian Wedding Lagos',
    'Christ Embassy Ogba 1 Wedding',
    'Wedding Celebration November 21 2026',
    'Wedding Dress Color Code',
    'Burgundy Blush Mint Olive Wedding Palette',
    'Wedding Gift Registry Lagos',
    'Digital Wedding Pass RSVP',
    'Holy Matrimony Lagos Nigeria',
  ],
  creator: 'Ngozi & Sorbari',
  publisher: 'ENSORB Wedding Celebration',
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: siteUrl,
    siteName: 'Ngozi & Sorbari Wedding — ENSORB',
    title: 'Ngozi & Sorbari — Our Wedding Celebration | November 21, 2026',
    description:
      'Join Ngozi and Sorbari for their wedding celebration at Christ Embassy Ogba 1, Lagos, Nigeria. Explore event schedule, dress code palette, gift registry & RSVP for your digital pass.',
    images: [
      {
        url: '/couple/hero-portrait.png',
        width: 1200,
        height: 630,
        alt: 'Ngozi & Sorbari Wedding Celebration — November 21, 2026',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ngozi & Sorbari — Our Wedding Celebration | November 21, 2026',
    description:
      'Join Ngozi and Sorbari for their wedding celebration on Saturday, November 21, 2026 at Christ Embassy Ogba 1, Lagos, Nigeria.',
    images: ['/couple/hero-portrait.png'],
    creator: '@ensorb_wedding',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      {
        url: '/logo.png',
        type: 'image/png',
      },
      {
        url: '/logo.png',
        sizes: 'any',
      },
    ],
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  category: 'Event',
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#e8e6e1' },
    { media: '(prefers-color-scheme: dark)', color: '#191919' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: 'Ngozi & Sorbari Wedding Celebration',
    alternateName: 'ENSORB 2026',
    description:
      'The holy matrimony and wedding celebration of Ngozi and Sorbari taking place on Saturday, November 21, 2026 at Christ Embassy Ogba 1, Lagos, Nigeria.',
    startDate: '2026-11-21T11:00:00+01:00',
    endDate: '2026-11-21T20:00:00+01:00',
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: 'Christ Embassy Ogba 1',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '3 Ogunnusi Rd, Aguda, Ojodu',
        addressLocality: 'Ojodu / Ikeja',
        addressRegion: 'Lagos',
        postalCode: '101233',
        addressCountry: 'NG',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: '6.6212',
        longitude: '3.3411',
      },
    },
    image: [`${siteUrl}/logo.png`],
    organizer: {
      '@type': 'Person',
      name: 'Ngozi & Sorbari',
      url: siteUrl,
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'NGN',
      availability: 'https://schema.org/InStock',
      url: `${siteUrl}/rsvp`,
      validFrom: '2026-01-01T00:00:00+01:00',
    },
  }

  return (
    <html lang="en" className={`${cormorant.variable} ${greatVibes.variable} ${montserrat.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">
        <WelcomeGate />
        <ScrollAnimationProvider>{children}</ScrollAnimationProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

