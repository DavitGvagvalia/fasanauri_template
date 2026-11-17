"use client"

import { useEffect, useRef, useState } from "react"

import type { CarouselApi as TCarouselApi } from "@/components/ui/carousel"
import type { IDemoOrder, TOrderStatus } from "@/types/order"

interface IReturn {
  setApi: (api: TCarouselApi) => void
  selectedIndex: number
  selectIndex: (index: number) => void
}

export const useOrderNoticeCarousel = (orders: IDemoOrder[]): IReturn => {
  const [api, setApi] = useState<TCarouselApi>()
  const [selectedIndex, setSelectedIndex] = useState(0)
  const selectedId = useRef<number | null>(null)
  const statuses = useRef(new Map<number, TOrderStatus>())
  useEffect(() => {
    if (!api) {
      return
    }
    const synchronize = (): void => {
      const index = api.selectedScrollSnap()
      selectedId.current = orders[index]?.id ?? null
      setSelectedIndex(index)
    }
    const newlyRequired = orders.find(
      (order) =>
        order.status === "confirmationRequired" &&
        statuses.current.get(order.id) !== "confirmationRequired"
    )
    const targetId = newlyRequired?.id ?? selectedId.current
    const target = Math.max(
      0,
      orders.findIndex((order) => order.id === targetId)
    )
    const initial = statuses.current.size === 0
    statuses.current = new Map(orders.map((order) => [order.id, order.status]))
    const frame = requestAnimationFrame(() => {
      api.scrollTo(target, initial || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      synchronize()
    })
    api.on("select", synchronize)
    api.on("reInit", synchronize)

    return () => {
      cancelAnimationFrame(frame)
      api.off("select", synchronize)
      api.off("reInit", synchronize)
    }
  }, [api, orders])

  const selectIndex = (index: number): void => {
    api?.scrollTo(index, window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  }

  return { setApi, selectedIndex, selectIndex }
}
