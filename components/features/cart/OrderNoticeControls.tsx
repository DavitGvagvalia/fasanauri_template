import type { ReactElement } from "react"

import { useTranslations } from "next-intl"

import { CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import type { IDemoOrder } from "@/types/order"
import { cn } from "@/lib/utils"

interface IProps {
  orders: IDemoOrder[]
  selectedIndex: number
  onSelect: (index: number) => void
  compact?: boolean
}

const OrderNoticeControls = ({
  orders,
  selectedIndex,
  onSelect,
  compact = false,
}: IProps): ReactElement => {
  const t = useTranslations("PendingOrders")
  const requiredCount = orders.filter((order) => order.status === "confirmationRequired").length

  const previous = (): void => {
    onSelect((selectedIndex + orders.length - 1) % orders.length)
  }

  const next = (): void => {
    onSelect((selectedIndex + 1) % orders.length)
  }

  return (
    <div
      className={cn(
        "flex items-center justify-between text-popover-foreground",
        compact
          ? "absolute inset-y-0 right-1 z-10 gap-0"
          : "mt-2 min-h-8 gap-2 sm:order-first sm:mt-0 sm:mb-2 sm:px-3"
      )}
    >
      <CarouselPrevious
        aria-label={t("previousOrder")}
        onClick={previous}
        variant="ghost"
        className={cn(
          "static inset-auto my-0 translate-y-0 rounded-lg",
          compact ? "size-6" : "size-8"
        )}
      />
      <div
        aria-live="polite"
        className={cn(
          "flex min-w-0 flex-wrap items-center justify-center gap-2 text-xs",
          compact && "sr-only"
        )}
      >
        <span
          className={cn(
            "tabular-nums",
            requiredCount > 0
              ? "rounded-md bg-confirmation px-2 py-1 text-confirmation-foreground"
              : "text-muted-foreground"
          )}
        >
          {t(requiredCount > 0 ? "confirmationPosition" : "orderPosition", {
            current: selectedIndex + 1,
            total: orders.length,
            count: requiredCount,
          })}
        </span>
      </div>
      <CarouselNext
        aria-label={t("nextOrder")}
        onClick={next}
        variant="ghost"
        className={cn(
          "static inset-auto my-0 translate-y-0 rounded-lg",
          compact ? "size-6" : "size-8"
        )}
      />
    </div>
  )
}

export default OrderNoticeControls
