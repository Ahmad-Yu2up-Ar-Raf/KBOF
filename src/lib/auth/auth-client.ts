import { magicLinkClient, adminClient } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'
import { ac, roles } from './permissions'

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL,
  plugins: [
    // Admin client for role management and user operations
    adminClient({
      ac,
      roles: {
        pribumi: roles.pribumi,
        admin: roles.admin,
        superAdmin: roles.superAdmin,
      },
    }),
    // Magic link client
    magicLinkClient(),
  ],
})

export const { signIn, signOut, signUp, useSession } = authClient
