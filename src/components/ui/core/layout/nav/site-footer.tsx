import React from 'react'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/icons/app-logo-icon'
import { Link, useMatches } from '@tanstack/react-router'
import { useIsMobile } from '@/hooks/use-mobile'

type StickyFooterProps = React.ComponentProps<'footer'>

const footerColumns = [
  {
    title: 'Solusi',
    links: [
      'Otomatisasi Bisnis',
      'Layanan Cloud',
      'Analitik',
      'Integrasi',
      'Dukungan',
    ],
  },
  {
    title: 'Sumber Daya',
    links: ['Dokumentasi', 'Studi Kasus', 'Blog', 'Webinar', 'Komunitas'],
  },
  {
    title: 'Perusahaan',
    links: ['Tentang Kami', 'Karier', 'Kontak', 'Mitra', 'Pers'],
  },
]

export default function SiteFooter({ className, ...props }: StickyFooterProps) {
  const isMobile = useIsMobile()
  const matches = useMatches()
  const paths = matches[matches.length - 1]?.routeId
  const isActive =
    paths !== '/game' &&
    paths !== '/(auth)/login' &&
    paths !== '/(auth)/register'
  // '/(auth)/login',
  // '/(auth)/register',
  if (isActive)
    return (
      <footer
        className={cn(
          'relative bg-muted py-20 min-h-lvh content-center z-40 w-full',
          className,
        )}
        style={{ clipPath: 'polygon(0% 0, 100% 0%, 100% 100%, 0 100%)' }}
        {...props}
      >
        <div className="fixed z-50 bottom-0 h-full w-full">
          {/* Add padding-bottom on mobile to account for navbar height (min-h-[9lvh]) */}
          <div
            className={cn(
              'sticky z-50 overflow-hidden flex flex-col justify-end h-full container px-5 ',
              isMobile && 'pb-[6lvh]', // Space for mobile bottom navbar
            )}
          >
            <div className="grid lg:flex border-b lg:justify-between  pb-6 sm:gap-8 md:pb-15 grid-cols-2 gap-5 md:grid-cols-4 lg:grid-cols-4">
              {/* Kolom logo dan deskripsi */}
              <div className="col-span-2 lg:w-54 lg:col-span-1">
                <div className="mb-4 md:mb-6 flex items-center space-x-2 group transition-transform">
                  {/* Logo lebih kecil dan animasi hover */}
                  <Link
                    to="/"
                    className="size-10 sm:size-5 md:size-8 lg:size-10 transition-transform duration-300 group-hover:scale-105 group-hover:brightness-110"
                  >
                    <Logo />
                  </Link>
                </div>
                <p className="text-foreground/60 text- mb-3 md:mb-6 text-sm md:text-base leading-relaxed">
                  Memberdayakan bisnis dengan solusi yang andal, skalabel, dan
                  inovatif.
                </p>
              </div>

              {/* Kolom navigasi */}
              {footerColumns.map((col) => (
                <div key={col.title}>
                  <h4 className="mb-4 md:text-lg font-semibold">{col.title}</h4>
                  <ul className="space-y-2 md:space-y-3">
                    {col.links.map((text) => (
                      <li key={text}>
                        <Link
                          to="/"
                          className="text-foreground/60 text-xs hover:text-foreground transition"
                        >
                          {text}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Judul besar tengah */}
            <div className="w-full h-fit flex items-center justify-center  ">
              <h1 className="text-center lg:h-80 relative text-[25dvw] lg:text-[16em] font-bold bg-clip-text tracking-tighter   bg-linear-to-b to-background text-transparent from-yellow-950/50 select-none">
                Suasana.
              </h1>
            </div>
          </div>
        </div>
      </footer>
    )
}
