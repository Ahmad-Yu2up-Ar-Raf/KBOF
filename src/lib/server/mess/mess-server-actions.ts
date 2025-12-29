import { mess } from '@/db/schema'
import { takeFirstOrThrow } from '@/db/utils'
import { createServerFn } from '@tanstack/react-start'
import {
  createMesschema,
  IdSchema,
  updateMesschema,
  updateMessPartialSchema,
  UpdateMessTypesIdSchema,
} from '@/lib/validations/mess-validations'
import { authServerMiddleware } from '../../middleware'
import { eq, inArray } from 'drizzle-orm'
import { getErrorMessage } from '../../handle-error'

// Dynamic import to prevent db from being bundled in client
const getDb = async () => {
  const { db } = await import('@/db')
  return db
}

// =============================================================================
// SERVER FUNCTION
// =============================================================================
export const addMess = createServerFn({ method: 'POST' })
  .middleware([authServerMiddleware])
  .inputValidator(createMesschema)
  .handler(async ({ data, context }) => {
    try {
      const db = await getDb()
      const user = context.user
      const result = await db
        .insert(mess)
        .values({
          ...data,
          userId: user!.id,
        })
        .returning({
          id: mess.id,
        })
        .then(takeFirstOrThrow)
      return {
        data: result,
        error: null,
      }
    } catch (err) {
      return {
        data: null,
        error: getErrorMessage(err),
      }
    }
    // Get headers dari request context
  })

export const updateMess = createServerFn({ method: 'POST' })
  .middleware([authServerMiddleware])
  .inputValidator(updateMesschema)
  .handler(async ({ data }) => {
    // Get headers dari request context
    try {
      const db = await getDb()
      const result = await db
        .update(mess)
        .set({
          ...data,
        })
        .where(eq(mess.id, data.id))
        .returning({
          type: mess.type,
          status: mess.status,
          statusCapacity: mess.statusCapacity,
        })
        .then(takeFirstOrThrow)
      return {
        data: result,
        error: null,
      }
    } catch (err) {
      return {
        data: null,
        error: getErrorMessage(err),
      }
    }
  })

// Partial update for single field changes (status, type only) - used in column actions
export const updateMessPartial = createServerFn({ method: 'POST' })
  .middleware([authServerMiddleware])
  .inputValidator(updateMessPartialSchema)
  .handler(async ({ data }) => {
    try {
      const db = await getDb()

      // Only update fields that are provided
      const updateData: Record<string, unknown> = {}
      if (data.status !== undefined) updateData.status = data.status
      if (data.type !== undefined) updateData.type = data.type
      if (data.statusCapacity !== undefined)
        updateData.statusCapacity = data.statusCapacity

      const result = await db
        .update(mess)
        .set(updateData)
        .where(eq(mess.id, data.id))
        .returning({
          type: mess.type,
          status: mess.status,
          statusCapacity: mess.statusCapacity,
        })
        .then(takeFirstOrThrow)
      return {
        data: result,
        error: null,
      }
    } catch (err) {
      return {
        data: null,
        error: getErrorMessage(err),
      }
    }
  })

export const updateBulkMess = createServerFn({ method: 'POST' })
  .middleware([authServerMiddleware])
  .inputValidator(UpdateMessTypesIdSchema)
  .handler(async ({ data: input }) => {
    // Get headers dari request context
    try {
      const db = await getDb()
      const result = await db
        .update(mess)
        .set({
          type: input.type,
          status: input.status,
          statusCapacity: input.statusCapacity,
        })
        .where(inArray(mess.id, input.ids))
        .returning({
          type: mess.type,
          status: mess.status,
          statusCapacity: mess.statusCapacity,
        })
        .then(takeFirstOrThrow)
      return {
        data: result,
        error: null,
      }
    } catch (err) {
      return {
        data: null,
        error: getErrorMessage(err),
      }
    }
  })

export const deleteMess = createServerFn({ method: 'POST' })
  .middleware([authServerMiddleware])
  .inputValidator(IdSchema)
  .handler(async ({ data }) => {
    try {
      const db = await getDb()
      // Execute delete - don't return the result object (not serializable)
      await db.delete(mess).where(inArray(mess.id, data.ids))
      // Return simple serializable success response
      return {
        data: { success: true, deletedIds: data.ids },
        error: null,
      }
    } catch (err) {
      return {
        data: null,
        error: getErrorMessage(err),
      }
    }
  })
