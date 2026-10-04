import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Wedding Admin & Invites Dashboard | Ngozi & Sorbari',
  description:
    'Couple & Admin portal to manage wedding invites, generate unique links, monitor RSVPs, check-in guests, and dispatch digital pass cards.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
