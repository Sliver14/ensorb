import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Official Wedding Invitation & Guest Pass | Ngozi & Sorbari',
  description:
    'You are cordially invited to celebrate the holy matrimony of Ngozi Emele Kalu and Sorbari Godwin Uebari. Register your attendance and access your official digital wedding pass.',
}

export default function InviteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
