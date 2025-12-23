import { createMiddleware } from '@tanstack/react-start'
import { auth } from './auth/auth'
import { redirect } from '@tanstack/react-router'

export const authMiddleware = createMiddleware().server(
  async ({ next, request }) => {
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session) {
      throw redirect({ to: '/login' })
    }
    return await next()
  },
)

export const guestMiddleware = createMiddleware().server(
  async ({ next, request }) => {
    const session = await auth.api.getSession({ headers: request.headers })
    if (session) {
      throw redirect({ to: '/dashboard' })
    }
    return await next()
  },
)
