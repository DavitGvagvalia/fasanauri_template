import assert from "node:assert/strict"
import { test } from "node:test"

import { DEMO_TRANSITION_ORDER_ID } from "@/constants"
import { createCartStore } from "@/lib/cart/createCartStore"
import { createDemoOrders } from "@/lib/cart/createDemoOrders"
import { getActiveOrders } from "@/lib/cart/getActiveOrders"
import { getSortedOrders } from "@/lib/cart/getSortedOrders"
import { scheduleDemoOrderConfirmation } from "@/lib/cart/scheduleDemoOrderConfirmation"
import type { IDemoOrder } from "@/types/order"

const imageURL = "/_next/static/media/placeholder.webp"

test("staff acceptance requires the customer to reconfirm and does not overwrite closed orders", () => {
  const store = createCartStore()
  store.getState().hydrate(imageURL)
  const findOrder = (id: number): IDemoOrder | undefined =>
    store.getState().pendingOrders.find((order) => order.id === id)
  const original = findOrder(DEMO_TRANSITION_ORDER_ID)
  const initialCount = store.getState().pendingOrders.length
  assert.equal(original?.status, "pending")
  store.getState().confirmOrder(DEMO_TRANSITION_ORDER_ID)
  assert.equal(findOrder(DEMO_TRANSITION_ORDER_ID)?.status, "pending")
  store.getState().requestOrderConfirmation(DEMO_TRANSITION_ORDER_ID)
  const awaitingCustomer = findOrder(DEMO_TRANSITION_ORDER_ID)
  assert.equal(awaitingCustomer?.status, "confirmationRequired")
  assert.ok(awaitingCustomer?.deliveryFeeMinor)
  assert.equal(awaitingCustomer?.createdAt, original?.createdAt)
  store.getState().requestOrderConfirmation(DEMO_TRANSITION_ORDER_ID)
  assert.equal(findOrder(DEMO_TRANSITION_ORDER_ID), awaitingCustomer)
  store.getState().confirmOrder(DEMO_TRANSITION_ORDER_ID)
  assert.equal(findOrder(DEMO_TRANSITION_ORDER_ID)?.status, "confirmed")
  store.getState().requestOrderConfirmation(2)
  assert.equal(findOrder(2)?.status, "declined")
  store.getState().requestOrderConfirmation(4)
  assert.equal(findOrder(4)?.status, "delivered")
  store.getState().requestOrderConfirmation(-1)
  assert.equal(store.getState().pendingOrders.length, initialCount)
})

test("orders sort newest first without mutating data and terminal orders stay out of the active carousel", () => {
  const now = Date.now()
  const orders = createDemoOrders(imageURL, now)
  const ids = orders.map((order) => order.id)
  const sorted = getSortedOrders(orders)
  assert.equal(sorted[0].id, DEMO_TRANSITION_ORDER_ID)
  assert.deepEqual(
    orders.map((order) => order.id),
    ids
  )
  for (let index = 1; index < sorted.length; index += 1) {
    assert.ok(Date.parse(sorted[index - 1].createdAt) >= Date.parse(sorted[index].createdAt))
  }
  const delivered = sorted.filter((order) => order.status === "delivered")
  assert.equal(delivered.length, 2)
  assert.ok(delivered.every((order) => Date.parse(order.createdAt) <= now - 86_400_000))
  const active = getActiveOrders(orders)
  assert.ok(active.some((order) => order.status === "onTheWay"))
  assert.ok(active.some((order) => order.status === "confirmationRequired"))
  assert.ok(active.every((order) => order.status !== "declined" && order.status !== "delivered"))
})

test("the selected order collapses on a second click while notice selection always expands it", () => {
  const store = createCartStore()
  store.getState().hydrate(imageURL)
  store.getState().openOrder(3)
  assert.equal(store.getState().selectedOrderId, 3)
  store.getState().toggleOrder(3)
  assert.equal(store.getState().selectedOrderId, null)
  store.getState().toggleOrder(3)
  assert.equal(store.getState().selectedOrderId, 3)
  store.getState().openOrder(3)
  assert.equal(store.getState().selectedOrderId, 3)
  store.getState().toggleOrder(-1)
  assert.equal(store.getState().selectedOrderId, 3)
})

test("submission retains a valid note in memory and invalid notes leave the cart untouched", () => {
  let saved = "[]"
  const storage = {
    getItem: (): string => saved,
    setItem: (_key: string, value: string): void => {
      saved = value
    },
  }
  const store = createCartStore(() => storage)
  store.getState().hydrate(imageURL)
  const nextId = Math.max(...store.getState().pendingOrders.map((order) => order.id)) + 1
  store.getState().addItem(store.getState().pendingOrders[0].lines[0])
  assert.equal(store.getState().submitDemoOrder("a".repeat(501)), false)
  assert.ok(store.getState().count > 0)
  assert.equal(store.getState().submitDemoOrder("  Please skip cutlery  "), true)
  const newest = getSortedOrders(store.getState().pendingOrders)[0]
  assert.equal(newest.note, "Please skip cutlery")
  assert.equal(newest.deliveryFeeMinor, null)
  assert.equal(newest.id, nextId)
  assert.equal(saved, "[]")
  const restored = createCartStore(() => storage)
  restored.getState().hydrate(imageURL)
  assert.ok(restored.getState().pendingOrders.every((order) => order.note === ""))
})

test("courier orders keep their delivery state and fixed arrival through confirmation actions", () => {
  const store = createCartStore()
  store.getState().hydrate(imageURL)
  const travelling = store.getState().pendingOrders.find((order) => order.status === "onTheWay")
  assert.ok(travelling?.estimatedArrivalAt)
  const deadline = travelling.estimatedArrivalAt
  store.getState().requestOrderConfirmation(travelling.id)
  store.getState().confirmOrder(travelling.id)
  const after = store.getState().pendingOrders.find((order) => order.id === travelling.id)
  assert.equal(after?.status, "onTheWay")
  assert.equal(after?.estimatedArrivalAt, deadline)
  assert.ok(getActiveOrders([travelling]).includes(travelling))
})

test("the timed example requires confirmation only after ten seconds", (context) => {
  context.mock.timers.enable({ apis: ["setTimeout"] })
  const store = createCartStore()
  store.getState().hydrate(imageURL)
  const cancel = scheduleDemoOrderConfirmation(store.getState().requestOrderConfirmation)
  context.mock.timers.tick(9999)
  assert.equal(
    store.getState().pendingOrders.find((order) => order.id === DEMO_TRANSITION_ORDER_ID)?.status,
    "pending"
  )
  context.mock.timers.tick(1)
  assert.equal(
    store.getState().pendingOrders.find((order) => order.id === DEMO_TRANSITION_ORDER_ID)?.status,
    "confirmationRequired"
  )
  cancel()
})

test("unmount cleanup cancels the pending example transition", (context) => {
  context.mock.timers.enable({ apis: ["setTimeout"] })
  const store = createCartStore()
  store.getState().hydrate(imageURL)
  const cancel = scheduleDemoOrderConfirmation(store.getState().requestOrderConfirmation)
  cancel()
  context.mock.timers.tick(10000)
  assert.equal(
    store.getState().pendingOrders.find((order) => order.id === DEMO_TRANSITION_ORDER_ID)?.status,
    "pending"
  )
})
