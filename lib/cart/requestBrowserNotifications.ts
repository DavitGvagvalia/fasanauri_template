import { getBrowserNotificationPermission } from "@/lib/cart/getBrowserNotificationPermission"
import type { TBrowserNotificationPermission } from "@/types/notifications"

export const requestBrowserNotifications = async (): Promise<TBrowserNotificationPermission> => {
  const permission = getBrowserNotificationPermission()
  if (permission === "unsupported" || permission === "granted") {
    return permission
  }
  try {
    return await window.Notification.requestPermission()
  } catch {
    return getBrowserNotificationPermission()
  }
}
