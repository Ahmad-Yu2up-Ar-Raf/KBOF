// =============================================================================
// USER MANAGEMENT SERVER ACTIONS - SUASANA
// =============================================================================
// Server-side actions for user management (SuperAdmin only)

import { createServerFn } from '@tanstack/react-start'
import { eq, sql, desc, asc, ilike, and, or, count } from 'drizzle-orm'
import * as schema from '@/db/schema'
import {
  superAdminServerMiddleware,
  authServerMiddleware,
} from '@/lib/middleware'
import {
  updateUserRoleSchema,
  banUserSchema,
  unbanUserSchema,
  deleteUserSchema,
  bulkDeleteUsersSchema,
  bulkUpdateUserRoleSchema,
  bulkBanUsersSchema,
  bulkUnbanUsersSchema,
  searchUsersSchema,
  completeOnboardingSchema,
} from '@/lib/validations/user-validations'

// Dynamic import to prevent db from being bundled in client
const getDb = async () => {
  const { db } = await import('@/db')
  return db
}

// ============================================
// GET ALL USERS (with pagination, search, filters)
// ============================================

export const getUsers = createServerFn({ method: 'GET' })
  .middleware([superAdminServerMiddleware])
  .inputValidator(searchUsersSchema)
  .handler(async ({ data }) => {
    const db = await getDb()

    const { page, perPage, search, role, banned, sortBy, sortOrder } = data

    const offset = (page - 1) * perPage

    // Build where conditions
    const conditions = []

    if (search) {
      conditions.push(
        or(
          ilike(schema.user.name, `%${search}%`),
          ilike(schema.user.email, `%${search}%`),
          ilike(schema.user.username, `%${search}%`),
        ),
      )
    }

    if (role) {
      conditions.push(eq(schema.user.role, role))
    }

    if (banned !== undefined) {
      conditions.push(eq(schema.user.banned, banned))
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

    // Get total count
    const totalResult = await db
      .select({ count: count() })
      .from(schema.user)
      .where(whereClause)

    const total = totalResult[0]?.count ?? 0

    // Build order by
    const orderByColumn =
      sortBy === 'name'
        ? schema.user.name
        : sortBy === 'email'
          ? schema.user.email
          : sortBy === 'role'
            ? schema.user.role
            : schema.user.createdAt

    const orderByDirection = sortOrder === 'asc' ? asc : desc

    // Get users
    const users = await db
      .select({
        id: schema.user.id,
        name: schema.user.name,
        email: schema.user.email,
        image: schema.user.image,
        role: schema.user.role,
        banned: schema.user.banned,
        banReason: schema.user.banReason,
        banExpires: schema.user.banExpires,
        hasCompletedOnboarding: schema.user.hasCompletedOnboarding,
        username: schema.user.username,
        fullName: schema.user.fullName,
        createdAt: schema.user.createdAt,
        emailVerified: schema.user.emailVerified,
      })
      .from(schema.user)
      .where(whereClause)
      .orderBy(orderByDirection(orderByColumn))
      .limit(perPage)
      .offset(offset)

    return {
      users,
      pagination: {
        page,
        perPage,
        total,
        totalPages: Math.ceil(total / perPage),
      },
    }
  })

// ============================================
// GET SINGLE USER
// ============================================

export const getUserById = createServerFn({ method: 'GET' })
  .middleware([superAdminServerMiddleware])
  .inputValidator((id: string) => id)
  .handler(async ({ data: userId }) => {
    const db = await getDb()

    const users = await db
      .select()
      .from(schema.user)
      .where(eq(schema.user.id, userId))
      .limit(1)

    if (users.length === 0) {
      throw new Error('User not found')
    }

    // Get user stats
    const [destinationsCount, articlesCount] = await Promise.all([
      db
        .select({ count: count() })
        .from(schema.destination)
        .where(eq(schema.destination.userId, userId)),
      db
        .select({ count: count() })
        .from(schema.article)
        .where(eq(schema.article.authorId, userId)),
    ])

    return {
      ...users[0],
      stats: {
        destinations: destinationsCount[0]?.count ?? 0,
        articles: articlesCount[0]?.count ?? 0,
      },
    }
  })

// ============================================
// UPDATE USER ROLE
// ============================================

export const updateUserRole = createServerFn({ method: 'POST' })
  .middleware([superAdminServerMiddleware])
  .inputValidator(updateUserRoleSchema)
  .handler(async ({ data, context }) => {
    const db = await getDb()

    // Prevent self-role change
    if (data.userId === context.user!.id) {
      throw new Error('You cannot change your own role')
    }

    await db
      .update(schema.user)
      .set({ role: data.role })
      .where(eq(schema.user.id, data.userId))

    return { success: true, message: 'User role updated successfully' }
  })

// ============================================
// BAN USER
// ============================================

export const banUser = createServerFn({ method: 'POST' })
  .middleware([superAdminServerMiddleware])
  .inputValidator(banUserSchema)
  .handler(async ({ data, context }) => {
    const db = await getDb()

    // Prevent self-ban
    if (data.userId === context.user!.id) {
      throw new Error('You cannot ban yourself')
    }

    // Check if target is also superAdmin
    const targetUser = await db
      .select({ role: schema.user.role })
      .from(schema.user)
      .where(eq(schema.user.id, data.userId))
      .limit(1)

    if (targetUser[0]?.role === 'superAdmin') {
      throw new Error('Cannot ban another Super Admin')
    }

    await db
      .update(schema.user)
      .set({
        banned: true,
        banReason: data.reason ?? null,
        banExpires: data.expiresAt ?? null,
      })
      .where(eq(schema.user.id, data.userId))

    return { success: true, message: 'User banned successfully' }
  })

// ============================================
// UNBAN USER
// ============================================

export const unbanUser = createServerFn({ method: 'POST' })
  .middleware([superAdminServerMiddleware])
  .inputValidator(unbanUserSchema)
  .handler(async ({ data }) => {
    const db = await getDb()

    await db
      .update(schema.user)
      .set({
        banned: false,
        banReason: null,
        banExpires: null,
      })
      .where(eq(schema.user.id, data.userId))

    return { success: true, message: 'User unbanned successfully' }
  })

// ============================================
// DELETE USER
// ============================================

export const deleteUser = createServerFn({ method: 'POST' })
  .middleware([superAdminServerMiddleware])
  .inputValidator(deleteUserSchema)
  .handler(async ({ data, context }) => {
    const db = await getDb()

    // Prevent self-delete
    if (data.userId === context.user!.id) {
      throw new Error('You cannot delete yourself')
    }

    // Check if target is superAdmin
    const targetUser = await db
      .select({ role: schema.user.role })
      .from(schema.user)
      .where(eq(schema.user.id, data.userId))
      .limit(1)

    if (targetUser[0]?.role === 'superAdmin') {
      throw new Error('Cannot delete a Super Admin')
    }

    await db.delete(schema.user).where(eq(schema.user.id, data.userId))

    return { success: true, message: 'User deleted successfully' }
  })

// ============================================
// BULK DELETE USERS
// ============================================

export const bulkDeleteUsers = createServerFn({ method: 'POST' })
  .middleware([superAdminServerMiddleware])
  .inputValidator(bulkDeleteUsersSchema)
  .handler(async ({ data, context }) => {
    const db = await getDb()

    // Filter out self and superAdmins
    const targetUsers = await db
      .select({ id: schema.user.id, role: schema.user.role })
      .from(schema.user)
      .where(sql`${schema.user.id} = ANY(${data.userIds})`)

    const deletableIds = targetUsers
      .filter((u) => u.id !== context.user!.id && u.role !== 'superAdmin')
      .map((u) => u.id)

    if (deletableIds.length === 0) {
      throw new Error('No users can be deleted')
    }

    await db
      .delete(schema.user)
      .where(sql`${schema.user.id} = ANY(${deletableIds})`)

    return {
      success: true,
      message: `${deletableIds.length} users deleted successfully`,
      deletedCount: deletableIds.length,
    }
  })

// ============================================
// BULK UPDATE USER ROLE
// ============================================

export const bulkUpdateUserRole = createServerFn({ method: 'POST' })
  .middleware([superAdminServerMiddleware])
  .inputValidator(bulkUpdateUserRoleSchema)
  .handler(async ({ data, context }) => {
    const db = await getDb()

    // Filter out self and superAdmins (cannot change superAdmin role)
    const targetUsers = await db
      .select({ id: schema.user.id, role: schema.user.role })
      .from(schema.user)
      .where(sql`${schema.user.id} = ANY(${data.userIds})`)

    const updatableIds = targetUsers
      .filter((u) => u.id !== context.user!.id && u.role !== 'superAdmin')
      .map((u) => u.id)

    if (updatableIds.length === 0) {
      throw new Error('No users can be updated')
    }

    await db
      .update(schema.user)
      .set({ role: data.role })
      .where(sql`${schema.user.id} = ANY(${updatableIds})`)

    return {
      success: true,
      message: `${updatableIds.length} users role updated successfully`,
      updatedCount: updatableIds.length,
    }
  })

// ============================================
// BULK BAN USERS
// ============================================

export const bulkBanUsers = createServerFn({ method: 'POST' })
  .middleware([superAdminServerMiddleware])
  .inputValidator(bulkBanUsersSchema)
  .handler(async ({ data, context }) => {
    const db = await getDb()

    // Filter out self and superAdmins
    const targetUsers = await db
      .select({ id: schema.user.id, role: schema.user.role })
      .from(schema.user)
      .where(sql`${schema.user.id} = ANY(${data.userIds})`)

    const bannableIds = targetUsers
      .filter((u) => u.id !== context.user!.id && u.role !== 'superAdmin')
      .map((u) => u.id)

    if (bannableIds.length === 0) {
      throw new Error('No users can be banned')
    }

    await db
      .update(schema.user)
      .set({
        banned: true,
        banReason: data.reason ?? null,
      })
      .where(sql`${schema.user.id} = ANY(${bannableIds})`)

    return {
      success: true,
      message: `${bannableIds.length} users banned successfully`,
      bannedCount: bannableIds.length,
    }
  })

// ============================================
// BULK UNBAN USERS
// ============================================

export const bulkUnbanUsers = createServerFn({ method: 'POST' })
  .middleware([superAdminServerMiddleware])
  .inputValidator(bulkUnbanUsersSchema)
  .handler(async ({ data }) => {
    const db = await getDb()

    await db
      .update(schema.user)
      .set({
        banned: false,
        banReason: null,
        banExpires: null,
      })
      .where(sql`${schema.user.id} = ANY(${data.userIds})`)

    return {
      success: true,
      message: 'Users unbanned successfully',
    }
  })

// ============================================
// COMPLETE ONBOARDING
// ============================================

export const completeOnboarding = createServerFn({ method: 'POST' })
  .middleware([authServerMiddleware])
  .inputValidator(completeOnboardingSchema)
  .handler(async ({ data, context }) => {
    const db = await getDb()
    const userId = context.user!.id

    const { step1, step2, step3 } = data

    const updateData: Partial<schema.NewUser> = {
      hasCompletedOnboarding: true,
      fullName: step1.fullName,
      username: step1.username,
      bio: step1.bio ?? null,
    }

    // Add optional step 2 data
    if (step2) {
      updateData.province = step2.province ?? null
      updateData.city = step2.city ?? null
      updateData.hobbies = step2.hobbies ? JSON.stringify(step2.hobbies) : null
      updateData.expertise = step2.expertise
        ? JSON.stringify(step2.expertise)
        : null
      updateData.motivation = step2.motivation ?? null
    }

    // Add optional step 3 data
    if (step3) {
      updateData.favoriteCategories = step3.favoriteCategories
        ? JSON.stringify(step3.favoriteCategories)
        : null
      updateData.interestedTypes = step3.interestedTypes
        ? JSON.stringify(step3.interestedTypes)
        : null
      updateData.notificationPreferences = step3.notificationPreferences
        ? JSON.stringify(step3.notificationPreferences)
        : null
    }

    // Check username uniqueness
    const existingUser = await db
      .select({ id: schema.user.id })
      .from(schema.user)
      .where(
        and(
          eq(schema.user.username, step1.username),
          sql`${schema.user.id} != ${userId}`,
        ),
      )
      .limit(1)

    if (existingUser.length > 0) {
      throw new Error('Username sudah digunakan')
    }

    await db
      .update(schema.user)
      .set(updateData)
      .where(eq(schema.user.id, userId))

    return { success: true, message: 'Onboarding completed successfully' }
  })

// ============================================
// CHECK USERNAME AVAILABILITY
// ============================================

export const checkUsernameAvailability = createServerFn({ method: 'GET' })
  .inputValidator((username: string) => username)
  .handler(async ({ data: username }) => {
    const db = await getDb()

    const existingUser = await db
      .select({ id: schema.user.id })
      .from(schema.user)
      .where(eq(schema.user.username, username))
      .limit(1)

    return { available: existingUser.length === 0 }
  })
