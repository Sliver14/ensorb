import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Our Love Story | Ngozi & Sorbari',
  description:
    'God begins writing a story long before we realise it is ours to tell. From serving together in Campus Ministry to reconnecting in Lagos. A simple friendship blossomed into a lifelong journey of faith and love.',
  alternates: {
    canonical: '/story',
  },
  openGraph: {
    title: 'Our Love Story | Ngozi & Sorbari Wedding',
    description:
      'From church brethren to life partners, we can truly say that God was writing our love story all along. Read the journey of Ngozi & Sorbari.',
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
    title: 'Our Love Story | Ngozi & Sorbari Wedding',
    description:
      'From church brethren to life partners, we can truly say that God was writing our love story all along. Read the journey of Ngozi & Sorbari.',
  },
}

export default function StoryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
