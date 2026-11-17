import type { TBrowserNotificationPermission } from "@/types/notifications"

export const getBrowserNotificationPermission = (): TBrowserNotificationPermission => {
  if (typeof window === "undefined" || !window.isSecureContext || !("Notification" in window)) {
    return "unsupported"
  }

  return window.Notification.permission
}
