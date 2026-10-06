const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const envContent = fs.readFileSync('.env', 'utf8');
const match = envContent.match(/DATABASE_URL=([^\r\n]+)/);
const url = match ? match[1].trim() : '';

const sql = neon(url);

async function init() {
  console.log('Running table migrations in Neon DB...');
  
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
  `;

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
  `;

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
  `;

  const tables = await sql`
    SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
  `;
  console.log('Tables in Neon Postgres:', tables.map(t => t.table_name));
}

init().then(() => {
  console.log('SUCCESS: All DB tables created and verified in Neon DB!');
  process.exit(0);
}).catch(err => {
  console.error('Migration error:', err);
  process.exit(1);
});
