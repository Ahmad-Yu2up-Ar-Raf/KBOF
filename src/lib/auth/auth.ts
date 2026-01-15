import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from '@/db' // your drizzle instance
import * as schema from '@/db/schema'
import { magicLink, admin } from 'better-auth/plugins'
import { Resend } from 'resend'
import { ac, roles } from './permissions'

const resend = new Resend(process.env.RESEND_API_KEY as string)

export const auth = betterAuth({
  user: {
    deleteUser: {
      enabled: true,
    },
    changeEmail: {
      enabled: true,
      updateEmailWithoutVerification: true,
    },
    // Additional user fields for onboarding
    additionalFields: {
      role: {
        type: 'string',
        defaultValue: 'pribumi',
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
  //...other options
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    // Admin plugin for user management and role-based access control
    admin({
      ac,
      roles: {
        pribumi: roles.pribumi,
        admin: roles.admin,
        superAdmin: roles.superAdmin,
      },
      defaultRole: 'pribumi',
      adminRoles: ['admin', 'superAdmin'],
    }),
    // Magic link for passwordless login
    magicLink({
      disableSignUp: true, // Disable using magic link at signup
      sendMagicLink: async ({ email, url }) => {
        await resend.emails.send({
          from: `${process.env.EMAIL_SENDER_NAME} <${process.env.EMAIL_SENDER_ADDRESS}>`,
          to: email,
          subject: 'Magic Link - Suasana',
          html: `Click the link to login into your account: ${url}`,
        })
      },
    }),
  ],
})
