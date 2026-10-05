import { neon, neonConfig } from '@neondatabase/serverless'
import { registryGifts } from './data'

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

// Get the SQL connection client
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

// Auto-initialize DB schema and initial gift items if not already present
let isInitialized = false

export async function ensureGiftTables() {
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

    // 3. Seed gifts table if empty
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

    isInitialized = true
    return true
  } catch (error) {
    console.error('Error in ensureGiftTables:', error)
    return false
  }
}
