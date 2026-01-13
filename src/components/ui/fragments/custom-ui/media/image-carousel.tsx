'use client'
import type { EmblaOptionsType } from 'embla-carousel'
import { Carousel, Slider, SliderContainer, ThumbsSlider } from './../carousel'
import MediaItem from './media-item'
import { useIsMobile } from '@/hooks/use-mobile'

type componentProps = {
  images: string[]
}

function ThumnailSlider({ images }: componentProps) {
  const OPTIONS: EmblaOptionsType = { loop: false }

  return (
    <>
      <div className="w-full   h-full  md:sticky top-10   md:w-[28em] overflow-hidden rounded-xl mx-auto">
        <Carousel
          options={OPTIONS}
          className="relative w-full   md:h-[35em]   space-y-2"
        >
          <SliderContainer className="gap-2    border-2 ">
            {images.map((item, i) => (
              <Slider
                key={i}
                className=" md:h-[24em] h-[30lvh] w-full"
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
            className="  "
            thumbsSliderClassName="w-full h-14    rounded-xl basis-[25%]"
            thumbsClassName="  md:h-[400px]"
          />
        </Carousel>
      </div>
    </>
  )
}

export default ThumnailSlider
