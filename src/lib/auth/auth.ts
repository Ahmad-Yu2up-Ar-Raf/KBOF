import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from '@/db' // your drizzle instance
import * as schema from '@/db/schema'
import { magicLink } from 'better-auth/plugins'
import { Resend } from 'resend'

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
  },
  appName: 'Bissmillah',
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
    // other plugin options
    magicLink({
      disableSignUp: true, // Disable using magic link at signup
      sendMagicLink: async ({ email, url }) => {
        await resend.emails.send({
          from: `${process.env.EMAIL_SENDER_NAME} <${process.env.EMAIL_SENDER_ADDRESS}>`,
          to: email,
          subject: 'Magic Link',
          html: `Click the link to login into your account: ${url}`,
        })
      },
    }),
  ],
})
