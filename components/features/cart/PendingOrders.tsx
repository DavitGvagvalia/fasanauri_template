"use client"

import type { ReactElement } from "react"

import { Clock3 } from "lucide-react"
import { useTranslations } from "next-intl"

import PendingOrderGroup from "@/components/features/cart/PendingOrderGroup"
import { useCart } from "@/hooks/useCart"
import { getOrderGroups } from "@/lib/cart/getOrderGroups"

const PendingOrders = (): ReactElement => {
  const t = useTranslations("PendingOrders")
  const orders = useCart((state) => state.pendingOrders)

  return (
    <section
      aria-label={t("title")}
      className="space-y-4"
    >
      {orders.length > 0 ? (
        <>
          {getOrderGroups(orders).map((group) => (
            <PendingOrderGroup
              key={group.heading}
              group={group}
            />
          ))}
        </>
      ) : (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <Clock3
            aria-hidden="true"
            className="size-10 text-muted-foreground"
          />
          <h2 className="text-lg font-medium">{t("emptyTitle")}</h2>
          <p className="max-w-xs text-sm leading-6 text-muted-foreground">
            {t("emptyDescription")}
          </p>
        </div>
      )}
    </section>
  )
}

export default PendingOrders
