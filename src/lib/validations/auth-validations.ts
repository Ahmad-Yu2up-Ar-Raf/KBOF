import * as z from 'zod'

export const loginSchema = z.object({
  email: z.string().min(1),
  password: z.string().min(8),
})

export const changePassword = z.object({
  current_password: z.string().min(8),
  password: z.string().min(8),
})

export const registerCreateSchema = z.object({
  name: z.string().min(4, 'Name is required'),
  email: z.string().min(3, 'email is required'),
  password: z.string().min(8, 'password min 8'),
})

export const updateSchema = registerCreateSchema.pick({
  name: true,
  email: true,
})

export type UpdateSchema = z.infer<typeof updateSchema>
export type LoginSchema = z.infer<typeof loginSchema>
export type ChangePassword = z.infer<typeof changePassword>
export type RegisterSchema = z.infer<typeof registerCreateSchema>
