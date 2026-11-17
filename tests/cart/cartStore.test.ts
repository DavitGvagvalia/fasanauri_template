import assert from "node:assert/strict"
import { test } from "node:test"

import { ECategory, EPlace } from "@/constants"
import { saveProductOrder } from "@/lib/cart/saveProductOrder"
import { createCartStore } from "@/lib/cart/createCartStore"
import { getCartStore } from "@/lib/cart/getCartStore"
import { productDetailsCache } from "@/lib/menu/productDetailsCache"
import type { IProduct } from "@/types/menu"

const food: IProduct = {
  id: "placeholder-food",
  description: { ka: "Sample", en: "Sample", ru: "Sample" },
  categoryId: ECategory.Bakery,
  title: { ka: "Khachapuri", en: "Khachapuri", ru: "Khachapuri" },
  kind: "food",
  imageURL: "/_next/static/media/placeholder.webp",
  isPlaceholder: true,
  priceMinor: 2499,
  placeIds: [EPlace.Dolidze],
  isPopular: false,
}
const beverage: IProduct = { ...food, id: "placeholder-drink", kind: "beverage" }

test("Zustand actions merge duplicate products and cap quantities with consistent totals", () => {
  const store = createCartStore()
  store.getState().hydrate()
  store.getState().addItem({ product: food, serving: null, quantity: 2 })
  store.getState().addItem({ product: food, serving: null, quantity: 200 })

  assert.equal(store.getState().lines.length, 1)
  assert.equal(store.getState().count, 99)
  assert.equal(store.getState().totalMinor, 99 * 2499)
  store.getState().setQuantity(food.id, null, 1)
  assert.equal(store.getState().count, 1)
  assert.equal(store.getState().totalMinor, 2499)
})

test("bottle and glass remain independently editable and removable through store actions", () => {
  const store = createCartStore()
  store.getState().hydrate()
  store.getState().addItem({ product: beverage, serving: "bottle", quantity: 2 })
  store.getState().addItem({ product: beverage, serving: "glass", quantity: 3 })
  store.getState().setQuantity(beverage.id, "glass", 1)

  assert.deepEqual(
    store.getState().lines.map((line) => [line.serving, line.quantity]),
    [
      ["bottle", 2],
      ["glass", 1],
    ]
  )
  assert.equal(store.getState().count, 3)
  store.getState().setQuantity(beverage.id, "glass", 0)
  assert.equal(store.getState().lines.length, 1)
  assert.equal(store.getState().lines[0].serving, "bottle")
  assert.equal(store.getState().totalMinor, 4998)
})

test("store actions reject invalid servings and non-finite or negative additions", () => {
  const store = createCartStore()
  store.getState().hydrate()
  store.getState().addItem({ product: beverage, serving: null, quantity: 1 })
  store.getState().addItem({ product: food, serving: "glass", quantity: 1 })
  store.getState().addItem({ product: food, serving: null, quantity: Number.NaN })
  store.getState().addItem({ product: food, serving: null, quantity: -1 })

  assert.deepEqual(store.getState().lines, [])
  store.getState().addItem({ product: food, serving: null, quantity: 2 })
  store.getState().setQuantity(food.id, null, Number.POSITIVE_INFINITY)
  assert.equal(store.getState().count, 2)
  store.getState().clearCart()
  assert.deepEqual(store.getState().lines, [])
  assert.equal(store.getState().count, 0)
  assert.equal(store.getState().totalMinor, 0)
})

test("server store access is isolated and its initial hydration snapshot stays empty", () => {
  const first = getCartStore()
  const second = getCartStore()
  first.getState().hydrate()
  first.getState().addItem({ product: food, serving: null, quantity: 2 })
  first.getState().setCartOpen(true)

  assert.notEqual(first, second)
  assert.equal(second.getState().ready, false)
  assert.deepEqual(second.getState().lines, [])
  assert.equal(second.getState().cartOpen, false)
  assert.equal(first.getInitialState().ready, false)
  assert.deepEqual(first.getInitialState().lines, [])
})

test("browser consumers share one store across routes while server access stays isolated", (context) => {
  Object.defineProperty(globalThis, "window", { configurable: true, value: {} })
  context.after(() => {
    Reflect.deleteProperty(globalThis, "window")
  })
  const first = getCartStore()
  first.getState().hydrate()
  first.getState().addItem({ product: food, serving: null, quantity: 2 })
  const second = getCartStore()

  assert.equal(first, second)
  assert.equal(second.getState().count, 2)
  Reflect.deleteProperty(globalThis, "window")
  const server = getCartStore()
  assert.notEqual(first, server)
  assert.equal(server.getState().count, 0)
  assert.equal(server.getState().ready, false)
})

test("opening product details preserves the cart and preserves URL filters and serving", (context) => {
  const location = { href: "https://menu.example/en?place=dolidze&search=wine" }
  const history = {
    pushState: (_state: unknown, _title: string, url: URL): void => {
      location.href = url.href
    },
  }
  Object.defineProperty(globalThis, "window", { configurable: true, value: { location, history } })
  context.after(() => {
    Reflect.deleteProperty(globalThis, "window")
    productDetailsCache.delete(beverage.id)
  })
  const store = createCartStore()
  store.getState().setCartOpen(true)
  store.getState().openProduct({ product: beverage, serving: "glass", quantity: 1 })
  const url = new URL(location.href)

  assert.equal(store.getState().cartOpen, true)
  assert.equal(url.searchParams.get("search"), "wine")
  assert.equal(url.searchParams.get("product"), beverage.id)
  assert.equal(url.searchParams.get("serving"), "glass")
  assert.equal(productDetailsCache.get(beverage.id), beverage)
})

test("product details save absolute quantities and remove only the selected serving at zero", () => {
  const store = createCartStore()
  store.getState().hydrate()
  saveProductOrder(store.getState(), { product: beverage, serving: "bottle", quantity: 2 })
  saveProductOrder(store.getState(), { product: beverage, serving: "glass", quantity: 3 })
  saveProductOrder(store.getState(), { product: beverage, serving: "bottle", quantity: 4 })
  saveProductOrder(store.getState(), { product: beverage, serving: "bottle", quantity: 4 })

  assert.equal(store.getState().count, 7)
  assert.equal(store.getState().totalMinor, 7 * beverage.priceMinor)
  saveProductOrder(store.getState(), { product: beverage, serving: "bottle", quantity: 0 })
  assert.deepEqual(
    store.getState().lines.map((line) => [line.serving, line.quantity]),
    [["glass", 3]]
  )
  saveProductOrder(store.getState(), { product: food, serving: null, quantity: 0 })
  assert.equal(store.getState().lines.length, 1)
  saveProductOrder(store.getState(), { product: beverage, serving: "glass", quantity: 1 })
  assert.equal(store.getState().count, 1)
  assert.equal(store.getState().totalMinor, beverage.priceMinor)
})
