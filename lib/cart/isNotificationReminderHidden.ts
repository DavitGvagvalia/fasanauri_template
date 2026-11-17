import {
  NOTIFICATION_REMINDER_HIDDEN_ATTRIBUTE,
  NOTIFICATION_REMINDER_STORAGE_KEY,
} from "@/constants"

export const isNotificationReminderHidden = (): boolean => {
  if (typeof window === "undefined") {
    return false
  }
  if (
    typeof document !== "undefined" &&
    document.documentElement.hasAttribute(NOTIFICATION_REMINDER_HIDDEN_ATTRIBUTE)
  ) {
    return true
  }
  try {
    return window.localStorage.getItem(NOTIFICATION_REMINDER_STORAGE_KEY) === "true"
  } catch {
    return false
  }
}
