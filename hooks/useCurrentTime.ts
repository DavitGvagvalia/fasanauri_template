"use client"

import { useEffect, useState } from "react"

import { ORDER_CLOCK_TICK_MS } from "@/constants"

export const useCurrentTime = (active: boolean): number => {
  const [now, setNow] = useState(Date.now)
  useEffect(() => {
    if (!active) {
      return
    }
    const timer = window.setInterval(() => setNow(Date.now()), ORDER_CLOCK_TICK_MS)

    return () => window.clearInterval(timer)
  }, [active])

  return now
}
