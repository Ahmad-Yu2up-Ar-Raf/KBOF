import {
  and,
  asc,
  count,
  desc,
  gte,
  ilike,
  inArray,
  lte,
  eq,
} from 'drizzle-orm'
import * as schema from '@/db/schema'
import { filterColumns } from '@/lib/filter-columns'
import { db } from '@/db'
import { querisType } from '@/types'
const mess = schema.mess
export async function getMess({ getMessInput, user }: querisType) {
  try {
    const offset = (getMessInput?.page! - 1) * getMessInput?.perPage!
    const advancedTable =
      (getMessInput && getMessInput.filterFlag === 'advancedFilters') ||
      (getMessInput && getMessInput.filterFlag === 'commandFilters')

    const advancedWhere = filterColumns({
      table: mess,
      filters: getMessInput?.filters!,
      joinOperator: getMessInput?.joinOperator!,
    })

    const userFilter = eq(mess.userId, user!.id)

    const where = advancedTable
      ? and(userFilter, advancedWhere)
      : and(
          userFilter,
          getMessInput && getMessInput.name
            ? ilike(mess.name, `%${getMessInput.name}%`)
            : undefined,
          getMessInput && getMessInput.status.length > 0
            ? inArray(mess.status, getMessInput.status)
            : undefined,
          getMessInput && getMessInput.statusCapacity.length > 0
            ? inArray(mess.statusCapacity, getMessInput.statusCapacity)
            : undefined,
          getMessInput && getMessInput.type.length > 0
            ? inArray(mess.type, getMessInput.type)
            : undefined,
          getMessInput && getMessInput.createdAt.length > 0
            ? and(
                getMessInput.createdAt[0]
                  ? gte(
                      mess.createdAt,
                      (() => {
                        const date = new Date(getMessInput.createdAt[0])
                        date.setHours(0, 0, 0, 0)
                        return date.toISOString()
                      })(),
                    )
                  : undefined,
                getMessInput.createdAt[1]
                  ? lte(
                      mess.createdAt,
                      (() => {
                        const date = new Date(getMessInput.createdAt[1])
                        date.setHours(23, 59, 59, 999)
                        return date.toISOString()
                      })(),
                    )
                  : undefined,
              )
            : undefined,
        )

    const orderBy =
      getMessInput && getMessInput.sort.length > 0
        ? getMessInput.sort.map((item) =>
            item.desc ? desc(mess[item.id]) : asc(mess[item.id]),
          )
        : [asc(mess.createdAt)]

    const { data, total } = await db.transaction(async (tx) => {
      // Subquery untuk menghitung jumlah rooms per mess
      const roomCount = tx
        .select({
          messId: schema.rooms.meesId,
          count: count(schema.rooms.id).as('roomCount'),
        })
        .from(schema.rooms)
        .limit(30)
        .groupBy(schema.rooms.meesId)
        .as('roomCounts')

      // Subquery untuk menghitung total employees per mess
      // Kita perlu join rooms dengan employees, lalu group by mess_id
      const employeeCount = tx
        .select({
          messId: schema.rooms.meesId,
          count: count(schema.employes.id).as('employeeCount'),
        })
        .from(schema.rooms)
        .limit(30)
        .leftJoin(schema.employes, eq(schema.rooms.id, schema.employes.roomId))
        .groupBy(schema.rooms.meesId)
        .as('employeeCounts')

      const data = await tx
        .select({
          id: mess.id,
          name: mess.name,
          location: mess.location,
          deskripcion: mess.deskripcion,
          capacityRoom: mess.capacityRoom,
          createdAt: mess.createdAt,
          status: mess.status,
          type: mess.type,
          statusCapacity: mess.statusCapacity,
          capacityEmploye: mess.capacityEmploye,
          roomCount: roomCount.count,
          employeeCount: employeeCount.count,
        })
        .from(mess)
        .limit(getMessInput?.perPage!)
        .leftJoin(roomCount, eq(mess.id, roomCount.messId))
        .leftJoin(employeeCount, eq(mess.id, employeeCount.messId))
        .offset(offset)
        .where(where)
        .orderBy(...orderBy)

      const total = await tx
        .select({
          count: count(),
        })
        .from(mess)
        .where(where)
        .execute()
        .then((res) => res[0]?.count ?? 0)

      return { data, total }
    })

    return {
      data,
      pageCount: Math.ceil(total / getMessInput?.perPage!),
    }
  } catch (err) {
    console.error('[Query Error]:', err)
    return { data: [], pageCount: 0 }
  }
}
