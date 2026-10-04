import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Wedding Gift Registry & Cash Blessings',
  description:
    'Explore our curated wedding registry wishlist of home essentials and kitchen appliances, or bless Ngozi & Sorbari with monetary cash gifts toward their new beginning.',
  alternates: {
    canonical: '/gifts',
  },
  openGraph: {
    title: 'Wedding Gift Registry & Cash Blessings | Ngozi & Sorbari',
    description:
      'Curated home wishlist and direct wedding account transfer details for cash blessings.',
    url: '/gifts',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Ngozi & Sorbari Wedding Gift Registry',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wedding Gift Registry & Cash Blessings | Ngozi & Sorbari',
    description:
      'Curated home wishlist and direct wedding account transfer details for cash blessings.',
  },
}

export default function GiftsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
