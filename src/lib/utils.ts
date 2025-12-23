import { LinkProps } from '@tanstack/react-router'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isSameUrl(
  url1: NonNullable<LinkProps['href']>,
  url2: NonNullable<LinkProps['href']>,
) {
  return resolveUrl(url1) === resolveUrl(url2)
}

export function resolveUrl(url: NonNullable<LinkProps['href']>): string {
  return typeof url === 'string' ? url : url
}
