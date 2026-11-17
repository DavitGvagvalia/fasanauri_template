import type { ReactElement } from "react"

import { useLocale, useTranslations } from "next-intl"

import PendingOrderLine from "@/components/features/cart/PendingOrderLine"
import OrderConfirmation from "@/components/features/cart/OrderConfirmation"
import OrderArrival from "@/components/features/cart/OrderArrival"
import { getDemoOrderTotal } from "@/lib/cart/getDemoOrderTotal"
import { formatPrice } from "@/lib/formatPrice"
import { cn } from "@/lib/utils"
import type { IDemoOrder } from "@/types/order"

interface IProps {
  order: IDemoOrder
}

const PendingOrderDetails = ({ order }: IProps): ReactElement => {
  const locale = useLocale()
  const t = useTranslations("PendingOrders")
  const isDeclined = order.status === "declined"

  return (
    <div className="border-t px-4 pb-4">
      {order.declineReason ? (
        <div className="mt-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          <p className="font-semibold">{t("declineReason")}</p>
          <p className="mt-1">{t(order.declineReason)}</p>
          <p className="mt-2 text-xs">{t("noPayment")}</p>
        </div>
      ) : order.status === "confirmationRequired" ? (
        <OrderConfirmation order={order} />
      ) : (
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          {t(
            order.status === "delivered"
              ? "deliveredDescription"
              : order.status === "onTheWay"
                ? "onTheWayDescription"
                : order.status === "confirmed"
                  ? "confirmedDescription"
                  : "awaitingConfirmation"
          )}
        </p>
      )}
      <ul className="mt-2">
        {order.lines.map((line) => (
          <PendingOrderLine
            key={`${line.product.id}:${line.serving}`}
            line={line}
          />
        ))}
      </ul>
      <dl className="mt-3 space-y-3 border-t pt-3 text-sm">
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">{t("foodTotal")}</dt>
          <dd className="tabular-nums">{formatPrice(order.totalMinor, locale)}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">{t("deliveryCost")}</dt>
          <dd className={cn("text-right tabular-nums", isDeclined && "text-destructive")}>
            {isDeclined
              ? t("orderWasDeclined")
              : order.status === "pending" || order.deliveryFeeMinor === null
                ? t("awaitingQuote")
                : formatPrice(order.deliveryFeeMinor, locale)}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">{t("estimatedArrival")}</dt>
          <dd className={cn("text-right", isDeclined && "text-destructive")}>
            {isDeclined ? (
              t("orderWasDeclined")
            ) : order.status === "delivered" ? (
              t("notApplicable")
            ) : (
              <OrderArrival estimatedArrivalAt={order.estimatedArrivalAt} />
            )}
          </dd>
        </div>
        <div className="flex justify-between gap-3 border-t pt-3 font-semibold">
          <dt>
            {t(
              !isDeclined && (order.status === "pending" || order.deliveryFeeMinor === null)
                ? "totalBeforeDelivery"
                : "total"
            )}
          </dt>
          <dd className={cn("text-right tabular-nums", isDeclined && "text-destructive")}>
            {isDeclined
              ? t("orderWasDeclined")
              : formatPrice(
                  order.status === "pending" ? order.totalMinor : getDemoOrderTotal(order),
                  locale
                )}
          </dd>
        </div>
      </dl>
      {order.note && (
        <div className="mt-4 border-t pt-3 text-sm">
          <p className="font-medium">{t("orderNote")}</p>
          <p className="mt-1 whitespace-pre-wrap break-words text-muted-foreground">{order.note}</p>
        </div>
      )}
      {order.status === "pending" && (
        <p className="mt-3 text-xs leading-5 text-muted-foreground">{t("deliveryPending")}</p>
      )}
    </div>
  )
}

export default PendingOrderDetails
