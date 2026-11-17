import assert from "node:assert/strict"
import { test } from "node:test"

import { createCartStore } from "@/lib/cart/createCartStore"
import { createDemoOrders } from "@/lib/cart/createDemoOrders"
import { getProductOrderAction } from "@/lib/cart/getProductOrderAction"
import { saveProductOrder } from "@/lib/cart/saveProductOrder"

test("saved quantities use the update action even when unchanged or restored", () => {
  const store = createCartStore()
  const line = createDemoOrders("/_next/static/media/placeholder.webp")[0].lines[0]
  store.getState().hydrate()
  saveProductOrder(store.getState(), { ...line, quantity: 4 })
  const savedQuantity = store.getState().lines[0].quantity

  assert.equal(getProductOrderAction(4, savedQuantity), "updateOrder")
  assert.equal(getProductOrderAction(5, savedQuantity), "updateOrder")
  assert.equal(getProductOrderAction(3, savedQuantity), "updateOrder")
  assert.equal(getProductOrderAction(4, savedQuantity), "updateOrder")
  assert.equal(getProductOrderAction(0, savedQuantity), "removeFromOrder")
  assert.equal(store.getState().count, 4)
  saveProductOrder(store.getState(), { ...line, quantity: 5 })
  assert.equal(getProductOrderAction(5, store.getState().lines[0].quantity), "updateOrder")
})

test("an unsaved selection stays an add action and zero always means remove", () => {
  assert.equal(getProductOrderAction(1), "addToCart")
  assert.equal(getProductOrderAction(3), "addToCart")
  assert.equal(getProductOrderAction(0), "removeFromOrder")
})
