'use client'

import React from 'react'
import { CalendarDateRangePicker } from './components/date-range-picker'

interface WrapperProps {
  children: React.ReactNode
  title?: string
}

function Wrapper({ children, title = 'Dashboard' }: WrapperProps) {
  return (
    <div className="flex-1 space-y-9">
      <header className="flex w-full flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col   gap-2">
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">
            👋 {title}
          </h1>
          <p>
            {' '}
            Selamat datang warga lokal, berikut ini rangkuman dari keseluruhan
            data kamu{' '}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <CalendarDateRangePicker />
        </div>
      </header>

      <main className="space-y-4">{children}</main>
    </div>
  )
}

export default Wrapper
