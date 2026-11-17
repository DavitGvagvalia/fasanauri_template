export const NOTIFICATION_PERMISSION_EVENT = "order-notification-permission-change"
export const NOTIFICATION_DECLINED_ATTRIBUTE = "data-order-notifications-declined"
export const NOTIFICATION_REMINDER_HIDDEN_ATTRIBUTE = "data-order-notification-reminder-hidden"
export const NOTIFICATION_REMINDER_STORAGE_KEY = "pasanauri.notificationReminderHidden"

export const NOTIFICATION_BROWSER_GUIDES = {
  firefox: {
    name: "notificationBrowserFirefox",
    first: "notificationsFirefoxStep1",
    second: "notificationsFirefoxStep2",
  },
  chrome: {
    name: "notificationBrowserChrome",
    first: "notificationsChromeStep1",
    second: "notificationsChromeStep2",
  },
  edge: {
    name: "notificationBrowserEdge",
    first: "notificationsEdgeStep1",
    second: "notificationsEdgeStep2",
  },
  safari: {
    name: "notificationBrowserSafari",
    first: "notificationsSafariStep1",
    second: "notificationsSafariStep2",
  },
  other: {
    name: "notificationBrowserOther",
    first: "notificationsOtherStep1",
    second: "notificationsOtherStep2",
  },
} as const
