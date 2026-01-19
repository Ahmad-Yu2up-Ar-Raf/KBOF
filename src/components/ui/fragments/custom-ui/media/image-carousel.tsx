'use client'
import { Carousel, Slider, SliderContainer, ThumbsSlider } from './../carousel'
import MediaItem from './media-item'
import type { EmblaOptionsType } from 'embla-carousel'
import { useIsMobile } from '@/hooks/use-mobile'
import { useModal } from '@/components/provider/context-provider'

type componentProps = {
  images: Array<string>
}

function ThumnailSlider({ images }: componentProps) {
  const { openImage } = useModal()
  const isMobile = useIsMobile()
  const OPTIONS: EmblaOptionsType = isMobile
    ? { loop: false }
    : {
        loop: false,
        axis: 'y',
        direction: 'rtl',
      }

  return (
    <>
      <div className="w-full md:sticky top-15 h-full overflow-hidden rounded-xl mx-auto">
        <Carousel
          options={OPTIONS}
          className="relative w-full md:h-[38em] md:flex md:gap-2 space-y-2"
        >
          <SliderContainer className="gap-2 md:order-2 md:h-full md:w-full">
            {images.map((item, i) => (
              <Slider
                onClick={() => openImage(item)}
                key={i}
                className="md:h-[38em] cursor-zoom-in h-[20em] w-full"
                thumbnailSrc={item}
              >
                <MediaItem
                  webViewLink={item}
                  className="h-full object-cover rounded-lg w-full"
                />
              </Slider>
            ))}
          </SliderContainer>
          <ThumbsSlider
            className="md:w-20"
            thumbsSliderClassName="w-full h-18 md:order-1 rounded-xl basis-[25%]"
            thumbsClassName="md:h-[400px]"
          />
        </Carousel>
      </div>

      {/* Global image modal is rendered by ModalProvider; thumbnail only triggers openImage */}
    </>
  )
}

export default ThumnailSlider
