import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Our Love Story & Timeline',
  description:
    'From a warm coffee date to stepping into forever. Discover how Ngozi and Sorbari met, their journey of love, the proposal, and view engagement photographs.',
  alternates: {
    canonical: '/story',
  },
  openGraph: {
    title: 'Our Love Story & Timeline | Ngozi & Sorbari',
    description:
      'A coffee date that became forever. Discover how Ngozi and Sorbari met and read their love story milestones.',
    url: '/story',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Ngozi & Sorbari Love Story',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Our Love Story & Timeline | Ngozi & Sorbari',
    description:
      'A coffee date that became forever. Discover how Ngozi and Sorbari met and read their love story milestones.',
  },
}

export default function StoryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
