import assert from "node:assert/strict"
import { test } from "node:test"
import { createThemeStore } from "@/lib/theme/createThemeStore"

test("theme actions update appearance and retain in memory behavior when storage fails", (context) => {
  const classes = new Set<string>()
  const root = {
    classList: {
      toggle: (name: string, enabled: boolean): void => {
        if (enabled) {
          classes.add(name)
        } else {
          classes.delete(name)
        }
      },
    },
    style: { colorScheme: "light" },
  }
  Object.defineProperty(globalThis, "document", {
    configurable: true,
    value: { documentElement: root },
  })
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
      setItem: (): void => {
        throw new Error("unavailable")
      },
    },
  })
  context.after(() => {
    Reflect.deleteProperty(globalThis, "document")
    Reflect.deleteProperty(globalThis, "localStorage")
  })
  const store = createThemeStore()
  store.getState().setTheme("dark")
  assert.equal(store.getState().theme, "dark")
  assert.equal(root.style.colorScheme, "dark")
  assert.ok(classes.has("dark"))
  store.getState().setTheme("light")
  assert.equal(root.style.colorScheme, "light")
  assert.ok(!classes.has("dark"))
  assert.equal(store.getInitialState().theme, "light")
})
