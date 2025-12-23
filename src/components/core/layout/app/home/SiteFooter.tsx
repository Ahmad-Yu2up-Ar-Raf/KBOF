import React from 'react'
import { cn } from '@/lib/utils'

import { Logo } from '@/components/icons/AppLogoIcon'
import { Link } from '@tanstack/react-router'

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
  return (
    <footer
      className={cn(
        'relative bg-muted py-20 min-h-lvh content-center z-50 w-full',
        className,
      )}
      style={{ clipPath: 'polygon(0% 0, 100% 0%, 100% 100%, 0 100%)' }}
      {...props}
    >
      <div className="fixed z-50 bottom-0 h-full w-full">
        <div className="sticky z-50 overflow-hidden flex flex-col justify-end  h-full container px-5 sm:px-6 lg:px-14">
          <div className="grid border-b pb-6 md:pb-15 grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-4">
            {/* Kolom logo dan deskripsi */}
            <div className="col-span-2 lg:col-span-1">
              <div className="mb-6 md:mb-6 flex items-center space-x-2 group transition-transform">
                {/* Logo lebih kecil dan animasi hover */}
                <div className="size-10 sm:size-5 md:size-8 lg:size-10 transition-transform duration-300 group-hover:scale-105 group-hover:brightness-110">
                  <Logo />
                </div>
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
                        to="/login"
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
            <h1 className="text-center lg:h-80 relative text-[23dvw] lg:text-[16em] font-bold bg-clip-text tracking-tighter bg-linear-to-b to-background text-transparent from-yellow-950/50 select-none">
              SatuSuara
            </h1>
          </div>
        </div>
      </div>
    </footer>
  )
}
