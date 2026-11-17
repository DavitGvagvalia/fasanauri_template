import assert from "node:assert/strict"
import { test } from "node:test"

import { getOpenSidebarWidths } from "@/lib/cart/getOpenSidebarWidths"
import { getOrderNoticeLayout } from "@/lib/cart/getOrderNoticeLayout"

test("open sidebars reserve their full layout width while still sliding into view", (context) => {
  Object.defineProperty(globalThis, "document", {
    configurable: true,
    value: {
      querySelectorAll: (selector: string) => {
        assert.equal(selector, '[data-slot="sheet-content"][data-open]')

        return [
          { dataset: { side: "left" }, offsetWidth: 448 },
          { dataset: { side: "right" }, offsetWidth: 384 },
          { dataset: { side: "right" }, offsetWidth: 448 },
          { dataset: { side: "bottom" }, offsetWidth: 1200 },
        ]
      },
    },
  })
  context.after(() => Reflect.deleteProperty(globalThis, "document"))
  assert.deepEqual(getOpenSidebarWidths(), { left: 448, right: 448 })
})

test("language sidebars reserve the same notice space as the order drawer and release it on close", () => {
  const open = getOrderNoticeLayout(2, 1084, false, false, true, undefined, false, {
    left: 0,
    right: 448,
  })
  assert.deepEqual(open, getOrderNoticeLayout(2, 1084, false, true, true))
  assert.equal(open.inline, false)
  assert.equal(getOrderNoticeLayout(2, 1084, false, false, true).inline, true)
})

test("left sidebars reduce notice capacity and full width mobile sidebars hide notices", () => {
  const left = getOrderNoticeLayout(2, 1083, false, false, false, undefined, false, {
    left: 448,
    right: 0,
  })
  assert.equal(left.inline, false)
  const narrowRight = getOrderNoticeLayout(2, 1084, false, false, false, undefined, false, {
    left: 0,
    right: 384,
  })
  assert.equal(narrowRight.inline, true)
  for (const sidebars of [
    { left: 430, right: 0 },
    { left: 0, right: 430 },
  ]) {
    assert.equal(
      getOrderNoticeLayout(2, 430, false, false, true, undefined, false, sidebars).hidden,
      true
    )
  }
  assert.equal(getOrderNoticeLayout(2, 430, false).hidden, false)
})
