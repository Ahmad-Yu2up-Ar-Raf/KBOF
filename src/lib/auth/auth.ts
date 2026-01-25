// src/lib/auth/auth.ts
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { admin, magicLink } from 'better-auth/plugins'
import { sendMagicLinkEmail } from '../server/send-magic-link'
import { ac, roles } from './permissions'
import * as schema from '@/db/schema'
import { db } from '@/db'

export const auth = betterAuth({
  user: {
    deleteUser: {
      enabled: true,
    },
    changeEmail: {
      enabled: true,
      updateEmailWithoutVerification: true,
    },
    additionalFields: {
      role: {
        type: 'string',
        defaultValue: 'admin',
        required: false,
      },
      hasCompletedOnboarding: {
        type: 'boolean',
        defaultValue: false,
        required: false,
      },
      fullName: {
        type: 'string',
        required: false,
      },
      username: {
        type: 'string',
        required: false,
      },
      avatar: {
        type: 'string',
        required: false,
      },
      bio: {
        type: 'string',
        required: false,
      },
      province: {
        type: 'string',
        required: false,
      },
      city: {
        type: 'string',
        required: false,
      },
      hobbies: {
        type: 'string',
        required: false,
      },
      expertise: {
        type: 'string',
        required: false,
      },
      motivation: {
        type: 'string',
        required: false,
      },
      favoriteCategories: {
        type: 'string',
        required: false,
      },
      interestedTypes: {
        type: 'string',
        required: false,
      },
      notificationPreferences: {
        type: 'string',
        required: false,
      },
    },
  },
  appName: 'Suasana',
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  emailAndPassword: {
    enabled: false, // ❌ DISABLE email/password auth
  },
 
  plugins: [
    admin({
      ac,
      roles: {
        admin: roles.admin,
        superAdmin: roles.superAdmin,
      },
      defaultRole: 'admin',
      adminRoles: ['admin', 'superAdmin'],
    }),
    magicLink({
      expiresIn: 60 * 15, // 15 minutes

      sendMagicLink: async ({ email, token, url }, ctx) => {
        // ✅ LOG: Magic link triggered
        console.log('🔗 [BETTER AUTH] sendMagicLink called')
        console.log('🔗 [BETTER AUTH] Email:', email)
        console.log('🔗 [BETTER AUTH] Token:', token)
        console.log('🔗 [BETTER AUTH] URL:', url)

        try {
          await sendMagicLinkEmail({ email, token, url })
          console.log('🔗 [BETTER AUTH] Magic link sent successfully')
        } catch (error) {
          console.error('🔗 [BETTER AUTH] Failed to send magic link:', error)
          throw error
        }
      },

      disableSignUp: false,
    }),
  ],
})
