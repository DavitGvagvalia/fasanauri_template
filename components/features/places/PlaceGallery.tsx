"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import type { ReactElement } from "react"

import { Button } from "@/components/ui/button"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import type { CarouselApi as TCarouselApi } from "@/components/ui/carousel"
import type { IPlace, IPlaceGalleryImage } from "@/types/place"

interface IProps {
  place: IPlace
  images: IPlaceGalleryImage[]
}

const PlaceGallery = ({ place, images }: IProps): ReactElement => {
  const locale = useLocale()
  const t = useTranslations("Information")
  const [api, setApi] = useState<TCarouselApi>()
  const [selected, setSelected] = useState(0)
  useEffect(() => {
    if (!api) {
      return
    }
    const select = (): void => {
      setSelected(api.selectedScrollSnap())
    }
    api.on("select", select)

    return () => {
      api.off("select", select)
    }
  }, [api])

  const previous = (): void => {
    api?.scrollPrev(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  }

  const next = (): void => {
    api?.scrollNext(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  }

  return (
    <Carousel
      opts={{ loop: true }}
      setApi={setApi}
      aria-label={t("gallery")}
      className="isolate w-full"
    >
      <CarouselContent className="ml-0">
        {images.map((image, index) => (
          <CarouselItem
            key={image.id}
            className="pl-0"
            aria-label={t("slideCount", { current: index + 1, total: images.length })}
          >
            <div className="relative h-[65svh] min-h-80 max-h-192 w-full bg-muted">
              <Image
                src={image.imageURL}
                fill
                sizes="100vw"
                loading={index === 0 ? "eager" : "lazy"}
                alt={t("galleryImage", { place: place.title[locale], number: index + 1 })}
                className="object-cover"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="place-gallery-overlay pointer-events-none absolute inset-0">
        <div className="site-container flex h-full flex-col justify-end gap-8 py-8 sm:gap-12 sm:py-12">
          <div>
            <p className="mb-3 text-sm">{t("about")}</p>
            <h1 className="max-w-3xl text-3xl leading-tight font-semibold sm:text-5xl">
              {t("branchName", { place: place.title[locale] })}
            </h1>
            <p className="mt-4 text-sm">{t("galleryPlaceholder")}</p>
          </div>
          <div className="pointer-events-auto flex w-fit items-center gap-3">
            <Button
              variant="secondary"
              size="icon"
              onClick={previous}
              aria-label={t("previousImage")}
              className="rounded-full"
            >
              <ChevronLeft aria-hidden />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              onClick={next}
              aria-label={t("nextImage")}
              className="rounded-full"
            >
              <ChevronRight aria-hidden />
            </Button>
            <span
              aria-live="polite"
              className="ml-3 text-sm tabular-nums"
            >
              {t("slideCount", { current: selected + 1, total: images.length })}
            </span>
          </div>
        </div>
      </div>
    </Carousel>
  )
}

export default PlaceGallery
