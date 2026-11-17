"use client"

import { useSyncExternalStore } from "react"

import { getOrderNoticeLayout } from "@/lib/cart/getOrderNoticeLayout"
import { getOpenSidebarWidths } from "@/lib/cart/getOpenSidebarWidths"
import { ORDER_DRAWER_WIDTH_PX } from "@/constants"
import type { IOrderNoticeLayout } from "@/types/orderNotice"

interface IReturn extends IOrderNoticeLayout {
  rightSidebarWidth: number
}

const subscribe = (listener: () => void): (() => void) => {
  window.addEventListener("resize", listener)
  const observer = new MutationObserver(listener)
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["data-open", "data-side"],
  })

  return () => {
    window.removeEventListener("resize", listener)
    observer.disconnect()
  }
}

const getSnapshot = (): string => {
  const productOpen = Boolean(document.querySelector(".product-dialog[data-open]"))
  const sidebars = getOpenSidebarWidths()

  return `${window.innerWidth}:${Number(productOpen)}:${sidebars.left}:${sidebars.right}`
}

const getServerSnapshot = (): string => {
  return "0:0:0:0"
}

export const useOrderNoticeLayout = (
  count: number,
  orderDrawerOpen = false,
  showPermission = false,
  noticeWidths?: readonly number[],
  permissionCollapsed = false
): IReturn => {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const [width, productOpen, left, right] = snapshot.split(":").map(Number)
  const rightSidebarWidth = Math.max(right, orderDrawerOpen ? ORDER_DRAWER_WIDTH_PX : 0)

  return {
    ...getOrderNoticeLayout(
      count,
      width || 352,
      productOpen === 1,
      orderDrawerOpen,
      showPermission,
      noticeWidths,
      permissionCollapsed,
      { left, right: rightSidebarWidth }
    ),
    rightSidebarWidth,
  }
}
