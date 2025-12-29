// src/db/index.ts
// =============================================================================
// DATABASE CONNECTION - SERVER ONLY
// =============================================================================
// ⚠️ This file should ONLY be imported in server-side code!
// If you see this error in the browser, something is importing db incorrectly.
//
// Using @neondatabase/serverless with HTTP driver for edge compatibility.

import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'

import * as schema from './schema.ts'
import * as relations from './relations.ts'

// Get database URL from environment
const getDatabaseUrl = () => {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    throw new Error(
      '❌ Database connection attempted in browser! ' +
        'The db module should only be imported in server-side code. ' +
        'Check your imports - a client component may be importing server code.',
    )
  }

  // Server-side: use process.env
  // Note: VITE_DATABASE_URL is set by neon-vite-plugin
  const url = process.env.DATABASE_URL || process.env.VITE_DATABASE_URL

  if (!url) {
    throw new Error(
      '❌ DATABASE_URL environment variable is not set! ' +
        'Please add DATABASE_URL to your .env file.',
    )
  }

  return url
}

// Create the HTTP SQL client
const sql = neon(getDatabaseUrl())

// Create drizzle instance with neon-http driver
export const db = drizzle(sql, { schema: { ...schema, ...relations } })
