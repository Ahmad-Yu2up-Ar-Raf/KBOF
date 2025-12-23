import { db } from '@/db'
import { mess } from '@/db/schema'
import { takeFirstOrThrow } from '@/db/utils'
import { createServerFn } from '@tanstack/react-start'
import { createMesschema } from '@/lib/validations/mess-validations'
// =============================================================================
// SERVER FUNCTION
// =============================================================================
export const addMess = createServerFn({ method: 'POST' })
  .inputValidator(createMesschema)
  .handler(async ({ data }) => {
    // Get headers dari request context
    const result = await db
      .insert(mess)
      .values({
        ...data,
      })
      .returning({
        id: mess.id,
      })
      .then(takeFirstOrThrow)

    return result
  })
