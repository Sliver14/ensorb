import { promises as fs } from 'fs'
import path from 'path'
import { Invite, CreateInviteInput, RegisterInviteInput, AdminStats } from './types'

const DATA_DIR = path.join(process.cwd(), 'data')
const DATA_FILE = path.join(DATA_DIR, 'invites.json')

// In-memory cache for fast reads
let invitesCache: Invite[] | null = null

// Curated list of beautifully named tables for automatic rotation
export const WEDDING_TABLES = [
  'Table 01 - Emerald VIP',
  'Table 02 - Royal Gold',
  'Table 03 - Sapphire',
  'Table 04 - Ruby VIP',
  'Table 05 - Diamond',
  'Table 06 - Pearl',
  'Table 07 - Crystal',
  'Table 08 - Opal',
  'Table 09 - Velvet Wine',
  'Table 10 - Champagne',
  'Table 11 - Rose Gold',
  'Table 12 - Ivory Grand',
]

export function getAutoAssignedTable(indexOffset: number = 0): string {
  return WEDDING_TABLES[Math.abs(indexOffset) % WEDDING_TABLES.length]
}

// Initial seed data so the dashboard is immediately functional on first launch
const INITIAL_INVITES: Invite[] = [
  {
    id: 'inv-seed-001',
    code: 'NS-VIP-001',
    targetName: 'Chief & Mrs. Emeka Kalu',
    maxGuests: 2,
    tableNumber: 'Table 01 - Emerald VIP',
    category: 'VIP',
    customNote: 'Bridal Family Honor Guest',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    isRegistered: true,
    registeredAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    guestName: 'Chief Emeka & Lolo Kalu',
    guestEmail: 'emeka.kalu@example.com',
    guestPhone: '+234 802 345 6789',
    attendance: 'attending',
    actualGuestCount: 2,
    guestPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
    dietaryOrNotes: 'No seafood please. Warmest congratulations to Ngozi & Sorbari!',
    passId: 'PASS-NS-2026-001',
    emailSent: true,
    emailSentAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    checkedIn: false,
  },
  {
    id: 'inv-seed-002',
    code: 'NS-FAM-002',
    targetName: 'Pastor & Mrs. Godwin Uebari',
    maxGuests: 2,
    tableNumber: 'Table 02 - Royal Gold',
    category: 'Family',
    customNote: 'Groom Parents & Family Table',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    isRegistered: true,
    registeredAt: new Date(Date.now() - 86400000).toISOString(),
    guestName: 'Pastor Godwin & Deaconess Uebari',
    guestEmail: 'pastor.uebari@example.com',
    guestPhone: '+234 803 456 7890',
    attendance: 'attending',
    actualGuestCount: 2,
    guestPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
    dietaryOrNotes: 'Special VIP blessings for our children.',
    passId: 'PASS-NS-2026-002',
    emailSent: true,
    emailSentAt: new Date(Date.now() - 86400000).toISOString(),
    checkedIn: true,
    checkedInAt: new Date().toISOString(),
  },
  {
    id: 'inv-seed-003',
    code: 'NS-7X82',
    targetName: '',
    maxGuests: 2,
    tableNumber: 'Table 03 - Sapphire',
    category: 'Friends',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    isRegistered: false,
    checkedIn: false,
  },
  {
    id: 'inv-seed-004',
    code: 'NS-4K9P',
    targetName: '',
    maxGuests: 2,
    tableNumber: 'Table 04 - Ruby VIP',
    category: 'VIP',
    createdAt: new Date().toISOString(),
    isRegistered: false,
    checkedIn: false,
  },
]

// Generate a random clean alphanumeric code (e.g. NS-7K4X)
export function generateInviteCode(prefix: string = 'NS'): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let result = ''
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  const cleanPrefix = prefix.replace(/[^a-zA-Z0-9]/g, '').toUpperCase() || 'NS'
  return `${cleanPrefix}-${result}`
}

// Generate unique pass ID
export function generatePassId(): string {
  const num = Math.floor(1000 + Math.random() * 9000)
  return `PASS-NS-2026-${num}`
}

// Ensure data directory and file exist
async function ensureDataFile(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
    try {
      await fs.access(DATA_FILE)
    } catch {
      await fs.writeFile(DATA_FILE, JSON.stringify(INITIAL_INVITES, null, 2), 'utf-8')
      invitesCache = [...INITIAL_INVITES]
    }
  } catch (err) {
    console.error('Error initializing data directory:', err)
  }
}

