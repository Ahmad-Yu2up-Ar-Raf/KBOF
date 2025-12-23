import { User } from '@/db/schema'
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
