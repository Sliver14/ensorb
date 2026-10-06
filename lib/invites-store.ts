import { promises as fs } from 'fs'
import path from 'path'
import {
  Invite,
  CreateInviteInput,
  RegisterInviteInput,
  ApproveInviteInput,
  AdminStats,
} from './types'
import { getDb, ensureAllTables, INITIAL_SEED_INVITES } from './db'
import { sendWeddingPassEmail, sendUniqueInviteEmail } from './email'

const DATA_DIR = path.join(process.cwd(), 'data')
const DATA_FILE = path.join(DATA_DIR, 'invites.json')

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

// Generate a random clean alphanumeric invite code (e.g. NS-7K4X or NS-VIP-102)
export function generateInviteCode(prefix: string = 'NS'): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let result = ''
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  const cleanPrefix = prefix.replace(/[^a-zA-Z0-9]/g, '').toUpperCase() || 'NS'
  return `${cleanPrefix}-${result}`
}

// Generate unique luxury access code (e.g. NXYS26001G)
export function generateAccessCode(): string {
  const num = Math.floor(1000 + Math.random() * 9000)
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
  const suffix = letters.charAt(Math.floor(Math.random() * letters.length))
  return `NXYS26${num}${suffix}`
}

// Generate unique pass ID
export function generatePassId(): string {
  const num = Math.floor(1000 + Math.random() * 9000)
  return `PASS-NS-2026-${num}`
}

// Map database row (snake_case) to TypeScript Invite (camelCase)
function mapRowToInvite(row: any): Invite {
  return {
    id: row.id,
    code: row.code,
    accessCode: row.access_code || row.accessCode || undefined,
    targetName: row.target_name || row.targetName || undefined,
    targetEmail: row.target_email || row.targetEmail || undefined,
    maxGuests: Number(row.max_guests ?? row.maxGuests ?? 1),
    tableNumber: row.table_number || row.tableNumber || 'Table 01 - Emerald VIP',
    category: row.category || 'General',
    customNote: row.custom_note || row.customNote || undefined,
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
    source: row.source || 'rsvp_form',
    approvalStatus: row.approval_status || row.approvalStatus || 'pending',
    declineReason: row.decline_reason || row.declineReason || undefined,
    approvedAt: row.approved_at ? new Date(row.approved_at).toISOString() : undefined,
    isRegistered: Boolean(row.is_registered ?? row.isRegistered ?? false),
    registeredAt: row.registered_at ? new Date(row.registered_at).toISOString() : undefined,
    guestName: row.guest_name || row.guestName || undefined,
    guestEmail: row.guest_email || row.guestEmail || undefined,
    guestPhone: row.guest_phone || row.guestPhone || undefined,
    attendance: row.attendance || 'attending',
    actualGuestCount: Number(row.actual_guest_count ?? row.actualGuestCount ?? 1),
    guestPhoto: row.guest_photo || row.guestPhoto || undefined,
    dietaryOrNotes: row.dietary_or_notes || row.dietaryOrNotes || undefined,
    passId: row.pass_id || row.passId || undefined,
    emailSent: Boolean(row.email_sent ?? row.emailSent ?? false),
    emailSentAt: row.email_sent_at ? new Date(row.email_sent_at).toISOString() : undefined,
    inviteEmailSent: Boolean(row.invite_email_sent ?? row.inviteEmailSent ?? false),
    inviteEmailSentAt: row.invite_email_sent_at ? new Date(row.invite_email_sent_at).toISOString() : undefined,
  }
}

// File fallback storage helpers
async function getLocalInvites(): Promise<Invite[]> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
    const data = await fs.readFile(DATA_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    const initial = INITIAL_SEED_INVITES.map((inv) => ({
      ...inv,
      maxGuests: inv.maxGuests || 1,
      tableNumber: inv.tableNumber || 'Table 01 - Emerald VIP',
      category: (inv.category as any) || 'General',
      isRegistered: !!inv.isRegistered,
      createdAt: new Date().toISOString(),
    })) as Invite[]
    await fs.writeFile(DATA_FILE, JSON.stringify(initial, null, 2), 'utf-8')
    return initial
  }
}

