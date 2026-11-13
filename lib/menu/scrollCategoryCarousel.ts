"use client"

import { getCategoryScrollDistance } from "@/lib/menu/getCategoryScrollDistance"
import type { CarouselApi as TCarouselApi } from "@/components/ui/carousel"
import type { TCategoryScrollDirection } from "@/types/categoryCarousel"

export const scrollCategoryCarousel = (
  api: TCarouselApi,
  direction: TCategoryScrollDirection,
  useTarget: boolean
): number | null => {
  if (!api) {
    return null
  }
  const engine = api.internalEngine()
  const viewport = api.rootNode().getBoundingClientRect()
  if (!engine.options.active || !viewport.width) {
    return null
  }
  const distance = getCategoryScrollDistance(
    {
      viewport,
      // measures the card itself rather than the slide s leading gap.
      slides: api
        .slideNodes()
        .map((slide) => (slide.firstElementChild ?? slide).getBoundingClientRect()),
      position: engine.offsetLocation.get(),
      target: engine.target.get(),
      min: engine.limit.min,
      max: engine.limit.max,
      useTarget,
    },
    direction
  )
  if (!distance) {
    return null
  }
  const reducedMotion = engine.ownerWindow.matchMedia("(prefers-reduced-motion: reduce)").matches
  engine.scrollBody.useBaseFriction().useDuration(reducedMotion ? 0 : engine.options.duration)
  // centered public snaps cannot align a partly clipped edge card, isolate the distance API here.
  engine.scrollTo.distance(distance, false)

  return engine.target.get()
}
