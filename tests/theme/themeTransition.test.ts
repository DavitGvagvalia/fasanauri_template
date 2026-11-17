import assert from "node:assert/strict"
import { test } from "node:test"

import { transitionTheme } from "@/lib/theme/transitionTheme"

test("rapid theme changes share one transition window and restore component transitions", (context) => {
  const classes = new Set<string>()
  const timers = new Map<number, () => void>()
  let nextTimer = 0
  let changes = 0
  Object.defineProperty(globalThis, "document", {
    configurable: true,
    value: {
      body: {},
      documentElement: {
        classList: {
          add: (name: string): void => {
            classes.add(name)
          },
          remove: (name: string): void => {
            classes.delete(name)
          },
        },
      },
    },
  })
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      matchMedia: (): { matches: boolean } => ({ matches: false }),
      getComputedStyle: (): { color: string } => ({ color: "black" }),
      clearTimeout: (timer: number): void => {
        timers.delete(timer)
      },
      setTimeout: (callback: () => void): number => {
        nextTimer += 1
        timers.set(nextTimer, callback)
        return nextTimer
      },
    },
  })
  context.after(() => {
    Reflect.deleteProperty(globalThis, "document")
    Reflect.deleteProperty(globalThis, "window")
  })

  const apply = (): void => {
    assert.equal(classes.has("theme-changing"), true)
    changes += 1
  }
  transitionTheme(apply)
  transitionTheme(apply)
  assert.equal(changes, 2)
  assert.equal(timers.size, 1)
  timers.get(nextTimer)?.()
  assert.equal(classes.has("theme-changing"), false)
})

test("reduced motion applies a theme immediately without introducing transition timers", (context) => {
  const classes = new Set(["theme-changing"])
  let applied = false
  Object.defineProperty(globalThis, "document", {
    configurable: true,
    value: {
      body: {},
      documentElement: {
        classList: {
          add: (name: string): void => {
            classes.add(name)
          },
          remove: (name: string): void => {
            classes.delete(name)
          },
        },
      },
    },
  })
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      matchMedia: (): { matches: boolean } => ({ matches: true }),
      getComputedStyle: (): { color: string } => ({ color: "black" }),
    },
  })
  context.after(() => {
    Reflect.deleteProperty(globalThis, "document")
    Reflect.deleteProperty(globalThis, "window")
  })

  transitionTheme(() => {
    applied = true
  })
  assert.equal(applied, true)
  assert.equal(classes.has("theme-changing"), false)
})
