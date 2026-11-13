import { ECategory, EPlace } from "@/constants"
import assert from "node:assert/strict"
import { test } from "node:test"

import { setCartLineQuantity } from "@/lib/cart/setCartLineQuantity"
import { getCartTotal } from "@/lib/cart/getCartTotal"
import { formatPrice } from "@/lib/formatPrice"
import type { IProduct } from "@/types/menu"

const product: IProduct = {
  id: "placeholder-drink",
  description: { ka: "Sample description", en: "Sample description", ru: "Sample description" },
  categoryId: ECategory.SoftDrinks,
  title: { ka: "ლიმონათი", en: "Lemonade", ru: "Лимонад" },
  imageURL: "/_next/static/media/placeholder.webp",
  kind: "beverage",
  isPlaceholder: true,
  priceMinor: 2499,
  placeIds: [EPlace.Dolidze],
  isPopular: false,
}

test("totals include quantities and separate bottle/glass lines in integer minor units", () => {
  const lines = [
    { product, serving: "bottle" as const, quantity: 2 },
    { product, serving: "glass" as const, quantity: 3 },
  ]
  assert.equal(getCartTotal(lines), 12495)
  assert.equal(getCartTotal(setCartLineQuantity(lines, product.id, "glass", 0)), 4998)
  assert.equal(getCartTotal([]), 0)
})

test("all locales show the lari symbol and two decimal places", () => {
  assert.equal(formatPrice(2499, "en"), "24.99 ₾")
  assert.equal(formatPrice(12495, "en"), "124.95 ₾")
  assert.match(formatPrice(2499, "ka"), /24[.,]99 ₾/)
  assert.match(formatPrice(2499, "ru"), /24[.,]99 ₾/)
})
