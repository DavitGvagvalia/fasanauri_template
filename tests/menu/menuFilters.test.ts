import assert from "node:assert/strict"
import { test } from "node:test"

import { DEFAULT_PLACE, ECategory, EPlace } from "@/constants"
import { getMenuFilters } from "@/lib/menu/getMenuFilters"

test("initial server and interactive menu filters preserve valid URL selections", () => {
  const params = new URLSearchParams({
    place: EPlace.Leonidze,
    category: ECategory.Salads,
    search: "salad",
    cursor: "12",
    product: "unrelated-product-dialog",
  })

  assert.deepEqual(getMenuFilters(params), {
    place: EPlace.Leonidze,
    category: ECategory.Salads,
    search: "salad",
    cursor: 12,
  })
})

test("menu filter normalization tolerates malformed page URLs without failing the render", () => {
  for (const cursor of ["-1", "1.5", "invalid", "Infinity"]) {
    const params = new URLSearchParams({ place: "unknown", category: "unknown", cursor })

    assert.deepEqual(getMenuFilters(params), {
      place: DEFAULT_PLACE,
      category: ECategory.All,
      search: "",
      cursor: 0,
    })
  }
})

test("menu filter normalization bounds search and restored pagination consistently", () => {
  const filters = getMenuFilters(new URLSearchParams({ search: "a".repeat(101), cursor: "10001" }))

  assert.equal(filters.search.length, 100)
  assert.equal(filters.cursor, 10000)
})
