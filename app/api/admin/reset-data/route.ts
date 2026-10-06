import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { promises as fs } from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const INVITES_FILE = path.join(DATA_DIR, 'invites.json')
const CONTRIBS_FILE = path.join(DATA_DIR, 'gift_contributions.json')

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const { target = 'all' } = body // 'all' | 'invites' | 'gifts'

    // 1. Reset Invites
    if (target === 'all' || target === 'invites') {
      await fs.mkdir(DATA_DIR, { recursive: true })
      await fs.writeFile(INVITES_FILE, JSON.stringify([], null, 2), 'utf-8')

      const sql = getDb()
      if (sql) {
        await sql`DELETE FROM invites;`
      }
    }

    // 2. Reset Gifts / Contributions
    if (target === 'all' || target === 'gifts') {
      await fs.mkdir(DATA_DIR, { recursive: true })
      await fs.writeFile(CONTRIBS_FILE, JSON.stringify([], null, 2), 'utf-8')

      const sql = getDb()
      if (sql) {
        await sql`DELETE FROM gift_contributions;`
        await sql`UPDATE gifts SET contributed_amount = 0, contributor_count = 0, is_fully_gifted = false;`
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Demo data successfully reset and wiped clean.',
    })
  } catch (err: any) {
    console.error('Error in POST /api/admin/reset-data:', err)
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to reset data' },
      { status: 500 }
    )
  }
}
