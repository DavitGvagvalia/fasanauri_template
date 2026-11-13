import assert from "node:assert/strict"
import { test } from "node:test"
import { ECategory, EPlace, PLACE_IDS } from "@/constants"
import seeds from "@/lib/menu/placeholderProductSeeds.json"
import { queryPlaceholderProducts } from "@/lib/menu/queryPlaceholderProducts"
import { menuFiltersSchema } from "@/schemas/menuFiltersSchema"
import { productSchema } from "@/schemas/productSchema"

const products = productSchema.array().parse(
  seeds.map((seed) => ({
    ...seed,
    imageURL: "/_next/static/media/placeholder.webp",
    isPlaceholder: true,
    priceMinor: 2499,
  }))
)

test("each restaurant has a filtered menu with shared and exclusive products", () => {
  assert.ok(products.some((product) => product.placeIds.length === 1))
  assert.ok(products.some((product) => product.placeIds.length > 1))
  const signatures = new Set<string>()
  for (const place of PLACE_IDS) {
    const page = queryPlaceholderProducts(products, {
      category: ECategory.All,
      search: "",
      cursor: 0,
      place,
    })
    assert.ok(page.total > 0)
    assert.ok(page.products.every((product) => product.placeIds.includes(place)))
    assert.equal(page.popularProducts.length, 4)
    assert.ok(
      page.popularProducts.every((product) => product.isPopular && product.placeIds.includes(place))
    )
    signatures.add(JSON.stringify(page.products.map((product) => product.id)))
  }
  assert.equal(signatures.size, 5)
})

test("input boundaries accept enum values and reject unknown places/categories", () => {
  assert.equal(menuFiltersSchema.parse({}).place, EPlace.Dolidze)
  assert.equal(menuFiltersSchema.safeParse({ place: "unknown" }).success, false)
  assert.equal(menuFiltersSchema.safeParse({ category: "unknown" }).success, false)
  assert.equal(menuFiltersSchema.safeParse({ search: "x".repeat(101) }).success, false)
})
