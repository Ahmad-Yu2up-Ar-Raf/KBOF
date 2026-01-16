import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/fragments/shadcn-ui/button'
import { Compass } from 'lucide-react'
import Floating, {
    FloatingElement,
} from '@/components/ui/fragments/custom-ui/animate-ui/paralax-floating'
import MediaItem from '@/components/ui/fragments/custom-ui/media/media-item'
import { cn } from '@/lib/utils'

const ctaImages = [
    { url: 'https://images.unsplash.com/photo-1560103104-4623c14a473b?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { url: 'https://images.unsplash.com/photo-1680345575909-99633d4b6f46?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { url: 'https://images.unsplash.com/photo-1680345576151-bbc497ba969e?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { url: 'https://images.unsplash.com/photo-1571738318198-fda6afce5348?q=80&w=464&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
]

function GridPattern({
    width = 30,
    height = 30,
    x = -1,
    y = -1,
    strokeDasharray = '4 2',
    className,
    ...props
}: {
    width?: number
    height?: number
    x?: number
    y?: number
    strokeDasharray?: string
    className?: string
    [key: string]: unknown
}) {
    const id = 'grid-pattern-cta'
    return (
        <svg
            aria-hidden="true"
            className={cn(
                'pointer-events-none absolute inset-0 h-full w-full fill-primary/40 stroke-primary/40',
                className
            )}
            {...props}
        >
            <defs>
                <pattern
                    id={id}
                    width={width}
                    height={height}
                    patternUnits="userSpaceOnUse"
                    x={x}
                    y={y}
                >
                    <path
                        d={`M.5 ${height}V.5H${width}`}
                        fill="none"
                        strokeDasharray={strokeDasharray}
                    />
                </pattern>
            </defs>
            <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${id})`} />
        </svg>
    )
}

function GridPatternDashed() {
    return (
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            <GridPattern
                width={35}
                height={35}
                x={-1}
                y={-1}
                strokeDasharray="4 2"
                className={cn(
                    '[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]'
                )}
            />
        </div>
    )
}

export default function CTASection() {
    return (
        <section className="relative mx-5 my-10 h-[500px] md:h-[450px] overflow-hidden rounded-3xl border border-primary/20 bg-accent">
            {/* /* Grid Background */}
            <GridPatternDashed />

            {/* Floating Images */}
            <Floating sensitivity={-0.3} className="h-full">
                <FloatingElement depth={1} className="top-[-2%] md:top-[-10%] left-[0%]">
                    <div className="bg-white px-2 md:px-3 pb-5 md:pb-8 pt-2 md:pt-3 rotate-8 shadow-md">
                        <div className="w-[clamp(90px,22vw,140px)] h-[clamp(90px,22vw,140px)] sm:w-[clamp(120px,18vw,170px)] sm:h-[clamp(120px,18vw,170px)] md:w-[clamp(140px,14vw,200px)] md:h-[clamp(140px,14vw,200px)] relative overflow-hidden shadow-xl  opacity-80 hover:opacity-100 transition-opacity">
                            <MediaItem webViewLink={ctaImages[0].url} />
                        </div>
                    </div>
                </FloatingElement>

                <FloatingElement depth={2} className="bottom-[-5%] md:bottom-[-12%] right-[24%] md:left-[8%]">
                    <div className="bg-white px-2 md:px-3 pb-5 md:pb-8 pt-2 md:pt-3 -rotate-6 shadow-md">
                        <div className="w-[clamp(80px,19vw,120px)] h-[clamp(80px,19vw,120px)] sm:w-[clamp(100px,15vw,150px)] sm:h-[clamp(100px,15vw,150px)] md:w-[clamp(120px,11vw,180px)] md:h-[clamp(120px,11vw,180px)] relative overflow-hidden shadow-xl opacity-80 hover:opacity-100 transition-opacity">
                            <MediaItem webViewLink={ctaImages[1].url} />
                        </div>
                    </div>
                </FloatingElement>

                <FloatingElement depth={1.5} className="left-[24%] top-[-8%] md:top-[-8%] md:right-[-2%]">
                    <div className="bg-white px-2 md:px-3 pb-5 md:pb-8 pt-2 md:pt-3 -rotate-6 shadow-md">
                        <div className="w-[clamp(90px,20vw,130px)] h-[clamp(90px,20vw,130px)] sm:w-[clamp(120px,16vw,160px)] sm:h-[clamp(120px,16vw,160px)] md:w-[clamp(140px,12vw,190px)] md:h-[clamp(140px,12vw,190px)] relative overflow-hidden shadow-xl opacity-80 hover:opacity-100 transition-opacity">
                            <MediaItem webViewLink={ctaImages[2].url} />
                        </div>
                    </div>
                </FloatingElement>

                <FloatingElement depth={2.5} className="bottom-0 md:bottom-[-8%] right-[0%]">
                    <div className="bg-white px-2 md:px-3 pb-5 md:pb-8 pt-2 md:pt-3 rotate-4 shadow-md">
                        <div className="w-[clamp(100px,24vw,150px)] h-[clamp(100px,24vw,150px)] sm:w-[clamp(130px,20vw,180px)] sm:h-[clamp(130px,20vw,180px)] md:w-[clamp(150px,15vw,210px)] md:h-[clamp(150px,15vw,210px)] relative overflow-hidden shadow-xl  opacity-80 hover:opacity-100 transition-opacity">
                            <MediaItem webViewLink={ctaImages[3].url} />
                        </div>
                    </div>
                </FloatingElement>
            </Floating>

            {/* CTA Content */}
            <div className="relative z-10 flex h-full flex-col items-center justify-center gap-6 px-6 text-center">
                <div className="flex flex-col items-center justify-center gap-3">
                    <h2 className="max-w-xl text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
                        Siap Menjelajahi Keindahan Destinasi Lokal?
                    </h2>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                    <Button
                        asChild
                        size="lg"
                        className="group rounded-full font-semibold px-8"
                    >
                        <Link to="/destinasi">
                            Jelajahi Destinasi
                        </Link>
                    </Button>
                    <Button
                        asChild
                        size="lg"
                        variant="outline"
                        className="rounded-full font-semibold px-8 border-primary/30 hover:bg-primary/5"
                    >
                        <Link to="/artikel">Baca Artikel</Link>
                    </Button>
                </div>
            </div>
        </section>
    )
}
