import assert from "node:assert/strict"
import { test } from "node:test"

import { saveProductOrder } from "@/lib/cart/saveProductOrder"
import { getCartStore } from "@/lib/cart/getCartStore"

test("browser cart and order selection survive reloading the store access module", async (context) => {
  Object.defineProperty(globalThis, "window", { configurable: true, value: {} })
  context.after(() => Reflect.deleteProperty(globalThis, "window"))
  const moduleURL = new URL("../../lib/cart/getCartStore.ts", import.meta.url)
  const originalModule = (await import(
    `${moduleURL.href}?runtime=first`
  )) as typeof import("@/lib/cart/getCartStore")
  const original = originalModule.getCartStore()
  original.getState().hydrate("/_next/static/media/placeholder.webp")
  const line = original.getState().pendingOrders[0].lines[0]
  saveProductOrder(original.getState(), line)
  const reloadedModule = (await import(
    `${moduleURL.href}?runtime=second`
  )) as typeof import("@/lib/cart/getCartStore")
  const reloaded = reloadedModule.getCartStore()

  assert.equal(reloaded, original)
  reloaded.getState().openOrder(3)
  saveProductOrder(reloaded.getState(), { ...line, quantity: 4 })
  assert.equal(original.getState().count, 4)
  assert.equal(original.getState().cartTab, "order")
  assert.equal(original.getState().pendingOrders.find((order) => order.id === 3)?.count, 3)
  reloaded.getState().openOrder(3)
  assert.equal(original.getState().cartOpen, true)
  assert.equal(original.getState().selectedOrderId, 3)
  assert.equal(original.getState().cartTab, "pending")
})

test("selecting an order closes product details and preserves menu filters", (context) => {
  const location = {
    href: "https://menu.example/en?place=dolidze&category=salads&product=placeholder-salad",
  }
  const history = {
    state: null,
    replaceState: (_state: unknown, _title: string, url: URL): void => {
      location.href = url.href
    },
  }
  Object.defineProperty(globalThis, "window", { configurable: true, value: { location, history } })
  context.after(() => Reflect.deleteProperty(globalThis, "window"))
  const store = getCartStore()
  store.getState().hydrate("/_next/static/media/placeholder.webp")
  store.getState().openOrder(3)
  const url = new URL(location.href)
  assert.equal(url.searchParams.has("product"), false)
  assert.equal(url.searchParams.get("category"), "salads")
  assert.equal(url.searchParams.get("place"), "dolidze")
  assert.equal(store.getState().selectedOrderId, 3)
  assert.equal(store.getState().cartOpen, true)
})
