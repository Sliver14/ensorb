import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Wedding Details, Schedule & Dress Color Code',
  description:
    'Complete program of events, venue directions to Christ Embassy Ogba 1 in Lagos, official wedding dress color code palette (Burgundy, Blush, Mint Green, Olive Green), and guest accommodation recommendations.',
  alternates: {
    canonical: '/details',
  },
  openGraph: {
    title: 'Schedule & Dress Color Code | Ngozi & Sorbari Wedding',
    description:
      'Explore the official wedding program, venue details, and dress color code with HEX & RGB values for tailoring.',
    url: '/details',
    images: [
      {
        url: '/logo-fav.jpeg',
        width: 1200,
        height: 630,
        alt: 'Ngozi & Sorbari Wedding Details & Dress Code',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wedding Details & Dress Color Code | Ngozi & Sorbari',
    description:
      'Explore the official wedding program, venue details, and dress color code with HEX & RGB values for tailoring.',
  },
}

export default function DetailsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
