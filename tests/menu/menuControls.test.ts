import assert from "node:assert/strict"
import { test } from "node:test"
import { createSearchDebouncer } from "@/lib/menu/createSearchDebouncer"
import { getHiddenCategoryCounts } from "@/lib/menu/getHiddenCategoryCounts"
import { getCategorySnap } from "@/lib/menu/getCategorySnap"

test("search commits only after 500ms without more input", (context) => {
  context.mock.timers.enable({ apis: ["setTimeout"] })
  const searches: string[] = []
  const debouncer = createSearchDebouncer((value) => searches.push(value))
  debouncer.schedule("khi")
  context.mock.timers.tick(499)
  assert.deepEqual(searches, [])
  debouncer.schedule("khinkali")
  context.mock.timers.tick(499)
  assert.deepEqual(searches, [])
  context.mock.timers.tick(1)
  assert.deepEqual(searches, ["khinkali"])
})

test("Enter commits immediately and cancels the delayed search", (context) => {
  context.mock.timers.enable({ apis: ["setTimeout"] })
  const searches: string[] = []
  const debouncer = createSearchDebouncer((value) => searches.push(value))
  debouncer.schedule("ხინკალი")
  debouncer.flush("ხინკალი")
  context.mock.timers.tick(1000)
  assert.deepEqual(searches, ["ხინკალი"])
  debouncer.schedule("Хинкали")
  debouncer.cancel()
  context.mock.timers.tick(1000)
  assert.deepEqual(searches, ["ხინკალი"])
})

test("carousel counts track items outside the visible range on both sides", () => {
  assert.deepEqual(getHiddenCategoryCounts([0, 1, 2], 9), { left: 0, right: 6 })
  assert.deepEqual(getHiddenCategoryCounts([3, 4, 5], 9), { left: 3, right: 3 })
  assert.deepEqual(getHiddenCategoryCounts([1, 2, 3], 9), { left: 1, right: 5 })
  assert.deepEqual(getHiddenCategoryCounts([6, 7, 8], 9), { left: 6, right: 0 })
})

test("category selection maps contained edge slides to the correct centered snap", () => {
  const registry = [[0, 1, 2], [3], [4], [5, 6, 7]]
  assert.equal(getCategorySnap(registry, 1), 0)
  assert.equal(getCategorySnap(registry, 3), 1)
  assert.equal(getCategorySnap(registry, 4), 2)
  assert.equal(getCategorySnap(registry, 7), 3)
})
