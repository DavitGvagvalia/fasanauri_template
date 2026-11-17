import type { ReactElement } from "react"

import { BellRing, Clock3, Truck } from "lucide-react"
import { useTranslations } from "next-intl"

import CollapsibleNoticeFrame from "@/components/features/cart/CollapsibleNoticeFrame"
import NoticeCollapseButton from "@/components/features/cart/NoticeCollapseButton"
import PendingOrderNotice from "@/components/features/cart/PendingOrderNotice"
import { useCart } from "@/hooks/useCart"
import type { IDemoOrder } from "@/types/order"
import type { IOrderNoticeCollapse } from "@/types/orderNotice"

interface IProps {
  order: IDemoOrder
  collapse: IOrderNoticeCollapse
  width: number
  active?: boolean
  compact?: boolean
  compactControls?: boolean
}

const OrderNoticeItem = ({
  order,
  collapse,
  width,
  active = true,
  compact = false,
  compactControls = false,
}: IProps): ReactElement => {
  const t = useTranslations("PendingOrders")
  const openOrder = useCart((state) => state.openOrder)
  const label = t("selectOrder", { number: order.id, status: t(order.status) })

  return (
    <CollapsibleNoticeFrame
      noticeKey={`${order.id}:${order.status}`}
      collapsed={collapse.isCollapsed(order)}
      onExpand={() => collapse.expandOrder(order)}
      icon={
        order.status === "confirmationRequired"
          ? BellRing
          : order.status === "onTheWay"
            ? Truck
            : Clock3
      }
      label={label}
      width={width}
      height={compact ? "calc(10dvh - 12px)" : undefined}
      attention={order.status === "confirmationRequired"}
      active={active}
    >
      <PendingOrderNotice
        order={order}
        onSelect={() => openOrder(order.id)}
        active={active}
        compact={compact}
        compactControls={compactControls}
      />
      <NoticeCollapseButton
        onCollapse={() => collapse.collapseOrder(order)}
        className={
          compact ? (compactControls ? "top-1 right-14" : "top-1 right-1") : "top-4 right-3"
        }
      />
    </CollapsibleNoticeFrame>
  )
}

export default OrderNoticeItem
