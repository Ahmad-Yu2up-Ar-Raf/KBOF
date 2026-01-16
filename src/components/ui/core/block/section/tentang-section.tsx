import { cn } from '@/lib/utils'
import { Image } from '@unpic/react'
import React, { useState } from 'react'

// =============================================================================
// IMAGE CARD COMPONENT - with hover/blur effects like Podium
// =============================================================================

type ImageCardProps = {
  src: string
  alt: string
  className?: string
  index: number
  hovered: number | null
  setHovered: React.Dispatch<React.SetStateAction<number | null>>
}

function ImageCard({
  src,
  alt,
  className,
  index,
  hovered,
  setHovered,
}: ImageCardProps) {
  const isHovered = hovered === index
  const isBlurred = hovered !== null && hovered !== index

  return (
    <div
      className={cn(
        'relative rounded-lg transition-all duration-300 cursor-pointer',
        'hover:scale-105',
        isBlurred && 'blur-[2px] opacity-70 scale-95',
        isHovered && 'z-10',
        className,
      )}
      onMouseEnter={() => setHovered(index)}
      onMouseLeave={() => setHovered(null)}
    >
      <Image
        src={src}
        alt={alt}
        width={300}
        height={400}
        className="w-full h-full object-contain"
      />
    </div>
  )
}

// =============================================================================
// ABOUT SECTION
// =============================================================================

function About() {
  const [hoveredImage, setHoveredImage] = useState<number | null>(null)

  return (
    <section className="container px-5 py-12 md:py-16 lg:py-20">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-8 lg:gap-10">
        {/* Teks About Us - Kiri */}
        <header className="flex flex-col w-full lg:w-[45%] gap-y-4">
          {/* Judul */}
          <div className="flex flex-col gap-y-1">
            <p className="text-xs md:text-sm text-muted-foreground tracking-[0.3em] uppercase">
          tentang suasana
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-primary">
              Sejarah Bertutur
            </h2>
          </div>

          {/* Deskripsi - lebih singkat */}
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed  ">
            Platform edukasi yang mendokumentasikan budaya, bahasa, dan cerita
            dari berbagai daerah di Nusantara.
          </p>
        </header>

        {/* Image Container - Kanan (Flex based, controlled size) */}
        <div className="flex items-end justify-center w-full lg:w-[50%] lg:hover:gap-6 transition-all duration-300">
          {/* Gambar pendukung kiri - rotated -15deg */}
          <div className="-mr-12 md:-mr-16 lg:-mr-20 hover:mr-0 md:translate-y-3 -rotate-6 z-[1] transition-all duration-300">
            <ImageCard
              src="assets/images/rendang-potongan.png"
              alt="Rendang - Kuliner Nusantara"
              className="w-[140px] h-auto md:w-[180px] lg:w-[200px]"
              index={0}
              hovered={hoveredImage}
              setHovered={setHoveredImage}
            />
          </div>

          {/* Gambar utama tengah - larger */}
          <div className="-translate-y-2 md:-translate-y-4 z-[3] hover:mx-2 transition-all duration-300">
            <ImageCard
              src="assets/images/gadang-potongan.png"
              alt="Rumah Gadang - Arsitektur Nusantara"
              className="w-[160px] h-auto md:w-[220px] lg:w-[240px]"
              index={1}
              hovered={hoveredImage}
              setHovered={setHoveredImage}
            />
          </div>

          {/* Gambar pendukung kanan - rotated 15deg */}
          <div className="-ml-12 md:-ml-16 lg:-ml-20 hover:ml-0 md:translate-y-5 rotate-6 z-[1] transition-all duration-300">
            <ImageCard
              src="assets/images/batik-potongan.png"
              alt="Batik - Warisan Nusantara"
              className="w-[140px] h-auto md:w-[180px] lg:w-[200px]"
              index={2}
              hovered={hoveredImage}
              setHovered={setHoveredImage}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
