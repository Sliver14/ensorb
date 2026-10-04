export interface Invite {
  id: string
  code: string
  targetName?: string
  maxGuests: number
  tableNumber: string
  category: 'VIP' | 'Family' | 'Friends' | 'Colleagues' | 'General'
  customNote?: string
  createdAt: string

  // Registration state
  isRegistered: boolean
  registeredAt?: string

  // Registered guest details (filled by the guest upon receiving the invite link)
  guestName?: string
  guestEmail?: string
  guestPhone?: string
  attendance?: 'attending' | 'declined'
  actualGuestCount?: number
  guestPhoto?: string
  dietaryOrNotes?: string

  // Pass & Entrance details
  passId?: string
  emailSent?: boolean
  emailSentAt?: string
  checkedIn?: boolean
  checkedInAt?: string
}

export interface CreateInviteInput {
  targetName?: string
  maxGuests?: number
  tableNumber?: string
  category?: 'VIP' | 'Family' | 'Friends' | 'Colleagues' | 'General'
  customNote?: string
  customCode?: string
  count?: number // for generating multiple bare links
}

export interface RegisterInviteInput {
  guestName: string
  guestEmail: string
  guestPhone: string
  attendance: 'attending' | 'declined'
  actualGuestCount: number
  guestPhoto?: string
  dietaryOrNotes?: string
}

export interface AdminStats {
  totalInvites: number
  registeredCount: number
  pendingCount: number
  attendingCount: number
  declinedCount: number
  totalSeatsAllocated: number
  totalGuestsAttending: number
  checkedInCount: number
}
