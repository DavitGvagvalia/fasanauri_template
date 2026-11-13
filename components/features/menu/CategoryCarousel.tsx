"use client"

import type { ReactElement } from "react"

import { useEffect, useState } from "react"
import { useLocale, useTranslations } from "next-intl"

import placeholderFood from "@/assets/images/placeholder_food.webp"
import CategoryCarouselItem from "@/components/features/menu/CategoryCarouselItem"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Skeleton } from "@/components/ui/skeleton"
import type { CarouselApi as TCarouselApi } from "@/components/ui/carousel"
import type { ICategory } from "@/types/menu"
import { ECategory } from "@/constants"
import { useCategoryCarousel } from "@/hooks/useCategoryCarousel"
import { getCategorySnap } from "@/lib/menu/getCategorySnap"

interface IProps {
  categories: ICategory[]
  selected: ECategory
  loading: boolean
  onSelect: (id: ECategory) => void
}

const CategoryCarousel = ({ categories, selected, loading, onSelect }: IProps): ReactElement => {
  const locale = useLocale()
  const t = useTranslations("Menu")
  const [api, setApi] = useState<TCarouselApi>()
  const carousel = useCategoryCarousel(api)
  useEffect(() => {
    const index = categories.findIndex((category) => category.id === selected) + 1
    if (api) {
      // containment merges edge snaps, the registry maps each category to its retained snap.
      api.scrollTo(getCategorySnap(api.internalEngine().slideRegistry, index))
    }
  }, [api, categories, selected])

  return (
    <Carousel
      setApi={setApi}
      opts={{ align: "center", dragFree: true, slidesToScroll: 1, containScroll: "trimSnaps" }}
      aria-label={t("categories")}
      aria-roledescription={t("carousel")}
      className="mx-10 min-w-0 xl:mx-0"
      onKeyDownCapture={carousel.handleKeyDown}
    >
      <CarouselContent className="-ml-1 touch-pan-y py-1">
        <CategoryCarouselItem
          id={ECategory.All}
          title={t("all")}
          imageURL={placeholderFood.src}
          selected={!selected}
          eager
          onSelect={onSelect}
        />
        {loading
          ? Array.from({ length: 10 }, (_, index) => (
              <CarouselItem
                key={`category-skeleton-${index}`}
                className="basis-24 pl-1 sm:basis-32"
              >
                <div className="flex h-32 flex-col items-center gap-3 p-3 sm:h-40">
                  <Skeleton className="aspect-square w-full rounded-lg" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </CarouselItem>
            ))
          : categories.map((category, index) => (
              <CategoryCarouselItem
                key={category.id}
                id={category.id}
                title={category.title[locale]}
                imageURL={category.imageURL}
                selected={selected === category.id}
                eager={index < 12}
                onSelect={onSelect}
              />
            ))}
      </CarouselContent>
      <CarouselPrevious
        className="inset-y-0 -left-10 my-auto size-8 xl:-left-11 xl:size-7"
        aria-label={`${t("previousCategories")}, ${t("hiddenCategories", { count: carousel.left })}`}
        onClick={carousel.scrollPrev}
        disabled={!carousel.canScrollPrev}
      />
      <CarouselNext
        className="inset-y-0 -right-10 my-auto size-8 xl:-right-11 xl:size-7"
        aria-label={`${t("nextCategories")}, ${t("hiddenCategories", { count: carousel.right })}`}
        onClick={carousel.scrollNext}
        disabled={!carousel.canScrollNext}
      />
      <span
        className="pointer-events-none absolute top-1/2 -left-10 mt-6 w-8 text-center text-xs tabular-nums xl:-left-11 xl:w-7"
        aria-hidden
      >
        {carousel.left > 0 ? `+${carousel.left}` : null}
      </span>
      <span
        className="pointer-events-none absolute top-1/2 -right-10 mt-6 w-8 text-center text-xs tabular-nums xl:-right-11 xl:w-7"
        aria-hidden
      >
        {carousel.right > 0 ? `+${carousel.right}` : null}
      </span>
    </Carousel>
  )
}

export default CategoryCarousel
