import assert from "node:assert/strict"
import { test } from "node:test"

import { createDemoOrders } from "@/lib/cart/createDemoOrders"
import { getOrderGroups } from "@/lib/cart/getOrderGroups"

test("order groups put courier deliveries first and keep terminal records in newest first history", () => {
  const orders = createDemoOrders("/_next/static/media/placeholder.webp")
  const original = orders.map((order) => order.id)
  const groups = getOrderGroups(orders)

  assert.deepEqual(
    groups.map((group) => group.heading),
    ["onTheWay", "confirmationRequired", "title", "history"]
  )
  assert.deepEqual(
    groups.map((group) => group.orders.map((order) => order.id)),
    [[7], [3], [6, 1], [2, 4, 5]]
  )
  assert.deepEqual(
    orders.map((order) => order.id),
    original
  )
  assert.equal(groups.flatMap((group) => group.orders).length, orders.length)
})

test("acceptance and customer confirmation move orders between groups without empty headings", () => {
  const orders = createDemoOrders("/_next/static/media/placeholder.webp")
  const sample = orders[0]

  assert.deepEqual(getOrderGroups([]), [])
  assert.deepEqual(
    getOrderGroups([{ ...sample, status: "confirmationRequired" }]).map((group) => group.heading),
    ["confirmationRequired"]
  )
  assert.deepEqual(
    getOrderGroups([{ ...sample, status: "confirmed" }]).map((group) => group.heading),
    ["title"]
  )
  assert.deepEqual(
    getOrderGroups([{ ...sample, status: "onTheWay" }]).map((group) => group.heading),
    ["onTheWay"]
  )
  assert.deepEqual(
    getOrderGroups([{ ...sample, status: "delivered" }]).map((group) => group.heading),
    ["history"]
  )
})

test("courier delivery remains separate from confirmed orders and sorts newest first within its section", () => {
  const [sample] = createDemoOrders("/_next/static/media/placeholder.webp")
  const orders = [
    { ...sample, id: 10, status: "onTheWay" as const, createdAt: "2026-01-01T12:00:00Z" },
    { ...sample, id: 11, status: "onTheWay" as const, createdAt: "2026-01-01T12:05:00Z" },
    { ...sample, id: 12, status: "confirmed" as const },
  ]
  const groups = getOrderGroups(orders)
  assert.deepEqual(
    groups.map((group) => group.heading),
    ["onTheWay", "title"]
  )
  assert.deepEqual(
    groups[0].orders.map((order) => order.id),
    [11, 10]
  )
})
