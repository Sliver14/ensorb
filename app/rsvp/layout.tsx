import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'RSVP & Digital Wedding Pass',
  description:
    'Confirm your attendance for the wedding celebration of Ngozi & Sorbari on Saturday, November 21, 2026. Register your seat and generate your personalized digital guest entry pass instantly.',
  alternates: {
    canonical: '/rsvp',
  },
  openGraph: {
    title: 'RSVP & Digital Wedding Pass | Ngozi & Sorbari',
    description:
      'Confirm attendance and download your instant personalized digital pass for entry at Christ Embassy Ogba 1, Lagos.',
    url: '/rsvp',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Ngozi & Sorbari Wedding RSVP & Pass',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RSVP & Digital Wedding Pass | Ngozi & Sorbari',
    description:
      'Confirm attendance and download your instant personalized digital pass for entry at Christ Embassy Ogba 1, Lagos.',
  },
}

export default function RsvpLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
