import assert from "node:assert/strict"
import { test } from "node:test"

import { goBackFromError } from "@/lib/navigation/goBackFromError"

test("error recovery returns to browser history when a previous page exists", (context) => {
  let returned = false
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      history: {
        length: 2,
        back: (): void => {
          returned = true
        },
      },
      location: {
        assign: (): never => {
          throw new Error("Should return to history")
        },
      },
    },
  })
  context.after(() => Reflect.deleteProperty(globalThis, "window"))

  assert.equal(goBackFromError(), true)
  assert.equal(returned, true)
})

test("a directly opened error page leaves navigation to the localized fallback link", (context) => {
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      history: { length: 1 },
    },
  })
  context.after(() => Reflect.deleteProperty(globalThis, "window"))

  assert.equal(goBackFromError(), false)
})
