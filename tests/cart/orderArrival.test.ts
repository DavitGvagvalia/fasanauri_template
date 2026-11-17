import assert from "node:assert/strict"
import { test } from "node:test"

import { DEMO_TRANSITION_ORDER_ID, ORDER_MINUTE_MS } from "@/constants"
import { createCartStore } from "@/lib/cart/createCartStore"
import { getOrderArrivalState } from "@/lib/cart/getOrderArrivalState"

test("arrival switches to soon below one minute and never displays a negative duration", () => {
  const now = Date.now()
  const deadline = new Date(now + 2 * ORDER_MINUTE_MS).toISOString()
  assert.deepEqual(getOrderArrivalState(deadline, now), {
    status: "scheduled",
    timestamp: Date.parse(deadline),
  })
  assert.equal(getOrderArrivalState(deadline, now + ORDER_MINUTE_MS).status, "scheduled")
  assert.equal(getOrderArrivalState(deadline, now + ORDER_MINUTE_MS + 1).status, "soon")
  assert.equal(getOrderArrivalState(deadline, now + 3 * ORDER_MINUTE_MS).status, "soon")
  assert.equal(getOrderArrivalState(null, now).status, "unknown")
  assert.equal(getOrderArrivalState("invalid", now).status, "unknown")
})

test("staff acceptance freezes one arrival deadline instead of restarting it on each render or update", () => {
  const store = createCartStore()
  store.getState().hydrate("/_next/static/media/placeholder.webp")
  const before = Date.now()
  store.getState().requestOrderConfirmation(DEMO_TRANSITION_ORDER_ID)
  const order = store.getState().pendingOrders.find((item) => item.id === DEMO_TRANSITION_ORDER_ID)
  assert.ok(order?.estimatedArrivalAt)
  assert.ok(Date.parse(order.estimatedArrivalAt) >= before + 35 * ORDER_MINUTE_MS)
  const deadline = order.estimatedArrivalAt
  store.getState().requestOrderConfirmation(DEMO_TRANSITION_ORDER_ID)
  store.getState().confirmOrder(DEMO_TRANSITION_ORDER_ID)
  assert.equal(
    store.getState().pendingOrders.find((item) => item.id === DEMO_TRANSITION_ORDER_ID)
      ?.estimatedArrivalAt,
    deadline
  )
})
