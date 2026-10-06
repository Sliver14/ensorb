const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const DATA_DIR = path.join(__dirname, '..', 'data');
const INVITES_FILE = path.join(DATA_DIR, 'invites.json');
const CONTRIBS_FILE = path.join(DATA_DIR, 'gift_contributions.json');

async function resetAll() {
  console.log('--- Resetting All Data (Guests & Gifts) ---');
  fs.writeFileSync(INVITES_FILE, JSON.stringify([], null, 2), 'utf-8');
  fs.writeFileSync(CONTRIBS_FILE, JSON.stringify([], null, 2), 'utf-8');
  console.log('✓ Local data files cleared.');

  if (process.env.DATABASE_URL) {
    const sql = neon(process.env.DATABASE_URL);
    await sql`DELETE FROM invites;`;
    await sql`DELETE FROM gift_contributions;`;
    await sql`UPDATE gifts SET contributed_amount = 0, contributor_count = 0, is_fully_gifted = false;`;
    console.log('✓ Neon PostgreSQL database wiped clean (invites: 0, contributions: 0, gift progress: 0).');
  }
  console.log('--- Reset Complete! ---');
}

resetAll().catch(console.error);
