import type { ReactElement } from "react"

import { BellRing, Clock3, Truck } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import { getDemoOrderTotal } from "@/lib/cart/getDemoOrderTotal"
import { formatPrice } from "@/lib/formatPrice"
import type { IDemoOrder } from "@/types/order"
import { cn } from "@/lib/utils"
import OrderArrival from "@/components/features/cart/OrderArrival"

interface IProps {
  order: IDemoOrder
  onSelect: () => void
  active?: boolean
  compact?: boolean
  compactControls?: boolean
}

const PendingOrderNotice = ({
  order,
  onSelect,
  active = true,
  compact = false,
  compactControls = false,
}: IProps): ReactElement => {
  const locale = useLocale()
  const t = useTranslations("PendingOrders")
  const StatusIcon = order.status === "onTheWay" ? Truck : Clock3

  return (
    <button
      type="button"
      tabIndex={active ? 0 : -1}
      data-slot="pending-order-notice"
      onClick={onSelect}
      aria-label={t("selectOrder", { number: order.id, status: t(order.status) })}
      aria-haspopup="dialog"
      className={cn(
        "flex w-full flex-col justify-between rounded-lg border border-border bg-popover text-left text-popover-foreground outline-none transition-[background-color,box-shadow] duration-300 hover:bg-accent hover:shadow-xl focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-inset active:bg-accent motion-reduce:transition-none",
        compact ? "compact-order-notice h-[calc(10dvh-12px)] gap-0.5 p-1.5" : "h-full gap-3 p-3",
        compact && (compactControls ? "pr-20" : "pr-8")
      )}
    >
      <span
        className={cn(
          "flex w-full items-center gap-2",
          !compact && "w-[calc(100%-1.75rem)]",
          order.status === "confirmationRequired" &&
            "rounded-md bg-confirmation text-confirmation-foreground transition-colors duration-300 group-hover/notice:bg-primary/80 group-focus-within/notice:bg-primary/80 motion-reduce:transition-none",
          order.status === "confirmationRequired" && (compact ? "px-1.5" : "px-2.5 py-1.5")
        )}
      >
        {order.status === "confirmationRequired" ? (
          <BellRing
            aria-hidden="true"
            className="confirmation-bell size-4 shrink-0"
          />
        ) : (
          <StatusIcon
            aria-hidden="true"
            className="size-4 shrink-0"
          />
        )}
        <span
          className={cn(
            "min-w-0 truncate whitespace-nowrap",
            compact ? "truncate text-xs font-bold" : "text-xs font-semibold"
          )}
        >
          {t(order.status === "confirmationRequired" ? "orderRequiresConfirmation" : order.status)}
        </span>
      </span>
      <span
        className={cn(
          "flex w-full justify-between gap-3",
          compact ? "compact-order-meta text-xs" : "items-center text-xs"
        )}
      >
        <span className="truncate text-muted-foreground">
          <OrderArrival estimatedArrivalAt={order.estimatedArrivalAt} />
        </span>
        <span className="shrink-0 font-semibold tabular-nums">
          {formatPrice(getDemoOrderTotal(order), locale)}
        </span>
      </span>
    </button>
  )
}

export default PendingOrderNotice
