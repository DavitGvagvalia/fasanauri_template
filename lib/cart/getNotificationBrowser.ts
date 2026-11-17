import type { TNotificationBrowser } from "@/types/notifications"

export const getNotificationBrowser = (userAgent: string): TNotificationBrowser => {
  if (userAgent.includes("Firefox/") || userAgent.includes("FxiOS/")) {
    return "firefox"
  }
  if (userAgent.includes("Edg/") || userAgent.includes("EdgA/") || userAgent.includes("EdgiOS/")) {
    return "edge"
  }
  if (
    userAgent.includes("OPR/") ||
    userAgent.includes("SamsungBrowser/") ||
    userAgent.includes("Vivaldi/")
  ) {
    return "other"
  }
  if (userAgent.includes("Chrome/") || userAgent.includes("CriOS/")) {
    return "chrome"
  }
  if (userAgent.includes("Safari/")) {
    return "safari"
  }

  return "other"
}
