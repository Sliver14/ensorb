import { neon } from '@neondatabase/serverless'
import { registryGifts } from './data'
import { Invite } from './types'

export interface GiftRecord {
  id: string
  title: string
  price: string
  numericPrice: number
  category: string
  categoryLabel: string
  image: string
  description: string
  featured: boolean
  contributedAmount: number
  contributorCount: number
  isFullyGifted: boolean
  createdAt?: string
  updatedAt?: string
}

export interface GiftContribution {
  id: string
  giftId: string | null
  giftTitle: string
  contributorName: string
  contributorEmail?: string | null
  contributorPhone?: string | null
  amount: number
  paymentReference: string
  customNote?: string | null
  status: 'pending' | 'confirmed' | 'declined'
  createdAt: string
  confirmedAt?: string | null
  confirmedBy?: string | null
}

export interface GiftAdminStats {
  totalRegistryValue: number
  totalConfirmedAmount: number
  totalPendingAmount: number
  pendingCount: number
  confirmedCount: number
  fullyGiftedCount: number
  totalItemsCount: number
}

// Get SQL connection client
export function getDb() {
  const connectionString =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.NEON_DATABASE_URL ||
    process.env.POSTGRES_PRISMA_URL

  if (!connectionString) {
    return null
  }

  try {
    return neon(connectionString)
  } catch (err) {
    console.error('Failed to initialize Neon DB client:', err)
    return null
  }
}

// Initial seed invites for first launch
export const INITIAL_SEED_INVITES: Partial<Invite>[] = [
  {
    id: 'inv-seed-001',
    code: 'NS-VIP-001',
    accessCode: 'NXYS26001G',
    targetName: 'Chief & Mrs. Emeka Kalu',
    targetEmail: 'emeka.kalu@example.com',
    maxGuests: 2,
    tableNumber: 'Table 01 - Emerald VIP',
    category: 'VIP',
    customNote: 'Bridal Family Honor Guest',
    source: 'admin_direct',
    approvalStatus: 'approved',
    isRegistered: true,
    guestName: 'Chief Emeka & Lolo Kalu',
    guestEmail: 'emeka.kalu@example.com',
    guestPhone: '+234 802 345 6789',
    attendance: 'attending',
    actualGuestCount: 2,
    dietaryOrNotes: 'No seafood please. Warmest congratulations to Ngozi & Sorbari!',
    passId: 'PASS-NS-2026-001',
    emailSent: true,
  },
  {
    id: 'inv-seed-002',
    code: 'NS-FAM-002',
    accessCode: 'NXYS26002G',
    targetName: 'Pastor & Mrs. Godwin Uebari',
    targetEmail: 'godwin.uebari@example.com',
    maxGuests: 2,
    tableNumber: 'Table 02 - Royal Gold',
    category: 'Family',
    customNote: 'Groom Parents & Family Table',
    source: 'admin_direct',
    approvalStatus: 'approved',
    isRegistered: true,
    guestName: 'Pastor Godwin & Deaconess Uebari',
    guestEmail: 'godwin.uebari@example.com',
    guestPhone: '+234 803 456 7890',
    attendance: 'attending',
    actualGuestCount: 2,
    dietaryOrNotes: 'Special blessings for the couple!',
    passId: 'PASS-NS-2026-002',
    emailSent: true,
  },
  {
    id: 'inv-seed-003',
    code: 'NS-CLG-003',
    accessCode: 'NXYS26003G',
    targetName: 'Dr. Michael Adeyemi',
    targetEmail: 'michael.adeyemi@example.com',
    maxGuests: 1,
    tableNumber: 'Table 03 - Sapphire',
    category: 'Colleagues',
    customNote: 'Loveworld Staff Community',
    source: 'rsvp_form',
    approvalStatus: 'pending',
    isRegistered: true,
    guestName: 'Dr. Michael Adeyemi',
    guestEmail: 'michael.adeyemi@example.com',
    guestPhone: '+234 805 123 9876',
    attendance: 'attending',
    actualGuestCount: 1,
    dietaryOrNotes: 'Looking forward to the grand celebration!',
    passId: 'PASS-NS-2026-003',
    emailSent: false,
  },
]

let isInitialized = false

