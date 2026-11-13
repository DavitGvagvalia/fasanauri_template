import "server-only"

import placeholderFood from "@/assets/images/placeholder_food.webp"
import { PLACEHOLDER_PRICE_MINOR } from "@/constants"
import { PLACEHOLDER_CATEGORIES } from "@/lib/menu/placeholderCategories"
import seeds from "@/lib/menu/placeholderProductSeeds.json"
import { productSchema } from "@/schemas/productSchema"
import type { IProduct } from "@/types/menu"

const categoryOrder = new Map(PLACEHOLDER_CATEGORIES.map((category, index) => [category.id, index]))

// this catalog s descriptions and prices remain placeholder data for the frontend demo only.
export const PLACEHOLDER_PRODUCTS: IProduct[] = productSchema
  .array()
  .parse(
    seeds.map((seed) => ({
      ...seed,
      imageURL: placeholderFood.src,
      isPlaceholder: true,
      priceMinor: PLACEHOLDER_PRICE_MINOR,
    }))
  )
  .sort(
    (first, second) =>
      (categoryOrder.get(first.categoryId) ?? 0) - (categoryOrder.get(second.categoryId) ?? 0)
  )
