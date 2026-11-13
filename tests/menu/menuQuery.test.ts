import { ECategory, EPlace } from "@/constants"
import assert from "node:assert/strict"
import { test } from "node:test"

import { queryPlaceholderProducts } from "@/lib/menu/queryPlaceholderProducts"
import type { IProduct } from "@/types/menu"

const products: IProduct[] = Array.from({ length: 31 }, (_, index) => ({
  id: `placeholder-${index}`,
  description: { ka: "Sample description", en: "Sample description", ru: "Sample description" },
  categoryId: index % 2 ? ECategory.Salads : ECategory.Bakery,
  title: {
    ka: `ხაჭაპური ${index}`,
    en: `Khachapuri ${index}`,
    ru: `Хачапури ${index}`,
  },
  imageURL: "/_next/static/media/placeholder.webp",
  isPlaceholder: true,
  priceMinor: 2499,
  placeIds: [EPlace.Dolidze],
  isPopular: false,
  kind: "food",
}))

test("catalog filtering returns every matching dish without pagination", () => {
  const result = queryPlaceholderProducts(products, {
    category: ECategory.All,
    place: EPlace.Dolidze,
    search: "",
    cursor: 0,
  })
  assert.deepEqual(result.products, products)
  assert.equal(result.total, 31)
  assert.equal(result.nextCursor, null)
  assert.deepEqual(
    queryPlaceholderProducts(products, {
      category: ECategory.All,
      place: EPlace.Dolidze,
      search: "",
      cursor: 12,
    }).products,
    products
  )
})

test("search works in all three languages and combines with category", () => {
  for (const search of ["  KHACHAPURI  ", "ხაჭაპური", "ХАЧАПУРИ"]) {
    const result = queryPlaceholderProducts(products, {
      category: ECategory.Salads,
      place: EPlace.Dolidze,
      search,
      cursor: 0,
    })
    assert.equal(result.total, 15)
    assert.ok(result.products.every((product) => product.categoryId === ECategory.Salads))
  }
  assert.equal(
    queryPlaceholderProducts(products, {
      category: ECategory.Bakery,
      place: EPlace.Dolidze,
      search: "Khachapuri 29",
      cursor: 0,
    }).total,
    0
  )
})

test("unmatched searches return an empty result", () => {
  assert.deepEqual(
    queryPlaceholderProducts(products, {
      category: ECategory.All,
      place: EPlace.Dolidze,
      search: "unknown",
      cursor: 0,
    }),
    { products: [], total: 0, nextCursor: null, popularProducts: [], categoryCounts: {} }
  )
})

test("category totals follow category, search, and branch filters", () => {
  const filters = { category: ECategory.All, place: EPlace.Dolidze, search: "", cursor: 0 }
  const first = queryPlaceholderProducts(products, filters)
  assert.deepEqual(first.categoryCounts, { [ECategory.Bakery]: 16, [ECategory.Salads]: 15 })
  assert.deepEqual(
    queryPlaceholderProducts(products, { ...filters, category: ECategory.Salads }).categoryCounts,
    { [ECategory.Salads]: 15 }
  )
  assert.deepEqual(
    queryPlaceholderProducts(products, { ...filters, search: "Khachapuri 29" }).categoryCounts,
    { [ECategory.Salads]: 1 }
  )
  assert.deepEqual(
    queryPlaceholderProducts(products, { ...filters, place: EPlace.Leonidze }).categoryCounts,
    {}
  )
})
