import { Mess, User } from '@/db/schema'
import { GetMessSchema } from '@/lib/validations/mess-validations'
import { LinkProps } from '@tanstack/react-router'
import { LucideIcon } from 'lucide-react'

export interface sidebarType {
  items: {
    title: string
    url: string
    icon: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}

export interface NavItem {
  title: string
  href: NonNullable<LinkProps['href']>
  icon?: LucideIcon | null
  isActive?: boolean
}

export interface querisType {
  getMessInput?: GetMessSchema

  user?: User
  messId?: number
  Ids?: number[]
  roomId?: number
  employeId?: number
  RoomsstatusCapacity?: 'full' | 'available'
  Roomsstatus?: 'active' | 'not-active'
  MesstatusCapacity?: 'full' | 'available'
  Messtatus?: 'active' | 'not-active'
  gender?: 'male' | 'female'
  Employeestatus?: 'active' | 'not-active'
}

export interface typeMessColum extends Mess {
  roomCount: number
  employeeCount: number
}

/**
 * Output type untuk query result mess
 */
export type MessQueryResult = {
  data: {
    id: number
    name: string
    location: string | null
    deskripcion: string | null
    capacityRoom: number | null
    createdAt: string
    status: 'active' | 'not-active'
    type: 'male' | 'female' | 'mixture'
    statusCapacity: 'full' | 'available'
    capacityEmploye: number | null
    roomCount: number | null
    employeeCount: number | null
  }[]
  pageCount: number
}



export interface MessAggregateInput {
  filterFlag?: 'advancedFilters' | 'commandFilters' | null
  page?: number
  perPage?: number
  sort?: { id: string; desc: boolean }[]
  name?: string
  status?: ('active' | 'not-active')[]
  type?: ('male' | 'female' | 'mixture')[]
  statusCapacity?: ('full' | 'available')[]
  createdAt?: number[]
  filters?: unknown[]
  joinOperator?: 'and' | 'or'
}

/**
 * Result type dari aggregate query
 */
export interface MessAggregateResult {
  data: {
    id: number
    name: string
    location: string | null
    deskripcion: string | null
    capacityRoom: number | null
    createdAt: string
    status: 'active' | 'not-active'
    type: 'male' | 'female' | 'mixture'
    statusCapacity: 'full' | 'available'
    capacityEmploye: number | null
    roomCount: number | null
    employeeCount: number | null
  }[]
  pageCount: number
  statusCounts: {
    active: number
    'not-active': number
  }
  typeCounts: {
    male: number
    female: number
    mixture: number
  }
  capacityCounts: {
    full: number
    available: number
  }
}
