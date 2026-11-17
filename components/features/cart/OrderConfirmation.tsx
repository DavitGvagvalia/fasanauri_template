"use client"

import type { ReactElement } from "react"

import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/useCart"
import type { IDemoOrder } from "@/types/order"

interface IProps {
  order: IDemoOrder
}

const OrderConfirmation = ({ order }: IProps): ReactElement => {
  const t = useTranslations("PendingOrders")
  const confirmOrder = useCart((state) => state.confirmOrder)

  const confirm = (): void => {
    confirmOrder(order.id)
  }

  return (
    <div className="mt-4 rounded-md border border-primary/30 bg-accent p-3">
      <p className="text-sm font-semibold">{t("confirmationRequired")}</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{t("reconfirmDescription")}</p>
      <Button
        onClick={confirm}
        disabled={order.deliveryFeeMinor === null}
        className="mt-3 h-10 w-full rounded-sm whitespace-normal"
      >
        {t("confirmUpdatedTotal")}
      </Button>
    </div>
  )
}

export default OrderConfirmation
