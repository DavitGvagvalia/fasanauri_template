"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { CATEGORY_SCROLL_TOLERANCE_PX } from "@/constants"
import { getHiddenCategoryCounts } from "@/lib/menu/getHiddenCategoryCounts"
import { scrollCategoryCarousel } from "@/lib/menu/scrollCategoryCarousel"
import type { CarouselApi as TCarouselApi } from "@/components/ui/carousel"
import type { IHiddenCategoryCounts } from "@/types/menu"
import type { TCategoryScrollDirection } from "@/types/categoryCarousel"
import type { KeyboardEvent } from "react"

interface IUseCategoryCarouselState extends IHiddenCategoryCounts {
  canScrollPrev: boolean
  canScrollNext: boolean
}

interface IUseCategoryCarouselReturn extends IUseCategoryCarouselState {
  scrollPrev: () => void
  scrollNext: () => void
  handleKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void
}

const isPendingTarget = (target: number, pending: number | null): boolean =>
  pending !== null && Math.abs(target - pending) <= CATEGORY_SCROLL_TOLERANCE_PX

export const useCategoryCarousel = (api: TCarouselApi): IUseCategoryCarouselReturn => {
  const [state, setState] = useState<IUseCategoryCarouselState>({
    left: 0,
    right: 0,
    canScrollPrev: false,
    canScrollNext: false,
  })
  const pendingTarget = useRef<number | null>(null)
  const pendingDirection = useRef<TCategoryScrollDirection | null>(null)
  useEffect(() => {
    pendingTarget.current = null
    pendingDirection.current = null
    if (!api) {
      return
    }
    const update = (): void => {
      const engine = api.internalEngine()
      const target = engine.target.get()
      const position = engine.limit.constrain(
        isPendingTarget(target, pendingTarget.current) ? target : engine.offsetLocation.get()
      )
      const next = {
        ...getHiddenCategoryCounts(api.slidesInView(), api.slideNodes().length),
        canScrollPrev: position < engine.limit.max - CATEGORY_SCROLL_TOLERANCE_PX,
        canScrollNext: position > engine.limit.min + CATEGORY_SCROLL_TOLERANCE_PX,
      }
      setState((previous) =>
        previous.left === next.left &&
        previous.right === next.right &&
        previous.canScrollPrev === next.canScrollPrev &&
        previous.canScrollNext === next.canScrollNext
          ? previous
          : next
      )
    }
    const resetPending = (): void => {
      pendingTarget.current = null
      pendingDirection.current = null
    }
    const frame = requestAnimationFrame(update)
    api
      .on("scroll", update)
      .on("select", update)
      .on("reInit", update)
      .on("slidesInView", update)
      .on("settle", update)
      .on("pointerDown", resetPending)

    return () => {
      cancelAnimationFrame(frame)
      api
        .off("scroll", update)
        .off("select", update)
        .off("reInit", update)
        .off("slidesInView", update)
        .off("settle", update)
        .off("pointerDown", resetPending)
    }
  }, [api])
  const navigate = useCallback(
    (direction: TCategoryScrollDirection): void => {
      const target = api?.internalEngine().target.get()
      const useTarget =
        target !== undefined &&
        pendingDirection.current === direction &&
        isPendingTarget(target, pendingTarget.current)
      pendingTarget.current = scrollCategoryCarousel(api, direction, useTarget)
      pendingDirection.current = direction
    },
    [api]
  )
  const scrollPrev = useCallback((): void => {
    navigate("left")
  }, [navigate])
  const scrollNext = useCallback((): void => {
    navigate("right")
  }, [navigate])
  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>): void => {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) {
        return
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault()
        scrollPrev()
      } else if (event.key === "ArrowRight") {
        event.preventDefault()
        scrollNext()
      }
    },
    [scrollPrev, scrollNext]
  )

  return { ...state, scrollPrev, scrollNext, handleKeyDown }
}
