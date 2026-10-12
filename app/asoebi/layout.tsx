import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Order Your Asoebi | Ngozi & Sorbari Wedding',
  description:
    'Celebrate with us in elegance! Order your official blush-mauve wedding asoebi for Ngozi & Sorbari’s wedding celebration on November 21, 2026.',
  alternates: {
    canonical: '/asoebi',
  },
  openGraph: {
    title: 'Order Your Asoebi | Ngozi & Sorbari Wedding',
    description:
      'Celebrate with us in elegance! Order your official blush-mauve wedding asoebi for Ngozi & Sorbari’s wedding celebration on November 21, 2026.',
    url: '/asoebi',
    images: [
      {
        url: '/wedding-asoebi.jpeg',
        width: 1200,
        height: 630,
        alt: 'Ngozi & Sorbari Official Wedding Asoebi',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Order Your Asoebi | Ngozi & Sorbari Wedding',
    description:
      'Celebrate with us in elegance! Order your official blush-mauve wedding asoebi for Ngozi & Sorbari’s wedding celebration.',
    images: ['/wedding-asoebi.jpeg'],
  },
}

export default function AsoebiLayout({ children }: { children: React.ReactNode }) {
  return children
}
