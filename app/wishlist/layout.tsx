import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Wedding Wishlist & Contributions | Ngozi & Sorbari',
  description:
    'Explore our curated wedding wishlist and contribute towards home essentials, or bless Ngozi & Sorbari with monetary gifts toward their new beginning.',
  alternates: {
    canonical: '/wishlist',
  },
  openGraph: {
    title: 'Wedding Wishlist & Contributions | Ngozi & Sorbari',
    description:
      'Curated wedding wishlist with progress tracking, item contributions, and direct wedding account transfer details.',
    url: '/wishlist',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Ngozi & Sorbari Wedding Wishlist',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wedding Wishlist & Contributions | Ngozi & Sorbari',
    description:
      'Curated wedding wishlist with progress tracking, item contributions, and direct wedding account transfer details.',
  },
}

export default function WishlistLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
