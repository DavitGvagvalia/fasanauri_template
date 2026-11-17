import assert from "node:assert/strict"
import { test } from "node:test"

import { ECategory } from "@/constants"
import { createCartStore } from "@/lib/cart/createCartStore"
import { createDemoOrders } from "@/lib/cart/createDemoOrders"
import { getDemoOrderTotal } from "@/lib/cart/getDemoOrderTotal"

const imageURL = "/_next/static/media/placeholder.webp"

test("demo hydration adds independent pending and declined examples once without changing the cart", () => {
  const store = createCartStore()
  assert.deepEqual(store.getInitialState().pendingOrders, [])
  store.getState().hydrate(imageURL)
  const orders = store.getState().pendingOrders
  const pending = orders.find((order) => order.status === "pending")
  const declined = orders.find((order) => order.status === "declined")

  assert.ok(pending)
  assert.ok(declined)
  assert.ok(pending.deliveryFeeMinor !== null && pending.deliveryFeeMinor > 0)
  assert.ok(pending.estimatedMinutes !== null && pending.estimatedMinutes > 0)
  assert.equal(declined.lines.length, 1)
  assert.equal(declined.lines[0].product.categoryId, ECategory.Salads)
  assert.equal(declined.lines[0].quantity, 1)
  assert.equal(declined.declineReason, "tooCringe")
  assert.equal(declined.deliveryFeeMinor, 0)
  assert.equal(declined.estimatedMinutes, null)
  assert.equal(store.getState().count, 0)
  store.getState().hydrate(imageURL)
  assert.equal(store.getState().pendingOrders, orders)
  const other = createDemoOrders(imageURL)
  assert.notEqual(other[0].lines[0].product, pending.lines[0].product)
})

test("opening a notice selects its exact order and pending tab, including while the drawer is already open", () => {
  const store = createCartStore()
  store.getState().hydrate(imageURL)
  const orders = store.getState().pendingOrders
  store.getState().setCartOpen(true)
  store.getState().setCartTab("order")
  store.getState().openOrder(orders[1].id)

  assert.equal(store.getState().cartOpen, true)
  assert.equal(store.getState().cartTab, "pending")
  assert.equal(store.getState().selectedOrderId, orders[1].id)
  store.getState().openOrder(orders[0].id)
  assert.equal(store.getState().selectedOrderId, orders[0].id)
  store.getState().setCartOpen(false)
  store.getState().openOrder(-1)
  assert.equal(store.getState().cartOpen, false)
  assert.equal(store.getState().selectedOrderId, orders[0].id)
})

test("demo totals include quoted delivery and leave unknown delivery out of the provisional amount", () => {
  const [order] = createDemoOrders(imageURL)

  assert.equal(
    getDemoOrderTotal({
      ...order,
      status: "confirmationRequired",
      totalMinor: 1299,
      deliveryFeeMinor: 500,
    }),
    1799
  )
  assert.equal(
    getDemoOrderTotal({ ...order, status: "pending", totalMinor: 1299, deliveryFeeMinor: 500 }),
    1299
  )
  assert.equal(getDemoOrderTotal({ ...order, totalMinor: 1299, deliveryFeeMinor: null }), 1299)
  assert.equal(getDemoOrderTotal({ ...order, totalMinor: 1299, deliveryFeeMinor: 0 }), 1299)
})