// Load all invites
export async function getAllInvites(): Promise<Invite[]> {
  if (invitesCache) {
    return invitesCache
  }
  await ensureDataFile()
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8')
    invitesCache = JSON.parse(raw) as Invite[]
    return invitesCache
  } catch (err) {
    console.error('Error reading invites file:', err)
    invitesCache = [...INITIAL_INVITES]
    return invitesCache
  }
}

// Save all invites to disk and update cache
async function saveAllInvites(invites: Invite[]): Promise<void> {
  invitesCache = invites
  await ensureDataFile()
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(invites, null, 2), 'utf-8')
  } catch (err) {
    console.error('Error writing invites file:', err)
  }
}

// Find single invite by unique code (case-insensitive)
export async function getInviteByCode(code: string): Promise<Invite | null> {
  if (!code) return null
  const invites = await getAllInvites()
  const normalized = code.trim().toUpperCase()
  return invites.find((inv) => inv.code.toUpperCase() === normalized) || null
}

// Create single bare or customized invite (table number is auto-generated if not specified)
export async function createInvite(input: CreateInviteInput = {}): Promise<Invite> {
  const invites = await getAllInvites()

  let code = input.customCode ? input.customCode.trim().toUpperCase() : ''
  if (!code) {
    let attempts = 0
    do {
      code = generateInviteCode(input.category === 'VIP' ? 'NS-VIP' : 'NS')
      attempts++
    } while (invites.some((inv) => inv.code.toUpperCase() === code) && attempts < 10)
  }

  // Ensure uniqueness
  if (invites.some((inv) => inv.code.toUpperCase() === code)) {
    code = `${code}-${Math.floor(10 + Math.random() * 90)}`
  }

  // Auto-assign table if not provided
  const tableNumber =
    input.tableNumber?.trim() || getAutoAssignedTable(invites.length)

  const newInvite: Invite = {
    id: `inv-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    code,
    targetName: input.targetName?.trim() || '',
    maxGuests: Number(input.maxGuests) || 2,
    tableNumber,
    category: input.category || 'General',
    customNote: input.customNote?.trim() || '',
    createdAt: new Date().toISOString(),
    isRegistered: false,
    checkedIn: false,
  }

  invites.unshift(newInvite)
  await saveAllInvites(invites)
  return newInvite
}

// Generate multiple bare invite links instantly with automatically rotating table numbers
export async function generateBareInvites(
  count: number = 1,
  defaults: {
    maxGuests?: number
    tableNumber?: string
    category?: 'VIP' | 'Family' | 'Friends' | 'Colleagues' | 'General'
  } = {}
): Promise<Invite[]> {
  const invites = await getAllInvites()
  const safeCount = Math.max(1, Math.min(count, 50))
  const created: Invite[] = []

  for (let i = 0; i < safeCount; i++) {
    const tableNumber =
      defaults.tableNumber?.trim() ||
      getAutoAssignedTable(invites.length + i)

    let code = generateInviteCode(defaults.category === 'VIP' ? 'NS-VIP' : 'NS')
    while (
      invites.some((inv) => inv.code.toUpperCase() === code) ||
      created.some((inv) => inv.code.toUpperCase() === code)
    ) {
      code = `${code}-${Math.floor(10 + Math.random() * 90)}`
    }

    const newInv: Invite = {
      id: `inv-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 7)}`,
      code,
      targetName: '',
      maxGuests: Number(defaults.maxGuests) || 2,
      tableNumber,
      category: defaults.category || 'General',
      createdAt: new Date().toISOString(),
      isRegistered: false,
      checkedIn: false,
    }

    created.push(newInv)
  }

  const updatedInvites = [...created, ...invites]
  await saveAllInvites(updatedInvites)
  return created
}

// Batch create invites from a list of names
export async function batchCreateInvites(
  names: string[],
  defaults: {
    maxGuests?: number
    tableNumber?: string
    category?: 'VIP' | 'Family' | 'Friends' | 'Colleagues' | 'General'
  }
): Promise<Invite[]> {
  const created: Invite[] = []
  for (let i = 0; i < names.length; i++) {
    const rawName = names[i]
    const trimmed = rawName.trim()
    if (!trimmed) continue

    const autoTable = defaults.tableNumber || getAutoAssignedTable(i)
    const inv = await createInvite({
      targetName: trimmed,
      maxGuests: defaults.maxGuests || 2,
      tableNumber: autoTable,
      category: defaults.category || 'General',
    })
    created.push(inv)
  }
  return created
}

// Register an invite (LOCKS IT from registering another person)
export async function registerInvite(
  code: string,
  registration: RegisterInviteInput
): Promise<{ success: boolean; invite?: Invite; error?: string }> {
  const invites = await getAllInvites()
  const normalized = code.trim().toUpperCase()
  const index = invites.findIndex((inv) => inv.code.toUpperCase() === normalized)

  if (index === -1) {
    return { success: false, error: 'Invitation not found or invalid code.' }
  }

  const existing = invites[index]

  // If already registered, don't allow overwriting with another person
  if (existing.isRegistered) {
    return {
      success: false,
      error: 'This invitation has already been registered and cannot be used for a new person.',
      invite: existing,
    }
  }

  const passId = generatePassId()
  const now = new Date().toISOString()

  const updated: Invite = {
    ...existing,
    isRegistered: true,
    registeredAt: now,
    targetName: existing.targetName || registration.guestName.trim(),
    guestName: registration.guestName.trim(),
    guestEmail: registration.guestEmail.trim(),
    guestPhone: registration.guestPhone.trim(),
    attendance: registration.attendance,
    actualGuestCount: Math.min(
      Number(registration.actualGuestCount) || 1,
      existing.maxGuests
    ),
    guestPhoto: registration.guestPhoto || '',
    dietaryOrNotes: registration.dietaryOrNotes?.trim() || '',
    passId,
    emailSent: true,
    emailSentAt: now,
  }

  invites[index] = updated
  await saveAllInvites(invites)
  return { success: true, invite: updated }
}

// Update invite (admin editing table, note, max guests)
export async function updateInvite(
  code: string,
  updates: Partial<Invite>
): Promise<Invite | null> {
  const invites = await getAllInvites()
  const normalized = code.trim().toUpperCase()
  const index = invites.findIndex((inv) => inv.code.toUpperCase() === normalized)

  if (index === -1) return null

  const current = invites[index]
  const updated: Invite = {
    ...current,
    ...updates,
    id: current.id,
    code: current.code,
  }

  invites[index] = updated
  await saveAllInvites(invites)
  return updated
}

// Delete invite
export async function deleteInvite(code: string): Promise<boolean> {
  const invites = await getAllInvites()
  const normalized = code.trim().toUpperCase()
  const initialLength = invites.length
  const filtered = invites.filter((inv) => inv.code.toUpperCase() !== normalized)

  if (filtered.length !== initialLength) {
    await saveAllInvites(filtered)
    return true
  }
  return false
}

// Resend email record tracker
export async function recordEmailResend(code: string): Promise<Invite | null> {
  const invites = await getAllInvites()
  const normalized = code.trim().toUpperCase()
  const index = invites.findIndex((inv) => inv.code.toUpperCase() === normalized)

  if (index === -1) return null

  const current = invites[index]
  const updated: Invite = {
    ...current,
    emailSent: true,
    emailSentAt: new Date().toISOString(),
  }

  invites[index] = updated
  await saveAllInvites(invites)
  return updated
}

// Toggle door check-in
export async function toggleCheckIn(code: string): Promise<Invite | null> {
  const invites = await getAllInvites()
  const normalized = code.trim().toUpperCase()
  const index = invites.findIndex((inv) => inv.code.toUpperCase() === normalized)

  if (index === -1) return null

  const current = invites[index]
  const nextCheckedIn = !current.checkedIn
  const updated: Invite = {
    ...current,
    checkedIn: nextCheckedIn,
    checkedInAt: nextCheckedIn ? new Date().toISOString() : undefined,
  }

  invites[index] = updated
  await saveAllInvites(invites)
  return updated
}

// Calculate Admin Stats
export async function getAdminStats(): Promise<AdminStats> {
  const invites = await getAllInvites()

  let registeredCount = 0
  let pendingCount = 0
  let attendingCount = 0
  let declinedCount = 0
  let totalSeatsAllocated = 0
  let totalGuestsAttending = 0
  let checkedInCount = 0

  for (const inv of invites) {
    totalSeatsAllocated += inv.maxGuests || 1

    if (inv.isRegistered) {
      registeredCount++
      if (inv.attendance === 'attending') {
        attendingCount++
        totalGuestsAttending += inv.actualGuestCount || inv.maxGuests || 1
      } else {
        declinedCount++
      }
      if (inv.checkedIn) {
        checkedInCount++
      }
    } else {
      pendingCount++
    }
  }

  return {
    totalInvites: invites.length,
    registeredCount,
    pendingCount,
    attendingCount,
    declinedCount,
    totalSeatsAllocated,
    totalGuestsAttending,
    checkedInCount,
  }
}
