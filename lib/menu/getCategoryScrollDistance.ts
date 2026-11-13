import { CATEGORY_SCROLL_TOLERANCE_PX } from "@/constants"
import type {
  ICategoryScrollMeasurements,
  TCategoryScrollDirection,
} from "@/types/categoryCarousel"

export const getCategoryScrollDistance = (
  measurements: ICategoryScrollMeasurements,
  direction: TCategoryScrollDirection
): number => {
  const { viewport, slides, position, target, min, max, useTarget } = measurements
  const base = Math.max(min, Math.min(max, useTarget ? target : position))
  const offset = base - position
  const candidates = slides
    .map((slide) => ({ left: slide.left + offset, right: slide.right + offset }))
    .filter((slide) =>
      direction === "left"
        ? slide.left < viewport.left - CATEGORY_SCROLL_TOLERANCE_PX
        : slide.right > viewport.right + CATEGORY_SCROLL_TOLERANCE_PX
    )
  // both arrows reveal a new category instead of only completing an already visible card.
  const hiddenCandidates = candidates.filter((slide) =>
    direction === "left"
      ? slide.right <= viewport.left + CATEGORY_SCROLL_TOLERANCE_PX
      : slide.left >= viewport.right - CATEGORY_SCROLL_TOLERANCE_PX
  )
  const destinations = hiddenCandidates.length ? hiddenCandidates : candidates
  const closest = direction === "left" ? destinations[destinations.length - 1] : destinations[0]
  if (!closest) {
    const cancellation = base - target

    return Math.abs(cancellation) > CATEGORY_SCROLL_TOLERANCE_PX ? cancellation : 0
  }
  const distance =
    direction === "left" ? viewport.left - closest.left : viewport.right - closest.right
  const destination = Math.max(min, Math.min(max, base + distance))
  const change = destination - target

  return Math.abs(change) > CATEGORY_SCROLL_TOLERANCE_PX ? change : 0
}
