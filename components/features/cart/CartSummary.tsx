"use client"

import type { ReactElement } from "react"

import { useLocale, useTranslations } from "next-intl"
import { useCart } from "@/hooks/useCart"
import { formatPrice } from "@/lib/formatPrice"

const CartSummary = (): ReactElement => {
  const locale = useLocale()
  const t = useTranslations("Cart")
  const count = useCart((state) => state.count)
  const totalMinor = useCart((state) => state.totalMinor)

  return (
    <div
      aria-live="polite"
      className="space-y-3 py-2"
    >
      <p className="text-sm text-muted-foreground">{t("itemCount", { count })}</p>
      <div className="flex items-center justify-between gap-3 text-lg font-semibold">
        <span>{t("total")}</span>
        <span className="tabular-nums">{formatPrice(totalMinor, locale)}</span>
      </div>
    </div>
  )
}

export default CartSummary
