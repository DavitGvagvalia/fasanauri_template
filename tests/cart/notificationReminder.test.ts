import assert from "node:assert/strict"
import { test } from "node:test"

import { NOTIFICATION_PERMISSION_EVENT, NOTIFICATION_REMINDER_STORAGE_KEY } from "@/constants"
import { hideNotificationReminder } from "@/lib/cart/hideNotificationReminder"
import { isNotificationReminderHidden } from "@/lib/cart/isNotificationReminderHidden"

test("do not show again persists across page sessions and announces the preference change", (context) => {
  const saved = new Map<string, string>()
  const attributes = new Set<string>()
  const events: string[] = []
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      localStorage: {
        getItem: (key: string): string | null => saved.get(key) ?? null,
        setItem: (key: string, value: string): void => {
          saved.set(key, value)
        },
      },
      dispatchEvent: (event: Event): boolean => {
        events.push(event.type)
        return true
      },
    },
  })
  Object.defineProperty(globalThis, "document", {
    configurable: true,
    value: {
      documentElement: {
        hasAttribute: (key: string): boolean => attributes.has(key),
        setAttribute: (key: string): void => {
          attributes.add(key)
        },
      },
    },
  })
  context.after(() => {
    Reflect.deleteProperty(globalThis, "window")
    Reflect.deleteProperty(globalThis, "document")
  })

  assert.equal(isNotificationReminderHidden(), false)
  hideNotificationReminder()
  assert.equal(saved.get(NOTIFICATION_REMINDER_STORAGE_KEY), "true")
  assert.deepEqual(events, [NOTIFICATION_PERMISSION_EVENT])
  attributes.clear()
  assert.equal(isNotificationReminderHidden(), true)
})

test("blocked storage still allows hiding the reminder for the current page", (context) => {
  const attributes = new Set<string>()
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      get localStorage(): Storage {
        throw new Error("Storage blocked")
      },
      dispatchEvent: (): boolean => true,
    },
  })
  Object.defineProperty(globalThis, "document", {
    configurable: true,
    value: {
      documentElement: {
        hasAttribute: (key: string): boolean => attributes.has(key),
        setAttribute: (key: string): void => {
          attributes.add(key)
        },
      },
    },
  })
  context.after(() => {
    Reflect.deleteProperty(globalThis, "window")
    Reflect.deleteProperty(globalThis, "document")
  })

  assert.equal(isNotificationReminderHidden(), false)
  hideNotificationReminder()
  assert.equal(isNotificationReminderHidden(), true)
})
