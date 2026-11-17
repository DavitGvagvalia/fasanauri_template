import assert from "node:assert/strict"
import { test } from "node:test"

import { ECategory, EPlace } from "@/constants"
import { createCartStore } from "@/lib/cart/createCartStore"
import type { ICartLine } from "@/types/cart"

const line: ICartLine = {
  product: {
    id: "pending-drink",
    title: { en: "Lemonade", ka: "ლიმონათი", ru: "Лимонад" },
    description: { en: "Sample", ka: "ნიმუში", ru: "Пример" },
    categoryId: ECategory.SoftDrinks,
    kind: "beverage",
    imageURL: "/images/placeholder_food.webp",
    isPlaceholder: true,
    priceMinor: 500,
    placeIds: [EPlace.Dolidze],
    isPopular: false,
  },
  serving: "bottle",
  quantity: 2,
}

test("demo submission rejects unhydrated and empty carts without creating pending orders", () => {
  const store = createCartStore()

  assert.equal(store.getState().submitDemoOrder(), false)
  store.getState().hydrate()
  assert.equal(store.getState().submitDemoOrder(), false)
  assert.deepEqual(store.getState().pendingOrders, [])
})

test("checkout retains submitted quantities, servings and totals independently of the next cart", () => {
  const store = createCartStore()
  store.getState().hydrate()
  store.getState().addItem(line)
  store.getState().addItem({ ...line, serving: "glass", quantity: 3 })

  assert.equal(store.getState().submitDemoOrder(), true)
  const firstOrder = store.getState().pendingOrders[0]
  assert.equal(firstOrder.status, "pending")
  assert.equal(firstOrder.count, 5)
  assert.equal(firstOrder.totalMinor, 2500)
  assert.deepEqual(
    firstOrder.lines.map((item) => [item.serving, item.quantity]),
    [
      ["bottle", 2],
      ["glass", 3],
    ]
  )
  assert.equal(store.getState().count, 0)
  assert.equal(store.getState().totalMinor, 0)
  assert.deepEqual(store.getState().lines, [])
  assert.equal(store.getState().submitDemoOrder(), false)
  store.getState().addItem({ ...line, quantity: 1 })
  store.getState().setQuantity(line.product.id, "bottle", 4)
  assert.equal(firstOrder.lines[0].quantity, 2)
  assert.equal(store.getState().submitDemoOrder(), true)
  assert.equal(store.getState().pendingOrders.length, 2)
  assert.notEqual(store.getState().pendingOrders[1].id, firstOrder.id)
  assert.equal(store.getState().pendingOrders[1].totalMinor, 2000)
  assert.equal(firstOrder.totalMinor, 2500)
})

test("pending demo orders stay out of persistent storage and server snapshots", () => {
  let saved: string | null = null
  const storage = {
    getItem: (): string | null => saved,
    setItem: (_key: string, value: string): void => {
      saved = value
    },
  }
  const store = createCartStore(() => storage)
  store.getState().hydrate()
  store.getState().addItem(line)
  store.getState().submitDemoOrder()

  assert.equal(saved, "[]")
  assert.deepEqual(store.getInitialState().pendingOrders, [])
  const restored = createCartStore(() => storage)
  restored.getState().hydrate()
  assert.deepEqual(restored.getState().pendingOrders, [])
  assert.deepEqual(restored.getState().lines, [])
})
