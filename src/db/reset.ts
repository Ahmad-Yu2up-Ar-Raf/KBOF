// =============================================================================
// DATABASE RESET SCRIPT
// =============================================================================
// Mirip "php artisan migrate:fresh" di Laravel
// Run: npx tsx src/db/reset.ts
// =============================================================================

import 'dotenv/config'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

async function reset() {
  console.log('\n' + '='.repeat(60))
  console.log('🔄 DATABASE RESET - SUASANA')
  console.log('='.repeat(60))

  try {
    console.log('\n🗑️  Dropping public schema (this removes ALL tables)...')
    await sql`DROP SCHEMA public CASCADE`

    console.log('🔨 Recreating public schema...')
    await sql`CREATE SCHEMA public`
    await sql`GRANT ALL ON SCHEMA public TO PUBLIC`

    console.log('\n' + '='.repeat(60))
    console.log('✅ DATABASE RESET COMPLETE!')
    console.log('='.repeat(60))
    console.log('\nNext steps:')
    console.log('  1. Run: npx drizzle-kit push')
    console.log('  2. Run: npx tsx src/db/seed.ts (optional)')
    console.log('')
  } catch (error) {
    console.error('\n❌ Reset failed:', error)
    process.exit(1)
  }

  process.exit(0)
}

reset()
