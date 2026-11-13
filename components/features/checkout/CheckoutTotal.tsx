"use client"

import { useTranslations } from "next-intl"
import type { ReactElement } from "react"

import CartSummary from "@/components/features/cart/CartSummary"
import { Skeleton } from "@/components/ui/skeleton"
import { useCart } from "@/hooks/useCart"

const CheckoutTotal = (): ReactElement => {
  const t = useTranslations("Cart")
  const ready = useCart((state) => state.ready)

  return (
    <section
      aria-label={t("total")}
      className="rounded-xl border bg-background p-5 sm:p-6"
    >
      {ready ? (
        <CartSummary />
      ) : (
        <div
          role="status"
          aria-label={t("loading")}
          className="space-y-3 py-2"
        >
          <Skeleton className="h-5 w-28" />
          <div className="flex justify-between gap-3">
            <span className="text-lg font-semibold">{t("total")}</span>
            <Skeleton className="h-7 w-24" />
          </div>
        </div>
      )}
    </section>
  )
}

export default CheckoutTotal