async function saveLocalInvites(invites: Invite[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true })
  await fs.writeFile(DATA_FILE, JSON.stringify(invites, null, 2), 'utf-8')
}

// ----------------------------------------------------------------------------
// Public Database API Methods
// ----------------------------------------------------------------------------

export async function getAllInvites(): Promise<Invite[]> {
  const sql = getDb()
  if (sql) {
    try {
      await ensureAllTables()
      const rows = await sql`
        SELECT * FROM invites
        ORDER BY created_at DESC;
      `
      return rows.map(mapRowToInvite)
    } catch (err) {
      console.error('Error fetching invites from Postgres DB:', err)
    }
  }

  return getLocalInvites()
}

export async function getInviteByCode(codeOrId: string): Promise<Invite | null> {
  if (!codeOrId) return null
  const clean = codeOrId.trim()

  const sql = getDb()
  if (sql) {
    try {
      await ensureAllTables()
      const rows = await sql`
        SELECT * FROM invites 
        WHERE LOWER(code) = LOWER(${clean}) 
           OR LOWER(id) = LOWER(${clean})
           OR LOWER(access_code) = LOWER(${clean})
        LIMIT 1;
      `
      if (rows && rows.length > 0) {
        return mapRowToInvite(rows[0])
      }
      return null
    } catch (err) {
      console.error('Error fetching invite by code from Postgres DB:', err)
    }
  }

  const invites = await getLocalInvites()
  const found = invites.find(
    (inv) =>
      inv.code.toLowerCase() === clean.toLowerCase() ||
      inv.id.toLowerCase() === clean.toLowerCase() ||
      (inv.accessCode && inv.accessCode.toLowerCase() === clean.toLowerCase())
  )
  return found || null
}

