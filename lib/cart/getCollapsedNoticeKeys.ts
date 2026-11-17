import { ORDER_MOBILE_BREAKPOINT_PX } from "@/constants"
import type { IDemoOrder } from "@/types/order"

export const getCollapsedNoticeKeys = (
  current: ReadonlySet<string>,
  orders: readonly IDemoOrder[],
  selected: IDemoOrder,
  viewportWidth: number,
  collapsed = true
): ReadonlySet<string> => {
  const targets = viewportWidth < ORDER_MOBILE_BREAKPOINT_PX ? orders : [selected]
  const next = new Set(current)
  for (const order of targets) {
    const key = `${order.id}:${order.status}`
    if (collapsed) {
      next.add(key)
    } else {
      next.delete(key)
    }
  }

  return next
}
