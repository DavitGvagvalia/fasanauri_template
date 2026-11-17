"use client"

import { useEffect } from "react"

import { useCart } from "@/hooks/useCart"
import { scheduleDemoOrderConfirmation } from "@/lib/cart/scheduleDemoOrderConfirmation"

export const useDemoOrderConfirmation = (): void => {
  const ready = useCart((state) => state.ready)
  const requestConfirmation = useCart((state) => state.requestOrderConfirmation)
  useEffect(() => {
    if (!ready) {
      return
    }

    return scheduleDemoOrderConfirmation(requestConfirmation)
  }, [ready, requestConfirmation])
}
