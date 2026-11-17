import {
  NOTIFICATION_PERMISSION_EVENT,
  NOTIFICATION_REMINDER_HIDDEN_ATTRIBUTE,
  NOTIFICATION_REMINDER_STORAGE_KEY,
} from "@/constants"

export const hideNotificationReminder = (): void => {
  document.documentElement.setAttribute(NOTIFICATION_REMINDER_HIDDEN_ATTRIBUTE, "")
  try {
    window.localStorage.setItem(NOTIFICATION_REMINDER_STORAGE_KEY, "true")
  } catch {
    // the page attribute preserves dismissal when browser storage is unavailable.
  }
  window.dispatchEvent(new Event(NOTIFICATION_PERMISSION_EVENT))
}
