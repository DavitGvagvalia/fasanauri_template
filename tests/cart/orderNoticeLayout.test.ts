import assert from "node:assert/strict"
import { test } from "node:test"

import { createDemoOrders } from "@/lib/cart/createDemoOrders"
import { getImportantOrders } from "@/lib/cart/getImportantOrders"
import { getOrderNoticeLayout } from "@/lib/cart/getOrderNoticeLayout"

const orders = createDemoOrders("/_next/static/media/placeholder.webp")

test("courier notices remain visible alongside the highest priority waiting orders", () => {
  const important = getImportantOrders(orders)
  assert.deepEqual(
    important.map((order) => order.id),
    [7, 3]
  )
  const twoRequests = orders.map((order) =>
    order.id === 6 ? { ...order, status: "confirmationRequired" as const } : order
  )
  assert.deepEqual(
    getImportantOrders(twoRequests).map((order) => order.id),
    [7, 6, 3]
  )
  const pendingOnly = orders.filter((order) => order.status !== "confirmationRequired")
  assert.deepEqual(
    getImportantOrders(pendingOnly).map((order) => order.id),
    [7, 6, 1]
  )
  assert.deepEqual(
    getImportantOrders(
      orders.filter((order) => order.status === "delivered" || order.status === "declined")
    ),
    []
  )
  assert.equal(getImportantOrders([{ ...orders[0], status: "confirmed" }])[0].status, "confirmed")
  const travelling = orders.filter((order) => order.status === "onTheWay")
  assert.equal(getImportantOrders(travelling)[0].status, "onTheWay")
  assert.deepEqual(
    getImportantOrders([...travelling, { ...orders[0], status: "confirmed" }]).map(
      (order) => order.status
    ),
    ["onTheWay", "confirmed"]
  )
})

test("courier notices sort newest first without duplicates or mutating input", () => {
  const [sample] = orders
  const records = [
    { ...sample, id: 10, status: "onTheWay" as const, createdAt: "2026-01-01T12:00:00Z" },
    { ...sample, id: 11, status: "onTheWay" as const, createdAt: "2026-01-01T12:05:00Z" },
    { ...sample, id: 12, status: "delivered" as const },
  ]
  const original = records.map((order) => order.id)

  assert.deepEqual(
    getImportantOrders(records).map((order) => order.id),
    [11, 10]
  )
  assert.deepEqual(
    records.map((order) => order.id),
    original
  )
})

test("equally important cards stay side by side only when their full widths and gap fit", () => {
  assert.deepEqual(getOrderNoticeLayout(3, 928, false), {
    inline: true,
    compact: false,
    width: 864,
    noticeWidth: 864,
    permissionInline: false,
    permissionWidth: 0,
    hidden: false,
  })
  assert.deepEqual(getOrderNoticeLayout(3, 927, false), {
    inline: false,
    compact: false,
    width: 280,
    noticeWidth: 280,
    permissionInline: false,
    permissionWidth: 0,
    hidden: false,
  })
  assert.equal(getOrderNoticeLayout(1, 280, false).width, 248)
})

test("mobile product drawers hide notices while desktop product dialogs do not move the dock", () => {
  assert.deepEqual(getOrderNoticeLayout(2, 430, true), {
    inline: false,
    compact: true,
    width: 414,
    noticeWidth: 414,
    permissionInline: false,
    permissionWidth: 0,
    hidden: true,
  })
  assert.deepEqual(getOrderNoticeLayout(1, 430, false), {
    inline: true,
    compact: false,
    width: 280,
    noticeWidth: 280,
    permissionInline: false,
    permissionWidth: 0,
    hidden: false,
  })
  assert.deepEqual(getOrderNoticeLayout(2, 1200, true), getOrderNoticeLayout(2, 1200, false))
  assert.equal(getOrderNoticeLayout(2, 639, true, false, true).hidden, true)
  assert.equal(getOrderNoticeLayout(2, 640, true, false, true).hidden, false)
  assert.equal(getOrderNoticeLayout(2, 639, false, false, true).hidden, false)
})

test("desktop notices reserve drawer space and mobile notices hide while the order drawer is open", () => {
  assert.deepEqual(getOrderNoticeLayout(2, 1084, false, true), {
    inline: true,
    compact: false,
    width: 572,
    noticeWidth: 572,
    permissionInline: false,
    permissionWidth: 0,
    hidden: false,
  })
  assert.deepEqual(getOrderNoticeLayout(2, 1083, false, true), {
    inline: false,
    compact: false,
    width: 280,
    noticeWidth: 280,
    permissionInline: false,
    permissionWidth: 0,
    hidden: false,
  })
  assert.equal(getOrderNoticeLayout(2, 639, false, true).hidden, true)
  assert.equal(getOrderNoticeLayout(2, 640, false, true).hidden, false)
  assert.equal(getOrderNoticeLayout(2, 430, true, true).hidden, true)
})

test("desktop permission controls sit left of notices and reserve space before deciding carousel fit", () => {
  const fullRow = getOrderNoticeLayout(2, 928, false, false, true)
  assert.equal(fullRow.permissionInline, true)
  assert.equal(fullRow.inline, true)
  assert.equal(fullRow.noticeWidth, 572)
  assert.equal(fullRow.width, 864)
  const carousel = getOrderNoticeLayout(2, 927, false, false, true)
  assert.equal(carousel.permissionInline, true)
  assert.equal(carousel.inline, false)
  assert.equal(carousel.width, 572)
  assert.equal(getOrderNoticeLayout(2, 928).width, 572)
  assert.equal(getOrderNoticeLayout(2, 1400, false, true, true).width, 864)
  assert.equal(getOrderNoticeLayout(2, 1084, false, true, true).permissionInline, true)
  assert.equal(getOrderNoticeLayout(2, 1083, false, true, true).permissionInline, false)
  assert.equal(getOrderNoticeLayout(2, 430, false, false, true).permissionInline, false)
})

test("collapsed cards release their space and expanded mobile permission cards retain their full width", () => {
  const collapsed = getOrderNoticeLayout(2, 928, false, false, true, [44, 44], true)
  assert.equal(collapsed.width, 156)
  assert.equal(collapsed.noticeWidth, 100)
  assert.equal(collapsed.permissionWidth, 44)
  assert.equal(collapsed.inline, true)
  const mixed = getOrderNoticeLayout(2, 928, false, false, true, [280, 44], false)
  assert.equal(mixed.width, 628)
  assert.equal(mixed.noticeWidth, 336)
  const mobile = getOrderNoticeLayout(1, 430, false, false, true, [44], false)
  assert.equal(mobile.width, 280)
  assert.equal(mobile.noticeWidth, 44)
  assert.equal(mobile.permissionWidth, 280)
})
