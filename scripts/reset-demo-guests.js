require('dotenv').config()
const { neon } = require('@neondatabase/serverless')
const fs = require('fs')
const path = require('path')

async function resetGuests() {
  console.log('--- Resetting All Guest / Invite Data ---')

  // 1. Clear local invites.json
  const dataDir = path.join(__dirname, '..', 'data')
  const invitesFile = path.join(dataDir, 'invites.json')
  fs.mkdirSync(dataDir, { recursive: true })
  fs.writeFileSync(invitesFile, JSON.stringify([], null, 2), 'utf-8')
  console.log('✓ data/invites.json wiped clean (empty array).')

  // 2. Clear Postgres DB if connected
  if (process.env.DATABASE_URL) {
    try {
      const sql = neon(process.env.DATABASE_URL)
      const res = await sql`DELETE FROM invites RETURNING id;`
      console.log(`✓ Neon DB: Deleted ${res.length} demo invite rows from "invites" table.`)
    } catch (err) {
      console.error('✕ Error clearing DB invites table:', err.message)
    }
  } else {
    console.log('No DATABASE_URL found, skipped remote DB reset.')
  }

  console.log('--- Guest Data Reset Complete! ---')
}

resetGuests().catch(console.error)
