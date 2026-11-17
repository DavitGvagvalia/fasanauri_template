"use client"

import type { ReactElement } from "react"

import CardImage from "@/components/shared/CardImage"
import { Button } from "@/components/ui/button"
import { CarouselItem } from "@/components/ui/carousel"
import { cn } from "@/lib/utils"
import type { ECategory } from "@/constants"

interface IProps {
  id: ECategory
  title: string
  imageURL: string
  selected: boolean
  eager?: boolean
  onSelect: (id: ECategory) => void
}

const CategoryCarouselItem = ({
  id,
  title,
  imageURL,
  selected,
  eager = false,
  onSelect,
}: IProps): ReactElement => {
  const selectCategory = (): void => {
    onSelect(id)
  }

  return (
    <CarouselItem
      className="basis-24 pl-1 sm:basis-28"
      aria-label={title}
    >
      <Button
        variant="ghost"
        onClick={selectCategory}
        aria-pressed={selected}
        className={cn(
          "group/card h-auto w-full flex-col justify-start gap-1 rounded-xl p-2 whitespace-normal transition-colors active:not-aria-[haspopup]:translate-y-0",
          selected &&
            "bg-category-selected text-primary-foreground hover:bg-category-selected-hover hover:text-primary-foreground dark:hover:bg-category-selected-hover dark:hover:text-primary-foreground"
        )}
      >
        <span className="relative grid aspect-square w-full shrink-0 overflow-hidden rounded-lg">
          <CardImage
            imageURL={imageURL}
            alt=""
            sizes="(max-width: 639px) 76px, 92px"
            eager={eager}
          />
        </span>
        <span className="flex min-h-9 w-full items-center justify-center text-center text-xs leading-[1.125rem]">
          <span className="line-clamp-2">{title}</span>
        </span>
      </Button>
    </CarouselItem>
  )
}

export default CategoryCarouselItem
