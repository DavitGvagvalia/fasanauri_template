import assert from "node:assert/strict"
import { test } from "node:test"

import { getBrowserNotificationPermission } from "@/lib/cart/getBrowserNotificationPermission"
import { requestBrowserNotifications } from "@/lib/cart/requestBrowserNotifications"

test("unsupported or insecure environments never request native notification permission", async (context) => {
  context.after(() => Reflect.deleteProperty(globalThis, "window"))
  assert.equal(getBrowserNotificationPermission(), "unsupported")
  let calls = 0
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      isSecureContext: false,
      Notification: {
        permission: "default",
        requestPermission: async (): Promise<NotificationPermission> => {
          calls += 1
          return "granted"
        },
      },
    },
  })

  assert.equal(await requestBrowserNotifications(), "unsupported")
  assert.equal(calls, 0)
})

test("a user can explicitly retry denial and granted permission does not prompt again", async (context) => {
  context.after(() => Reflect.deleteProperty(globalThis, "window"))
  let calls = 0
  const notifications = {
    permission: "default" as NotificationPermission,
    requestPermission: async (): Promise<NotificationPermission> => {
      calls += 1
      notifications.permission = calls === 1 ? "denied" : "granted"

      return notifications.permission
    },
  }
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: { isSecureContext: true, Notification: notifications },
  })

  assert.equal(await requestBrowserNotifications(), "denied")
  assert.equal(getBrowserNotificationPermission(), "denied")
  assert.equal(await requestBrowserNotifications(), "granted")
  assert.equal(await requestBrowserNotifications(), "granted")
  assert.equal(calls, 2)
})

test("blocked retries and rejected permission requests preserve their actual browser status", async (context) => {
  context.after(() => Reflect.deleteProperty(globalThis, "window"))
  const notifications = {
    permission: "denied" as NotificationPermission,
    requestPermission: async (): Promise<NotificationPermission> => {
      return "denied"
    },
  }
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: { isSecureContext: true, Notification: notifications },
  })

  assert.equal(await requestBrowserNotifications(), "denied")
  notifications.permission = "default"
  notifications.requestPermission = async (): Promise<NotificationPermission> => {
    throw new Error("Browser blocked the request")
  }
  assert.equal(await requestBrowserNotifications(), "default")
})
