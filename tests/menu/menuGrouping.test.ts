import { ECategory } from "@/constants"
import assert from "node:assert/strict"
import { test } from "node:test"

import { groupMenuProducts } from "@/lib/menu/groupMenuProducts"
import seeds from "@/lib/menu/placeholderProductSeeds.json"
import { productSchema } from "@/schemas/productSchema"
import type { ICategory } from "@/types/menu"

const products = productSchema.array().parse(
  seeds.map((seed) => ({
    ...seed,
    imageURL: "/_next/static/media/placeholder.webp",
    isPlaceholder: true,
    priceMinor: 2499,
  }))
)

test("all-dishes groups follow category order and omit empty categories", () => {
  const categories: ICategory[] = [ECategory.Salads, ECategory.Khinkali, ECategory.Popular].map(
    (id) => ({
      id,
      title: { ka: id, en: id, ru: id },
      imageURL: "/placeholder.webp",
    })
  )
  const groups = groupMenuProducts(products, categories)
  assert.deepEqual(
    groups.map((group) => group.category.id),
    [ECategory.Salads, ECategory.Khinkali]
  )
  assert.ok(
    groups.every((group) =>
      group.products.every((product) => product.categoryId === group.category.id)
    )
  )
})
