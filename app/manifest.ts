import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Ngozi & Sorbari Wedding Celebration — ENSORB 2026',
    short_name: 'ENSORB 2026',
    description:
      'Official wedding portal for the celebration of Ngozi and Sorbari on November 21, 2026 at Christ Embassy Ogba 1, Lagos, Nigeria.',
    start_url: '/',
    display: 'standalone',
    background_color: '#e8e6e1',
    theme_color: '#6B1D2F',
    icons: [
      {
        src: '/logo.png',
        sizes: 'any',
        type: 'image/png',
      },
    ],
  }
}
