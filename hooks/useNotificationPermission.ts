"use client"

import { useState, useSyncExternalStore } from "react"

import { NOTIFICATION_DECLINED_ATTRIBUTE, NOTIFICATION_PERMISSION_EVENT } from "@/constants"
import { getBrowserNotificationPermission } from "@/lib/cart/getBrowserNotificationPermission"
import { requestBrowserNotifications } from "@/lib/cart/requestBrowserNotifications"
import { isNotificationReminderHidden } from "@/lib/cart/isNotificationReminderHidden"
import { hideNotificationReminder } from "@/lib/cart/hideNotificationReminder"
import type { TBrowserNotificationPermission } from "@/types/notifications"

interface IReturn {
  permission: TBrowserNotificationPermission
  declined: boolean
  requesting: boolean
  retryBlocked: boolean
  enableNotifications: () => Promise<void>
  declineNotifications: () => void
  dismissHelp: () => void
  reminderHidden: boolean
  hideReminder: () => void
}

const subscribe = (listener: () => void): (() => void) => {
  window.addEventListener(NOTIFICATION_PERMISSION_EVENT, listener)
  window.addEventListener("focus", listener)
  window.addEventListener("storage", listener)

  return () => {
    window.removeEventListener(NOTIFICATION_PERMISSION_EVENT, listener)
    window.removeEventListener("focus", listener)
    window.removeEventListener("storage", listener)
  }
}

const getSnapshot = (): string => {
  return `${getBrowserNotificationPermission()}:${document.documentElement.hasAttribute(NOTIFICATION_DECLINED_ATTRIBUTE)}:${isNotificationReminderHidden()}`
}

const getServerSnapshot = (): string => {
  return "unsupported:false:false"
}

export const useNotificationPermission = (): IReturn => {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const [requesting, setRequesting] = useState(false)
  const [retryBlocked, setRetryBlocked] = useState(false)
  const [permissionValue, declinedValue, hiddenValue] = snapshot.split(":")
  const permission = permissionValue as TBrowserNotificationPermission
  const declined = permission === "denied" || declinedValue === "true"

  const enableNotifications = async (): Promise<void> => {
    if (requesting) {
      return
    }
    setRequesting(true)
    const result = await requestBrowserNotifications()
    setRequesting(false)
    setRetryBlocked(result === "denied" || (declined && result === "default"))
    document.documentElement.toggleAttribute(NOTIFICATION_DECLINED_ATTRIBUTE, result !== "granted")
    window.dispatchEvent(new Event(NOTIFICATION_PERMISSION_EVENT))
  }

  const declineNotifications = (): void => {
    document.documentElement.setAttribute(NOTIFICATION_DECLINED_ATTRIBUTE, "")
    window.dispatchEvent(new Event(NOTIFICATION_PERMISSION_EVENT))
  }

  const dismissHelp = (): void => {
    setRetryBlocked(false)
  }

  return {
    permission,
    declined,
    requesting,
    retryBlocked,
    enableNotifications,
    declineNotifications,
    dismissHelp,
    reminderHidden: hiddenValue === "true",
    hideReminder: hideNotificationReminder,
  }
}
