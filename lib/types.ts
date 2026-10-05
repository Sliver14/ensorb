export interface Invite {
  id: string
  code: string
  targetName?: string
  maxGuests: number
  tableNumber: string
  category: 'VIP' | 'Family' | 'Friends' | 'Colleagues' | 'General'
  customNote?: string
  createdAt: string
  source?: 'rsvp_form' | 'admin_link' | 'admin_direct'

  // Approval state
  approvalStatus?: 'approved' | 'pending' | 'declined'
  declineReason?: string
  approvedAt?: string

  // Registration state
  isRegistered: boolean
  registeredAt?: string

  // Registered guest details (filled by the guest)
  guestName?: string
  guestEmail?: string
  guestPhone?: string
  attendance?: 'attending' | 'declined'
  actualGuestCount?: number
  guestPhoto?: string
  dietaryOrNotes?: string

  // Access Card / Pass details
  passId?: string
  accessCode?: string // e.g. NXYS26001G
  emailSent?: boolean
  emailSentAt?: string
  inviteEmailSent?: boolean
  inviteEmailSentAt?: string
  checkedIn?: boolean
  checkedInAt?: string
}

export interface CreateInviteInput {
  targetName?: string
  targetEmail?: string
  maxGuests?: number
  tableNumber?: string
  category?: 'VIP' | 'Family' | 'Friends' | 'Colleagues' | 'General'
  customNote?: string
  customCode?: string
  count?: number // for generating multiple bare links
  source?: 'rsvp_form' | 'admin_link' | 'admin_direct'
  sendEmailNow?: boolean
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

export interface ApproveInviteInput {
  tableNumber?: string
  maxGuests?: number
  category?: 'VIP' | 'Family' | 'Friends' | 'Colleagues' | 'General'
  sendAccessCardEmail?: boolean
}

export interface AdminStats {
  totalInvites: number
  registeredCount: number
  pendingCount: number
  approvedCount: number
  attendingCount: number
  declinedCount: number
  totalSeatsAllocated: number
  totalGuestsAttending: number
  checkedInCount: number
}
