"use client"

import { useState } from "react"

import { getCollapsedNoticeKeys } from "@/lib/cart/getCollapsedNoticeKeys"
import type { IDemoOrder } from "@/types/order"
import type { IOrderNoticePresentation } from "@/types/orderNotice"

// preserves keyboard focus when collapse switches between row and carousel.
const focusNotice = (key: string, collapsed: boolean): void => {
  requestAnimationFrame(() => {
    const frame = document.querySelector(`[data-notice-key="${key}"]`)
    frame
      ?.querySelector<HTMLButtonElement>(
        collapsed ? "[data-slot=notice-expand]" : "[data-slot=notice-content] button"
      )
      ?.focus()
  })
}

export const useOrderNoticePresentation = (
  orders: readonly IDemoOrder[]
): IOrderNoticePresentation => {
  const [collapsedOrders, setCollapsedOrders] = useState<ReadonlySet<string>>(new Set())
  const [permissionCollapsed, setPermissionCollapsed] = useState(false)

  const isCollapsed = (order: IDemoOrder): boolean => {
    return collapsedOrders.has(`${order.id}:${order.status}`)
  }

  const collapseOrder = (order: IDemoOrder): void => {
    setCollapsedOrders((current) =>
      getCollapsedNoticeKeys(current, orders, order, window.innerWidth)
    )
    focusNotice(`${order.id}:${order.status}`, true)
  }

  const expandOrder = (order: IDemoOrder): void => {
    setCollapsedOrders((current) =>
      getCollapsedNoticeKeys(current, orders, order, window.innerWidth, false)
    )
    focusNotice(`${order.id}:${order.status}`, false)
  }

  const collapsePermission = (): void => {
    setPermissionCollapsed(true)
    focusNotice("permission", true)
  }

  const expandPermission = (): void => {
    setPermissionCollapsed(false)
    focusNotice("permission", false)
  }

  return {
    isCollapsed,
    collapseOrder,
    expandOrder,
    permissionCollapsed,
    collapsePermission,
    expandPermission,
  }
}
