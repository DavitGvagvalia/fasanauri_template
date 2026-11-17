import type { ReactElement } from "react"

import { ChevronDown } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import PendingOrderDetails from "@/components/features/cart/PendingOrderDetails"
import OrderStatusBadge from "@/components/features/cart/OrderStatusBadge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { getDemoOrderTotal } from "@/lib/cart/getDemoOrderTotal"
import { formatPrice } from "@/lib/formatPrice"
import type { IDemoOrder } from "@/types/order"
import { ORDER_TIME_ZONE } from "@/constants"

interface IProps {
  order: IDemoOrder
  selected: boolean
  onSelect: () => void
}

const PendingOrderCard = ({ order, selected, onSelect }: IProps): ReactElement => {
  const locale = useLocale()
  const t = useTranslations("PendingOrders")

  return (
    <article
      className={cn(
        "overflow-hidden rounded-lg border bg-card transition-[border-color] duration-300 hover:border-primary/40 motion-reduce:transition-none",
        selected && "border-primary/40"
      )}
    >
      <h3>
        <Button
          variant="ghost"
          onClick={onSelect}
          aria-expanded={selected}
          aria-controls={`pending-order-${order.id}`}
          className="h-auto w-full flex-col items-stretch gap-3 rounded-none border-0 bg-muted/60 bg-clip-border p-4 text-left whitespace-normal transition-colors duration-300 ease-in-out hover:bg-accent active:not-aria-[haspopup]:translate-y-0 active:bg-primary/10 motion-reduce:transition-none"
        >
          <span className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-semibold">{t("orderNumber", { number: order.id })}</span>
            <OrderStatusBadge status={order.status} />
          </span>
          <time
            dateTime={order.createdAt}
            className="text-xs text-muted-foreground"
          >
            {new Intl.DateTimeFormat(locale, {
              dateStyle: "medium",
              timeStyle: "short",
              timeZone: ORDER_TIME_ZONE,
            }).format(new Date(order.createdAt))}
          </time>
          <span className="flex items-center justify-between gap-3 text-sm">
            <span className="text-muted-foreground">{t("itemCount", { count: order.count })}</span>
            <span className="ml-auto font-semibold tabular-nums">
              {formatPrice(getDemoOrderTotal(order), locale)}
            </span>
            <ChevronDown
              aria-hidden="true"
              className={cn(
                "size-4 transition-transform motion-reduce:transition-none",
                selected && "rotate-180"
              )}
            />
          </span>
        </Button>
      </h3>
      <div
        id={`pending-order-${order.id}`}
        aria-hidden={!selected}
        inert={!selected}
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-300 ease-in-out motion-reduce:transition-none",
          selected ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <PendingOrderDetails order={order} />
        </div>
      </div>
    </article>
  )
}

export default PendingOrderCard
