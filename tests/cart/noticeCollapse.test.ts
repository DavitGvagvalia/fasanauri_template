import assert from "node:assert/strict"
import { test } from "node:test"

import { createDemoOrders } from "@/lib/cart/createDemoOrders"
import { getCollapsedNoticeKeys } from "@/lib/cart/getCollapsedNoticeKeys"
import { getImportantOrders } from "@/lib/cart/getImportantOrders"
import { getOrderNoticeLayout } from "@/lib/cart/getOrderNoticeLayout"

const orders = getImportantOrders(createDemoOrders("/_next/static/media/placeholder.webp"))

test("collapsing the visible mobile notice collapses offscreen orders and releases carousel slots", () => {
  const collapsed = getCollapsedNoticeKeys(new Set(), orders, orders[1], 390)
  assert.ok(orders.every((order) => collapsed.has(`${order.id}:${order.status}`)))
  const layout = getOrderNoticeLayout(
    orders.length,
    390,
    false,
    false,
    false,
    orders.map(() => 44)
  )
  assert.equal(layout.inline, true)
  assert.equal(layout.noticeWidth, orders.length * 44 + (orders.length - 1) * 12)
  assert.ok(layout.noticeWidth < 280)
})

test("desktop collapse remains independent and retains earlier collapsed notices", () => {
  const current = new Set(["previous:pending"])
  const collapsed = getCollapsedNoticeKeys(current, orders, orders[1], 640)
  assert.equal(collapsed.has(`${orders[0].id}:${orders[0].status}`), false)
  assert.equal(collapsed.has(`${orders[1].id}:${orders[1].status}`), true)
  assert.equal(collapsed.has("previous:pending"), true)
  assert.deepEqual([...current], ["previous:pending"])
})

test("opening a mobile notice expands all visible and offscreen orders", () => {
  const collapsed = getCollapsedNoticeKeys(new Set(["previous:pending"]), orders, orders[0], 390)
  const expanded = getCollapsedNoticeKeys(collapsed, orders, orders[1], 390, false)
  assert.ok(orders.every((order) => !expanded.has(`${order.id}:${order.status}`)))
  assert.equal(expanded.has("previous:pending"), true)
  assert.ok(orders.every((order) => collapsed.has(`${order.id}:${order.status}`)))
  const layout = getOrderNoticeLayout(orders.length, 390)
  assert.equal(layout.inline, false)
  assert.equal(layout.noticeWidth, 280)
})

test("opening a desktop notice leaves other notices collapsed", () => {
  const collapsed = getCollapsedNoticeKeys(new Set(), orders, orders[0], 390)
  const expanded = getCollapsedNoticeKeys(collapsed, orders, orders[1], 640, false)
  assert.equal(expanded.has(`${orders[0].id}:${orders[0].status}`), true)
  assert.equal(expanded.has(`${orders[1].id}:${orders[1].status}`), false)
})
