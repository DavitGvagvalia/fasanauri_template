import {
  ORDER_DRAWER_WIDTH_PX,
  ORDER_NOTICE_COLLAPSED_SIZE_PX,
  ORDER_MOBILE_BREAKPOINT_PX,
  ORDER_NOTICE_GAP_PX,
  ORDER_NOTICE_WIDTH_PX,
} from "@/constants"
import type { INoticeSidebarWidths, IOrderNoticeLayout } from "@/types/orderNotice"

export const getOrderNoticeLayout = (
  count: number,
  viewportWidth: number,
  productDrawerOpen = false,
  orderDrawerOpen = false,
  showPermission = false,
  noticeWidths?: readonly number[],
  permissionCollapsed = false,
  sidebars: INoticeSidebarWidths = { left: 0, right: 0 }
): IOrderNoticeLayout => {
  const mobile = viewportWidth < ORDER_MOBILE_BREAKPOINT_PX
  const compact = mobile && productDrawerOpen
  const gutters = compact ? 16 : mobile ? 32 : 64
  const sidebarWidth =
    sidebars.left + Math.max(sidebars.right, orderDrawerOpen ? ORDER_DRAWER_WIDTH_PX : 0)
  const available = Math.max(1, viewportWidth - gutters - (!mobile ? sidebarWidth : 0))
  const widths = Array.from(
    { length: Math.max(1, count) },
    (_, index) => noticeWidths?.[index] ?? ORDER_NOTICE_WIDTH_PX
  )
  const needed =
    widths.reduce((total, width) => total + width, 0) + Math.max(0, count - 1) * ORDER_NOTICE_GAP_PX
  const largest = Math.max(...widths)
  const permissionCardWidth = permissionCollapsed
    ? ORDER_NOTICE_COLLAPSED_SIZE_PX
    : ORDER_NOTICE_WIDTH_PX
  const permissionInline =
    !mobile && showPermission && available >= permissionCardWidth + largest + ORDER_NOTICE_GAP_PX
  const reservedPermissionWidth = permissionInline ? permissionCardWidth + ORDER_NOTICE_GAP_PX : 0
  const permissionWidth = showPermission ? Math.min(permissionCardWidth, available) : 0
  const noticeAvailable = available - reservedPermissionWidth
  const inline = needed <= noticeAvailable && !compact
  const noticeWidth = compact ? available : inline ? needed : Math.min(largest, noticeAvailable)

  return {
    compact,
    hidden: mobile && (productDrawerOpen || sidebarWidth > 0),
    inline,
    permissionInline,
    permissionWidth,
    noticeWidth,
    width: permissionInline
      ? noticeWidth + reservedPermissionWidth
      : Math.max(noticeWidth, permissionWidth),
  }
}
