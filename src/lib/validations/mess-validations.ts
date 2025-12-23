import { type Mess, mess, status } from '@/db/schema'
import {
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from 'nuqs/server'
import * as z from 'zod'

import { flagConfig } from '@/config/flag'
import { getFiltersStateParser, getSortingStateParser } from '@/lib/parsers'

export const searchParamsCacheMess = createSearchParamsCache({
  filterFlag: parseAsStringEnum(
    flagConfig.featureFlags.map((flag) => flag.value),
  ),
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  sort: getSortingStateParser<Mess>().withDefault([
    { id: 'createdAt', desc: true },
  ]),
  name: parseAsString.withDefault(''),
  status: parseAsArrayOf(parseAsStringEnum(status.enumValues)).withDefault([]),
  type: parseAsArrayOf(parseAsStringEnum(mess.type.enumValues)).withDefault([]),
  statusCapacity: parseAsArrayOf(
    parseAsStringEnum(mess.statusCapacity.enumValues),
  ).withDefault([]),
  createdAt: parseAsArrayOf(parseAsInteger).withDefault([]),
  filters: getFiltersStateParser().withDefault([]),
  joinOperator: parseAsStringEnum(['and', 'or']).withDefault('and'),
})

export const createMesschema = z.object({
  name: z.string().min(1),
  userId: z.string().min(1), // Required - from session
  capacityRoom: z.number().min(1),
  capacityEmploye: z.number().optional(),
  status: z.enum(mess.status.enumValues).optional(),
  location: z.string().optional(),
  deskripcion: z.string().optional(),
  type: z.enum(mess.type.enumValues).optional(),
})

export type GetMessSchema = Awaited<
  ReturnType<typeof searchParamsCacheMess.parse>
>

export type CreateMessSchema = z.infer<typeof createMesschema>