export async function createInvite(input: CreateInviteInput): Promise<Invite> {
  const id = `inv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
  const code = input.customCode?.trim().toUpperCase() || generateInviteCode(input.category === 'VIP' ? 'NS-VIP' : 'NS')
  const accessCode = generateAccessCode()
  const passId = generatePassId()
  const maxGuests = input.maxGuests || 1
  const category = input.category || 'General'
  const source = input.source || 'admin_direct'
  const customNote = input.customNote || ''
  const targetName = input.targetName || ''
  const targetEmail = input.targetEmail || ''
  const tableNumber = input.tableNumber || getAutoAssignedTable()
  const approvalStatus = source === 'admin_direct' || source === 'admin_link' ? 'approved' : 'pending'
  const approvedAt = approvalStatus === 'approved' ? new Date().toISOString() : null
  const createdAt = new Date().toISOString()

  let inviteEmailSent = false
  let inviteEmailSentAt: string | undefined = undefined

  // Optionally send invitation email immediately if email is provided
  if (input.sendEmailNow && targetEmail) {
    try {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ensorb.com'
      const emailRes = await sendUniqueInviteEmail(
        {
          id,
          code,
          accessCode,
          passId,
          targetName,
          targetEmail,
          maxGuests,
          tableNumber,
          category,
          customNote,
          source,
          approvalStatus,
          isRegistered: false,
          createdAt,
        },
        targetEmail,
        siteUrl
      )
      if (emailRes.success) {
        inviteEmailSent = true
        inviteEmailSentAt = new Date().toISOString()
      }
    } catch (e) {
      console.error('Error sending invite email:', e)
    }
  }

  const newInvite: Invite = {
    id,
    code,
    accessCode,
    passId,
    targetName,
    targetEmail,
    maxGuests,
    tableNumber,
    category,
    customNote,
    source,
    approvalStatus,
    approvedAt: approvedAt || undefined,
    isRegistered: false,
    createdAt,
    inviteEmailSent,
    inviteEmailSentAt,
  }

  const sql = getDb()
  if (sql) {
    try {
      await ensureAllTables()
      await sql`
        INSERT INTO invites (
          id, code, access_code, target_name, target_email, max_guests, table_number,
          category, custom_note, source, approval_status, approved_at, is_registered,
          pass_id, invite_email_sent, invite_email_sent_at, created_at, updated_at
        ) VALUES (
          ${id}, ${code}, ${accessCode}, ${targetName || null}, ${targetEmail || null},
          ${maxGuests}, ${tableNumber}, ${category}, ${customNote || null}, ${source},
          ${approvalStatus}, ${approvedAt}, false, ${passId}, ${inviteEmailSent},
          ${inviteEmailSentAt || null}, NOW(), NOW()
        );
      `
      return newInvite
    } catch (err) {
      console.error('Error creating invite in Postgres DB:', err)
    }
  }

  const local = await getLocalInvites()
  local.unshift(newInvite)
  await saveLocalInvites(local)
  return newInvite
}

export async function generateBareInvites(
  count: number = 5,
  optionsOrCategory: any = 'General',
  prefix: string = 'NS'
): Promise<Invite[]> {
  const isObj = typeof optionsOrCategory === 'object' && optionsOrCategory !== null
  const category = isObj ? (optionsOrCategory.category || 'General') : optionsOrCategory
  const maxGuests = isObj ? (optionsOrCategory.maxGuests || 2) : 2
  const tableNumber = isObj ? optionsOrCategory.tableNumber : undefined

  const created: Invite[] = []
  for (let i = 0; i < count; i++) {
    const invite = await createInvite({
      category,
      maxGuests,
      tableNumber,
      customCode: generateInviteCode(prefix),
      source: 'admin_link',
    })
    created.push(invite)
  }
  return created
}

export async function batchCreateInvites(
  inputsOrNames: string[] | CreateInviteInput[],
  options: any = {}
): Promise<Invite[]> {
  const results: Invite[] = []
  if (Array.isArray(inputsOrNames) && inputsOrNames.length > 0) {
    for (const item of inputsOrNames) {
      if (typeof item === 'string') {
        const inv = await createInvite({
          targetName: item.trim(),
          maxGuests: options.maxGuests || 2,
          tableNumber: options.tableNumber,
          category: options.category || 'General',
          source: 'admin_direct',
        })
        results.push(inv)
      } else {
        const inv = await createInvite(item)
        results.push(inv)
      }
    }
  }
  return results
}

export async function approveInvite(
  inviteId: string,
  input: ApproveInviteInput = {}
): Promise<Invite | null> {
  const existing = await getInviteByCode(inviteId)
  if (!existing) return null

  const tableNumber = input.tableNumber || existing.tableNumber || getAutoAssignedTable()
  const maxGuests = input.maxGuests || existing.maxGuests || 1
  const category = input.category || existing.category || 'General'
  const accessCode = existing.accessCode || generateAccessCode()
  const passId = existing.passId || generatePassId()
  const approvedAt = new Date().toISOString()

  let emailSent = existing.emailSent || false
  let emailSentAt = existing.emailSentAt

  // Send wedding pass email if guest email is available and requested
  const guestEmail = existing.guestEmail || existing.targetEmail
  if (input.sendAccessCardEmail && guestEmail) {
    try {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ensorb.com'
      const updatedPassInvite: Invite = {
        ...existing,
        tableNumber,
        maxGuests,
        category,
        accessCode,
        passId,
        approvalStatus: 'approved',
      }
      const emailRes = await sendWeddingPassEmail(updatedPassInvite, siteUrl)
      if (emailRes.success) {
        emailSent = true
        emailSentAt = new Date().toISOString()
      }
    } catch (e) {
      console.error('Error sending pass email:', e)
    }
  }

  const sql = getDb()
  if (sql) {
    try {
      await ensureAllTables()
      await sql`
        UPDATE invites SET
          approval_status = 'approved',
          approved_at = NOW(),
          table_number = ${tableNumber},
          max_guests = ${maxGuests},
          category = ${category},
          access_code = ${accessCode},
          pass_id = ${passId},
          email_sent = ${emailSent},
          email_sent_at = ${emailSentAt || null},
          updated_at = NOW()
        WHERE id = ${existing.id} OR code = ${existing.code};
      `
      return getInviteByCode(existing.id)
    } catch (err) {
      console.error('Error approving invite in Postgres DB:', err)
    }
  }

  const local = await getLocalInvites()
  const idx = local.findIndex((inv) => inv.id === existing.id || inv.code === existing.code)
  if (idx !== -1) {
    local[idx] = {
      ...local[idx],
      approvalStatus: 'approved',
      approvedAt,
      tableNumber,
      maxGuests,
      category,
      accessCode,
      passId,
      emailSent,
      emailSentAt,
    }
    await saveLocalInvites(local)
    return local[idx]
  }

  return null
}

export async function declineInvite(
  inviteId: string,
  reason: string = 'Capacity limits reached'
): Promise<Invite | null> {
  const existing = await getInviteByCode(inviteId)
  if (!existing) return null

  const sql = getDb()
  if (sql) {
    try {
      await ensureAllTables()
      await sql`
        UPDATE invites SET
          approval_status = 'declined',
          attendance = 'declined',
          decline_reason = ${reason},
          updated_at = NOW()
        WHERE id = ${existing.id} OR code = ${existing.code};
      `
      return getInviteByCode(existing.id)
    } catch (err) {
      console.error('Error declining invite in Postgres DB:', err)
    }
  }

  const local = await getLocalInvites()
  const idx = local.findIndex((inv) => inv.id === existing.id || inv.code === existing.code)
  if (idx !== -1) {
    local[idx] = {
      ...local[idx],
      approvalStatus: 'declined',
      attendance: 'declined',
      declineReason: reason,
    }
    await saveLocalInvites(local)
    return local[idx]
  }

  return null
}

export async function registerInvite(
  codeOrId: string,
  input: RegisterInviteInput
): Promise<Invite | null> {
  const existing = await getInviteByCode(codeOrId)
  if (!existing) return null

  const accessCode = existing.accessCode || generateAccessCode()
  const passId = existing.passId || generatePassId()
  const isAttending = input.attendance === 'attending'
  const actualGuestCount = isAttending ? Math.min(input.actualGuestCount, existing.maxGuests || 2) : 0
  const registeredAt = new Date().toISOString()

  const sql = getDb()
  if (sql) {
    try {
      await ensureAllTables()
      await sql`
        UPDATE invites SET
          is_registered = true,
          registered_at = NOW(),
          guest_name = ${input.guestName},
          guest_email = ${input.guestEmail},
          guest_phone = ${input.guestPhone},
          attendance = ${input.attendance},
          actual_guest_count = ${actualGuestCount},
          dietary_or_notes = ${input.dietaryOrNotes || null},
          access_code = ${accessCode},
          pass_id = ${passId},
          updated_at = NOW()
        WHERE id = ${existing.id} OR code = ${existing.code};
      `
      return getInviteByCode(existing.id)
    } catch (err) {
      console.error('Error registering invite in Postgres DB:', err)
    }
  }

  const local = await getLocalInvites()
  const idx = local.findIndex((inv) => inv.id === existing.id || inv.code === existing.code)
  if (idx !== -1) {
    local[idx] = {
      ...local[idx],
      isRegistered: true,
      registeredAt,
      guestName: input.guestName,
      guestEmail: input.guestEmail,
      guestPhone: input.guestPhone,
      attendance: input.attendance,
      actualGuestCount,
      dietaryOrNotes: input.dietaryOrNotes,
      accessCode,
      passId,
    }
    await saveLocalInvites(local)
    return local[idx]
  }

  return null
}

export async function updateInvite(id: string, updates: Partial<Invite>): Promise<Invite | null> {
  const existing = await getInviteByCode(id)
  if (!existing) return null

  const updated: Invite = { ...existing, ...updates }

  const sql = getDb()
  if (sql) {
    try {
      await ensureAllTables()
      await sql`
        UPDATE invites SET
          target_name = ${updated.targetName || null},
          target_email = ${updated.targetEmail || null},
          max_guests = ${updated.maxGuests},
          table_number = ${updated.tableNumber},
          category = ${updated.category},
          custom_note = ${updated.customNote || null},
          guest_name = ${updated.guestName || null},
          guest_email = ${updated.guestEmail || null},
          guest_phone = ${updated.guestPhone || null},
          attendance = ${updated.attendance || 'attending'},
          actual_guest_count = ${updated.actualGuestCount || 1},
          dietary_or_notes = ${updated.dietaryOrNotes || null},
          approval_status = ${updated.approvalStatus || 'pending'},
          updated_at = NOW()
        WHERE id = ${existing.id} OR code = ${existing.code};
      `
      return getInviteByCode(existing.id)
    } catch (err) {
      console.error('Error updating invite in Postgres DB:', err)
    }
  }

  const local = await getLocalInvites()
  const idx = local.findIndex((inv) => inv.id === existing.id || inv.code === existing.code)
  if (idx !== -1) {
    local[idx] = updated
    await saveLocalInvites(local)
    return updated
  }

  return null
}

export async function deleteInvite(id: string): Promise<boolean> {
  const sql = getDb()
  if (sql) {
    try {
      await ensureAllTables()
      await sql`
        DELETE FROM invites 
        WHERE id = ${id} OR code = ${id};
      `
      return true
    } catch (err) {
      console.error('Error deleting invite in Postgres DB:', err)
    }
  }

  const local = await getLocalInvites()
  const filtered = local.filter((inv) => inv.id !== id && inv.code !== id)
  if (filtered.length !== local.length) {
    await saveLocalInvites(filtered)
    return true
  }
  return false
}

export async function recordEmailResend(inviteId: string): Promise<boolean> {
  const existing = await getInviteByCode(inviteId)
  if (!existing) return false

  const guestEmail = existing.guestEmail || existing.targetEmail
  if (!guestEmail) return false

  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ensorb.com'
    const emailRes = await sendWeddingPassEmail(existing, siteUrl)

    if (emailRes.success) {
      const sql = getDb()
      if (sql) {
        await sql`
          UPDATE invites SET
            email_sent = true,
            email_sent_at = NOW(),
            updated_at = NOW()
          WHERE id = ${existing.id} OR code = ${existing.code};
        `
      }
      return true
    }
  } catch (err) {
    console.error('Error in recordEmailResend:', err)
  }
  return false
}

export async function getAdminStats(): Promise<AdminStats> {
  const invites = await getAllInvites()

  const totalInvites = invites.length
  const registeredCount = invites.filter((inv) => inv.isRegistered).length
  const pendingCount = invites.filter((inv) => inv.approvalStatus === 'pending').length
  const approvedCount = invites.filter((inv) => inv.approvalStatus === 'approved').length
  const attendingCount = invites.filter(
    (inv) => inv.attendance === 'attending' && inv.approvalStatus === 'approved'
  ).length
  const declinedCount = invites.filter(
    (inv) => inv.attendance === 'declined' || inv.approvalStatus === 'declined'
  ).length

  const totalSeatsAllocated = invites.reduce((acc, inv) => acc + (inv.maxGuests || 0), 0)
  const totalGuestsAttending = invites.reduce((acc, inv) => {
    if (inv.attendance === 'attending' && inv.approvalStatus === 'approved') {
      return acc + (inv.actualGuestCount || inv.maxGuests || 1)
    }
    return acc
  }, 0)

  return {
    totalInvites,
    registeredCount,
    pendingCount,
    approvedCount,
    attendingCount,
    declinedCount,
    totalSeatsAllocated,
    totalGuestsAttending,
    checkedInCount: 0,
  }
}
