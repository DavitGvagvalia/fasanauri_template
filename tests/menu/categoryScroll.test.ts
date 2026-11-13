import assert from "node:assert/strict"
import { test } from "node:test"
import { getCategoryScrollDistance } from "@/lib/menu/getCategoryScrollDistance"
import type { ICategoryScrollMeasurements } from "@/types/categoryCarousel"

const measurements = (
  overrides: Partial<ICategoryScrollMeasurements> = {}
): ICategoryScrollMeasurements => ({
  viewport: { left: 0, right: 300 },
  slides: [
    { left: -180, right: -84 },
    { left: -80, right: 16 },
    { left: 20, right: 116 },
    { left: 120, right: 216 },
    { left: 220, right: 316 },
    { left: 320, right: 416 },
  ],
  position: -180,
  target: -180,
  min: -500,
  max: 0,
  useTarget: false,
  ...overrides,
})

test("both arrows skip a card at 10, 50, and 90 percent visibility", () => {
  for (const visibleWidth of [10, 50, 90]) {
    const partial = { left: 300 - visibleWidth, right: 400 - visibleWidth }
    const next = { left: partial.right + 4, right: partial.right + 104 }
    assert.equal(
      getCategoryScrollDistance(measurements({ slides: [partial, next] }), "right"),
      300 - next.right
    )
    const leftPartial = { left: visibleWidth - 100, right: visibleWidth }
    const previous = { left: leftPartial.left - 104, right: leftPartial.left - 4 }
    assert.equal(
      getCategoryScrollDistance(
        measurements({ slides: [previous, leftPartial], position: -300, target: -300 }),
        "left"
      ),
      -previous.left
    )
  }
})

test("arrows reveal the boundary partial card when no further category exists", () => {
  assert.equal(
    getCategoryScrollDistance(measurements({ slides: [{ left: 250, right: 350 }] }), "right"),
    -50
  )
  assert.equal(
    getCategoryScrollDistance(measurements({ slides: [{ left: -50, right: 50 }] }), "left"),
    50
  )
})

test("an aligned edge advances to the adjacent hidden card including its gap", () => {
  const aligned = measurements({
    viewport: { left: 0, right: 308 },
    slides: [
      { left: -104, right: -4 },
      { left: 0, right: 100 },
      { left: 104, right: 204 },
      { left: 208, right: 308 },
      { left: 312, right: 412 },
    ],
  })
  assert.equal(getCategoryScrollDistance(aligned, "left"), 104)
  assert.equal(getCategoryScrollDistance(aligned, "right"), -104)
})

test("card widths and viewport offsets determine the distance", () => {
  const variable = measurements({
    slides: [
      { left: -163, right: -35 },
      { left: 9, right: 101 },
      { left: 114, right: 238 },
      { left: 257, right: 349 },
      { left: 365, right: 489 },
    ],
  })
  assert.equal(getCategoryScrollDistance(variable, "left"), 163)
  assert.equal(getCategoryScrollDistance(variable, "right"), -189)
  const shifted = {
    ...variable,
    viewport: { left: 75, right: 375 },
    slides: variable.slides.map((slide) => ({ left: slide.left + 75, right: slide.right + 75 })),
  }
  assert.equal(getCategoryScrollDistance(shifted, "left"), 163)
  assert.equal(getCategoryScrollDistance(shifted, "right"), -189)
})

test("rapid presses queue cards and direction changes use the currently visible edge", () => {
  const pending = measurements({
    position: -40,
    target: -112,
    useTarget: true,
    slides: [
      { left: -40, right: 60 },
      { left: 64, right: 164 },
      { left: 168, right: 268 },
      { left: 272, right: 372 },
      { left: 376, right: 476 },
    ],
  })
  assert.equal(getCategoryScrollDistance(pending, "right"), -104)
  const mirrored = {
    ...pending,
    position: -500 - pending.position,
    target: -500 - pending.target,
    slides: [...pending.slides].reverse().map((slide) => ({
      left: 300 - slide.right,
      right: 300 - slide.left,
    })),
  }
  assert.equal(getCategoryScrollDistance(mirrored, "left"), 104)
  assert.equal(getCategoryScrollDistance({ ...pending, useTarget: false }, "left"), 112)
})

test("reversing at an already visible boundary cancels the pending opposite movement", () => {
  const starting = measurements({
    position: 0,
    target: -104,
    slides: [
      { left: 0, right: 100 },
      { left: 104, right: 204 },
      { left: 208, right: 308 },
    ],
  })
  assert.equal(getCategoryScrollDistance(starting, "left"), 104)
})

test("arrow presses after a free drag replace momentum with the closest visible edge", () => {
  const dragging = measurements({
    position: -40,
    target: -280,
    slides: [
      { left: -40, right: 60 },
      { left: 64, right: 164 },
      { left: 168, right: 268 },
      { left: 272, right: 372 },
      { left: 376, right: 476 },
    ],
  })
  assert.equal(getCategoryScrollDistance(dragging, "right"), 64)
  assert.equal(getCategoryScrollDistance(dragging, "left"), 280)
})

test("scroll bounds, fitted lists, and empty lists do not overscroll", () => {
  assert.equal(getCategoryScrollDistance(measurements({ position: -5, target: -5 }), "left"), 5)
  assert.equal(
    getCategoryScrollDistance(measurements({ position: -490, target: -490 }), "right"),
    -10
  )
  const fitted = measurements({
    slides: [{ left: 0, right: 200 }],
    position: 0,
    target: 0,
    min: 0,
  })
  for (const direction of ["left", "right"] as const) {
    assert.equal(getCategoryScrollDistance(fitted, direction), 0)
    assert.equal(getCategoryScrollDistance(measurements({ slides: [] }), direction), 0)
  }
})

test("subpixel edge differences do not cause tiny repeated scrolls", () => {
  const rounded = measurements({
    slides: [
      { left: -0.5, right: 99.5 },
      { left: 200.5, right: 300.5 },
    ],
  })
  assert.equal(getCategoryScrollDistance(rounded, "left"), 0)
  assert.equal(getCategoryScrollDistance(rounded, "right"), 0)
})