export async function ensureAllTables() {
  const sql = getDb()
  if (!sql) return false
  if (isInitialized) return true

  try {
    // 1. Create gifts table
    await sql`
      CREATE TABLE IF NOT EXISTS gifts (
        id VARCHAR(255) PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        price VARCHAR(100) NOT NULL,
        numeric_price BIGINT NOT NULL,
        category VARCHAR(100) NOT NULL,
        category_label VARCHAR(255) NOT NULL,
        image TEXT NOT NULL,
        description TEXT NOT NULL,
        featured BOOLEAN DEFAULT false,
        contributed_amount BIGINT DEFAULT 0,
        contributor_count INT DEFAULT 0,
        is_fully_gifted BOOLEAN DEFAULT false,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `

    // 2. Create gift_contributions table
    await sql`
      CREATE TABLE IF NOT EXISTS gift_contributions (
        id VARCHAR(255) PRIMARY KEY,
        gift_id VARCHAR(255),
        gift_title VARCHAR(500) NOT NULL,
        contributor_name VARCHAR(255) NOT NULL,
        contributor_email VARCHAR(255),
        contributor_phone VARCHAR(100),
        amount BIGINT NOT NULL,
        payment_reference VARCHAR(255) NOT NULL,
        custom_note TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        confirmed_at TIMESTAMPTZ,
        confirmed_by VARCHAR(255)
      );
    `

    // 3. Create invites table
    await sql`
      CREATE TABLE IF NOT EXISTS invites (
        id VARCHAR(255) PRIMARY KEY,
        code VARCHAR(255) UNIQUE NOT NULL,
        access_code VARCHAR(255),
        target_name VARCHAR(255),
        target_email VARCHAR(255),
        max_guests INT DEFAULT 1,
        table_number VARCHAR(255) DEFAULT 'Table 01 - Emerald VIP',
        category VARCHAR(100) DEFAULT 'General',
        custom_note TEXT,
        source VARCHAR(100) DEFAULT 'rsvp_form',
        approval_status VARCHAR(50) DEFAULT 'pending',
        decline_reason TEXT,
        approved_at TIMESTAMPTZ,
        is_registered BOOLEAN DEFAULT false,
        registered_at TIMESTAMPTZ,
        guest_name VARCHAR(255),
        guest_email VARCHAR(255),
        guest_phone VARCHAR(100),
        attendance VARCHAR(50) DEFAULT 'attending',
        actual_guest_count INT DEFAULT 1,
        dietary_or_notes TEXT,
        pass_id VARCHAR(255),
        email_sent BOOLEAN DEFAULT false,
        email_sent_at TIMESTAMPTZ,
        invite_email_sent BOOLEAN DEFAULT false,
        invite_email_sent_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `

    // 4. Seed gifts table if empty
    const existingGifts = await sql`SELECT count(*) as count FROM gifts;`
    const count = Number(existingGifts[0]?.count || 0)

    if (count === 0) {
      for (const gift of registryGifts) {
        await sql`
          INSERT INTO gifts (
            id, title, price, numeric_price, category, category_label, image, description, featured, contributed_amount, contributor_count, is_fully_gifted
          ) VALUES (
            ${gift.id},
            ${gift.title},
            ${gift.price},
            ${gift.numericPrice},
            ${gift.category},
            ${gift.categoryLabel},
            ${gift.image},
            ${gift.description},
            ${gift.featured || false},
            ${gift.contributedAmount || 0},
            ${gift.contributorCount || 0},
            ${gift.isFullyGifted || false}
          ) ON CONFLICT (id) DO NOTHING;
        `
      }
    }

    // 5. Seed sample invites if empty
    const existingInvites = await sql`SELECT count(*) as count FROM invites;`
    const inviteCount = Number(existingInvites[0]?.count || 0)

    if (inviteCount === 0) {
      for (const inv of INITIAL_SEED_INVITES) {
        await sql`
          INSERT INTO invites (
            id, code, access_code, target_name, target_email, max_guests, table_number, category,
            custom_note, source, approval_status, approved_at, is_registered, registered_at,
            guest_name, guest_email, guest_phone, attendance, actual_guest_count, dietary_or_notes,
            pass_id, email_sent, created_at, updated_at
          ) VALUES (
            ${inv.id || 'inv-' + Date.now()},
            ${inv.code || 'NS-' + Date.now()},
            ${inv.accessCode || null},
            ${inv.targetName || null},
            ${inv.targetEmail || null},
            ${inv.maxGuests || 1},
            ${inv.tableNumber || 'Table 01 - Emerald VIP'},
            ${inv.category || 'General'},
            ${inv.customNote || null},
            ${inv.source || 'admin_direct'},
            ${inv.approvalStatus || 'approved'},
            ${inv.approvalStatus === 'approved' ? new Date().toISOString() : null},
            ${inv.isRegistered || false},
            ${inv.isRegistered ? new Date().toISOString() : null},
            ${inv.guestName || null},
            ${inv.guestEmail || null},
            ${inv.guestPhone || null},
            ${inv.attendance || 'attending'},
            ${inv.actualGuestCount || 1},
            ${inv.dietaryOrNotes || null},
            ${inv.passId || null},
            ${inv.emailSent || false},
            NOW(),
            NOW()
          ) ON CONFLICT (id) DO NOTHING;
        `
      }
    }

    isInitialized = true
    return true
  } catch (error) {
    console.error('Error in ensureAllTables:', error)
    return false
  }
}

export const ensureGiftTables = ensureAllTables
