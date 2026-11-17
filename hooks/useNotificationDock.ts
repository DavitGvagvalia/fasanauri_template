"use client"

import { useEffect, useRef } from "react"
import type { RefObject } from "react"

export const useNotificationDock = (visible: boolean): RefObject<HTMLDivElement | null> => {
  const dock = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const element = dock.current
    if (!visible || !element) {
      return
    }
    const root = document.documentElement
    const prior = root.style.getPropertyValue("--order-notice-height")
    const measure = (): void => {
      root.style.setProperty("--order-notice-height", `${element.getBoundingClientRect().height}px`)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(element)

    return () => {
      observer.disconnect()
      if (prior) {
        root.style.setProperty("--order-notice-height", prior)
      } else {
        root.style.removeProperty("--order-notice-height")
      }
    }
  }, [visible])

  return dock
}
