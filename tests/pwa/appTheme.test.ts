import assert from "node:assert/strict"
import { test } from "node:test"

import { PWA_THEME_COLORS } from "@/constants"
import { updateAppThemeColor } from "@/lib/pwa/updateAppThemeColor"

test("the installed window color follows manual theme changes in both directions", (context) => {
  let content = ""
  Object.defineProperty(globalThis, "document", {
    configurable: true,
    value: {
      querySelector: (selector: string) => {
        assert.equal(selector, 'meta[name="theme-color"]')

        return {
          setAttribute: (name: string, value: string): void => {
            assert.equal(name, "content")
            content = value
          },
        }
      },
    },
  })
  context.after(() => Reflect.deleteProperty(globalThis, "document"))
  updateAppThemeColor("dark")
  assert.equal(content, PWA_THEME_COLORS.dark)
  updateAppThemeColor("light")
  assert.equal(content, PWA_THEME_COLORS.light)
})

test("theme changes tolerate a document without an app theme meta tag", (context) => {
  Object.defineProperty(globalThis, "document", {
    configurable: true,
    value: { querySelector: () => null },
  })
  context.after(() => Reflect.deleteProperty(globalThis, "document"))
  assert.doesNotThrow(() => updateAppThemeColor("dark"))
})
