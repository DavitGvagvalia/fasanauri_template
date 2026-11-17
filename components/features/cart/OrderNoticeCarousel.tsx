"use client"

import type { KeyboardEvent, ReactElement } from "react"

import { useTranslations } from "next-intl"

import OrderNoticeControls from "@/components/features/cart/OrderNoticeControls"
import OrderNoticeItem from "@/components/features/cart/OrderNoticeItem"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { useOrderNoticeCarousel } from "@/hooks/useOrderNoticeCarousel"
import type { IDemoOrder } from "@/types/order"
import type { IOrderNoticeCollapse } from "@/types/orderNotice"
import {
  ORDER_NOTICE_COLLAPSED_SIZE_PX,
  ORDER_NOTICE_GAP_PX,
  ORDER_NOTICE_WIDTH_PX,
} from "@/constants"
import { cn } from "@/lib/utils"

interface IProps {
  orders: IDemoOrder[]
  compact?: boolean
  collapse: IOrderNoticeCollapse
  width: number
  inline?: boolean
}

const OrderNoticeCarousel = ({
  orders,
  compact = false,
  collapse,
  width,
  inline = false,
}: IProps): ReactElement => {
  const t = useTranslations("PendingOrders")
  const { setApi, selectedIndex, selectIndex } = useOrderNoticeCarousel(orders)

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (inline) {
      return
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault()
      selectIndex(
        (selectedIndex + (event.key === "ArrowLeft" ? -1 : 1) + orders.length) % orders.length
      )
    }
  }

  return (
    <Carousel
      setApi={setApi}
      opts={{ active: !inline, loop: orders.length > 1, watchDrag: !inline }}
      aria-label={t("activeOrders")}
      aria-roledescription={inline ? undefined : t("carousel")}
      className={cn(
        "flex flex-col [&_[data-slot=carousel-content]]:rounded-lg",
        inline
          ? "[&_[data-slot=carousel-content]]:overflow-visible"
          : "[&_[data-slot=carousel-content]]:touch-pan-y [&_[data-slot=carousel-content]]:overflow-x-clip [&_[data-slot=carousel-content]]:overflow-y-visible"
      )}
      onKeyDownCapture={handleKeyDown}
    >
      <CarouselContent
        className={cn(inline ? "ml-0 flex-row-reverse items-end gap-3" : "-ml-3 select-none")}
      >
        {orders.map((order, index) => (
          <CarouselItem
            key={order.id}
            className={cn(
              "flex items-end justify-end transition-[width] duration-300 ease-[var(--drawer-motion-easing)] motion-reduce:transition-none",
              inline ? "basis-auto pl-0" : "basis-auto pl-3"
            )}
            style={{
              width:
                (collapse.isCollapsed(order)
                  ? ORDER_NOTICE_COLLAPSED_SIZE_PX
                  : inline
                    ? ORDER_NOTICE_WIDTH_PX
                    : width) + (inline ? 0 : ORDER_NOTICE_GAP_PX),
            }}
            aria-hidden={(!inline && index !== selectedIndex) || undefined}
            aria-label={t("orderNumber", { number: order.id })}
            aria-roledescription={t("slide")}
          >
            <OrderNoticeItem
              order={order}
              collapse={collapse}
              width={inline ? ORDER_NOTICE_WIDTH_PX : width}
              active={inline || index === selectedIndex}
              compact={compact}
              compactControls={compact && !inline && orders.length > 1}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      {!inline && orders.length > 1 && (
        <OrderNoticeControls
          orders={orders}
          selectedIndex={selectedIndex}
          onSelect={selectIndex}
          compact={compact}
        />
      )}
    </Carousel>
  )
}

export default OrderNoticeCarousel
