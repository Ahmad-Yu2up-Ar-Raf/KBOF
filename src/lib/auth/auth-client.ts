// src/lib/auth/auth-client.ts
import { adminClient, magicLinkClient } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'
import { ac, roles } from './permissions'

export const authClient = createAuthClient({
  // ✅ FIX: Use VITE_ prefix for client-side access
  baseURL: import.meta.env.VITE_BETTER_AUTH_URL || 'http://localhost:3000',
  plugins: [
    adminClient({
      ac,
      roles: {
        admin: roles.admin,
        superAdmin: roles.superAdmin,
      },
    }),
    magicLinkClient(),
  ],
})

export const { signIn, signOut, signUp, useSession } = authClient
