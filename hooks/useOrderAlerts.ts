"use client"

import { useEffect, useRef } from "react"
import { useTranslations } from "next-intl"

import { useCart } from "@/hooks/useCart"
import { playOrderAlertSound } from "@/lib/cart/playOrderAlertSound"
import { showOrderBrowserNotification } from "@/lib/cart/showOrderBrowserNotification"
import type { TOrderStatus } from "@/types/order"

export const useOrderAlerts = (): void => {
  const t = useTranslations("PendingOrders")
  const orders = useCart((state) => state.pendingOrders)
  const ready = useCart((state) => state.ready)
  const openOrder = useCart((state) => state.openOrder)
  const previous = useRef<Map<number, TOrderStatus> | null>(null)
  const audio = useRef<AudioContext | null>(null)
  useEffect(() => {
    const unlockAudio = async (): Promise<void> => {
      if (!("AudioContext" in window)) {
        return
      }
      try {
        audio.current ??= new AudioContext()
        if (audio.current.state === "suspended") {
          await audio.current.resume()
        }
      } catch {
        // browser audio policies may block sound while visual alerts remain available.
      }
    }
    window.addEventListener("pointerdown", unlockAudio)
    window.addEventListener("keydown", unlockAudio)

    return () => {
      window.removeEventListener("pointerdown", unlockAudio)
      window.removeEventListener("keydown", unlockAudio)
      const context = audio.current
      audio.current = null
      if (context) {
        void context.close()
      }
    }
  }, [])
  useEffect(() => {
    if (!ready) {
      return
    }
    const prior = previous.current
    previous.current = new Map(orders.map((order) => [order.id, order.status]))
    if (!prior) {
      return
    }
    for (const order of orders) {
      if (order.status !== "confirmationRequired" || prior.get(order.id) !== "pending") {
        continue
      }
      const title = t("confirmationRequired")
      const body = t("confirmationAlert", { number: order.id })
      const view = (): void => openOrder(order.id)
      if (audio.current) {
        playOrderAlertSound(audio.current)
      }
      showOrderBrowserNotification(title, body, order.id, view)
    }
  }, [orders, ready, openOrder, t])
}
