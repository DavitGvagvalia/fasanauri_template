"use client"

import type { ReactElement } from "react"
import { useMemo } from "react"
import { useTranslations } from "next-intl"

import OrderNoticeCarousel from "@/components/features/cart/OrderNoticeCarousel"
import OrderNotificationPermission from "@/components/features/cart/OrderNotificationPermission"
import CollapsibleNoticeFrame from "@/components/features/cart/CollapsibleNoticeFrame"
import { useCart } from "@/hooks/useCart"
import { useOrderAlerts } from "@/hooks/useOrderAlerts"
import { useNotificationDock } from "@/hooks/useNotificationDock"
import { getImportantOrders } from "@/lib/cart/getImportantOrders"
import { useOrderNoticeLayout } from "@/hooks/useOrderNoticeLayout"
import { useNotificationPermission } from "@/hooks/useNotificationPermission"
import { ORDER_NOTICE_COLLAPSED_SIZE_PX, ORDER_NOTICE_WIDTH_PX } from "@/constants"
import { BellOff } from "lucide-react"
import { useOrderNoticePresentation } from "@/hooks/useOrderNoticePresentation"
import { cn } from "@/lib/utils"

const OrderNotifications = (): ReactElement | null => {
  const orders = useCart((state) => state.pendingOrders)
  const cartOpen = useCart((state) => state.cartOpen)
  const t = useTranslations("PendingOrders")
  const activeOrders = useMemo(() => getImportantOrders(orders), [orders])
  const { permission, reminderHidden } = useNotificationPermission()
  const presentation = useOrderNoticePresentation(activeOrders)
  const showPermission = !reminderHidden && permission !== "granted" && permission !== "unsupported"
  const noticeWidths = activeOrders.map((order) =>
    presentation.isCollapsed(order) ? ORDER_NOTICE_COLLAPSED_SIZE_PX : ORDER_NOTICE_WIDTH_PX
  )
  const layout = useOrderNoticeLayout(
    activeOrders.length,
    cartOpen,
    showPermission,
    noticeWidths,
    presentation.permissionCollapsed
  )
  useOrderAlerts()
  const dock = useNotificationDock(activeOrders.length > 0 && !layout.hidden)

  if (activeOrders.length === 0 || layout.hidden) {
    return null
  }
  const permissionCard =
    showPermission && !layout.compact ? (
      <CollapsibleNoticeFrame
        noticeKey="permission"
        collapsed={presentation.permissionCollapsed}
        onExpand={presentation.expandPermission}
        icon={BellOff}
        label={t("enableNotifications")}
        width={layout.permissionWidth}
      >
        <OrderNotificationPermission
          floating
          onCollapse={presentation.collapsePermission}
        />
      </CollapsibleNoticeFrame>
    ) : null

  return (
    <div
      ref={dock}
      data-compact={layout.compact || undefined}
      role="region"
      aria-label={t("activeOrders")}
      aria-live="polite"
      style={{
        width: layout.width,
        right: layout.rightSidebarWidth ? layout.rightSidebarWidth + 32 : undefined,
      }}
      className={cn(
        "order-notification-dock pointer-events-auto fixed right-4 bottom-4 z-60 flex gap-3 sm:right-8 sm:bottom-8",
        layout.permissionInline ? "items-end" : "flex-col items-end"
      )}
    >
      {permissionCard}
      <div
        style={{ width: layout.noticeWidth }}
        className="min-w-0 shrink-0 transition-[width] duration-300 motion-reduce:transition-none"
      >
        <OrderNoticeCarousel
          orders={activeOrders}
          compact={layout.compact}
          collapse={presentation}
          width={layout.noticeWidth}
          inline={layout.inline}
        />
      </div>
    </div>
  )
}

export default OrderNotifications
