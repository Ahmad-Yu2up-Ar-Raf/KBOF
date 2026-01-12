'use client'
import React, { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { Spinner } from '../../shadcn-ui/spinner'
import { Image } from '@unpic/react'

const MediaItem = ({
  webViewLink,
  className,
  mediaType = 'image',
  onClick,
  style,
}: {
  webViewLink: string
  mediaType?: 'image' | 'video'
  className?: string
  onClick?: () => void
  style?: React.CSSProperties
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isInView, setIsInView] = useState(false)
  const [isBuffering, setIsBuffering] = useState(true)
  const [imageLoaded, setImageLoaded] = useState(false)

  // Intersection Observer untuk video
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '50px',
      threshold: 0.1,
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        setIsInView(entry.isIntersecting)
      })
    }, options)

    if (videoRef.current) {
      observer.observe(videoRef.current)
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current)
      }
    }
  }, [])

  // Handle video play/pause
  useEffect(() => {
    let mounted = true

    const handleVideoPlay = async () => {
      if (!videoRef.current || !isInView || !mounted) return

      try {
        if (videoRef.current.readyState >= 3) {
          setIsBuffering(false)
          await videoRef.current.play()
        } else {
          setIsBuffering(true)
          await new Promise((resolve) => {
            if (videoRef.current) {
              videoRef.current.oncanplay = resolve
            }
          })
          if (mounted) {
            setIsBuffering(false)
            await videoRef.current.play()
          }
        }
      } catch (error) {
        console.warn('Video playback failed:', error)
      }
    }

    if (isInView) {
      handleVideoPlay()
    } else if (videoRef.current) {
      videoRef.current.pause()
    }

    return () => {
      mounted = false
      if (videoRef.current) {
        videoRef.current.pause()
        videoRef.current.removeAttribute('src')
        videoRef.current.load()
      }
    }
  }, [isInView])

  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  if (mediaType === 'video') {
    return (
      <div
        className={cn(`   w-full    relative overflow-hidden`, className)}
        style={style}
      >
        <video
          ref={videoRef}
          className={cn(
            'h-full   relative   object-cover  object-top inset-0  w-full ',
            // Disable hover effects on iOS
          )}
          onClick={onClick}
          playsInline
          muted
          loop
          preload="auto"
          style={{
            opacity: isBuffering ? 0.8 : 1,
            transition: 'opacity 0.2s',
            transform: 'translateZ(0)',
            willChange: 'transform',
          }}
        >
          <source src={webViewLink} type="video/mp4" />
        </video>
        {isBuffering && (
          <div className="absolute inset-0 flex items-center justify-center bg-accent-foreground/10">
            <Spinner className="w-6 h-6  text-accent rounded-xl animate-spin" />
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      className={cn(` overflow-hidden  flex justify-center h-full relative `, className)}
      style={style}
    >
      <Image
        src={webViewLink}
        alt={webViewLink}
        className="object-cover  w-full h-full  cursor-pointer"
        onClick={onClick}
        width={800}
        height={600}
        role="img"
        loading="lazy"
        onLoad={handleImageLoad}
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
      />
      {!imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-accent-foreground">
          <Spinner className="w-6 h-6 text-accent rounded-xl animate-spin" />
        </div>
      )}
    </div>
  )
}

export default MediaItem
