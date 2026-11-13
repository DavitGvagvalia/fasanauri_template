import assert from "node:assert/strict"
import { test } from "node:test"

import { CART_STORAGE_KEY, ECategory, EPlace, PLACE_IDS } from "@/constants"
import { createCartStore } from "@/lib/cart/createCartStore"
import { productSchema } from "@/schemas/productSchema"
import type { ICartLine } from "@/types/cart"

const line: ICartLine = {
  product: {
    id: "saved-product",
    title: { ka: "Sample", en: "Sample", ru: "Sample" },
    description: { ka: "Sample", en: "Sample", ru: "Sample" },
    categoryId: ECategory.Bakery,
    kind: "food",
    imageURL: "/_next/static/media/placeholder.webp",
    isPlaceholder: true,
    isPopular: false,
    priceMinor: 2499,
    placeIds: [EPlace.Dolidze],
  },
  serving: null,
  quantity: 2,
}

test("legacy cart image fields migrate to imageURL and gain place availability", () => {
  const product = productSchema.parse({
    id: "legacy",
    categoryId: ECategory.Bakery,
    title: { ka: "ხაჭაპური", en: "Khachapuri", ru: "Хачапури" },
    image: "/_next/static/media/placeholder.webp",
    kind: "food",
    isPlaceholder: true,
  })
  assert.equal(product.imageURL, "/_next/static/media/placeholder.webp")
  assert.equal("image" in product, false)
  assert.deepEqual(product.placeIds, PLACE_IDS)
  assert.deepEqual(product.description, { ka: "", en: "", ru: "" })
})

test("storage is deferred until hydration and legacy carts migrate without losing selections", () => {
  let reads = 0
  let saved = JSON.stringify([
    {
      ...line,
      product: {
        ...line.product,
        imageURL: undefined,
        image: line.product.imageURL,
        priceMinor: undefined,
      },
    },
    { ...line, quantity: 3 },
  ])
  const store = createCartStore(() => ({
    getItem: (key) => {
      assert.equal(key, CART_STORAGE_KEY)
      reads += 1

      return saved
    },
    setItem: (key, value) => {
      assert.equal(key, CART_STORAGE_KEY)
      saved = value
    },
  }))

  assert.equal(reads, 0)
  store.getState().addItem(line)
  assert.deepEqual(store.getState().lines, [])
  store.getState().hydrate()
  assert.equal(store.getState().ready, true)
  assert.equal(store.getState().lines.length, 1)
  assert.equal(store.getState().count, 5)
  assert.equal(store.getState().totalMinor, 12495)
  assert.equal(store.getState().lines[0].product.imageURL, line.product.imageURL)
  store.getState().hydrate()
  assert.equal(reads, 1)
  store.getState().setCartOpen(true)
  assert.deepEqual(JSON.parse(saved), store.getState().lines)
  store.getState().setQuantity(line.product.id, null, 4)
  assert.equal(JSON.parse(saved)[0].quantity, 4)
  store.getState().clearCart()
  assert.deepEqual(JSON.parse(saved), [])
})

test("malformed JSON and invalid stored lines do not break hydration", () => {
  const invalid = [
    "not JSON",
    JSON.stringify([{ ...line, quantity: -1 }]),
    JSON.stringify([{ ...line, serving: "glass" }]),
    JSON.stringify([
      { ...line, product: { ...line.product, imageURL: "https://example.com/tracking" } },
    ]),
  ]
  for (const saved of invalid) {
    const store = createCartStore(() => ({ getItem: () => saved, setItem: () => {} }))
    store.getState().hydrate()

    assert.equal(store.getState().ready, true)
    assert.deepEqual(store.getState().lines, [])
    store.getState().addItem(line)
    assert.equal(store.getState().count, 2)
  }
})

test("unavailable storage still allows cart actions and a new store restores only persisted lines", () => {
  const unavailable = createCartStore(() => {
    throw new Error("Storage unavailable")
  })
  unavailable.getState().hydrate()
  unavailable.getState().addItem(line)

  assert.equal(unavailable.getState().ready, true)
  assert.equal(unavailable.getState().count, 2)
  let saved: string | null = null
  const storage = {
    getItem: (): string | null => saved,
    setItem: (_key: string, value: string): void => {
      saved = value
    },
  }
  const first = createCartStore(() => storage)
  first.getState().hydrate()
  first.getState().addItem(line)
  first.getState().setCartOpen(true)
  const restored = createCartStore(() => storage)
  restored.getState().hydrate()
  assert.deepEqual(restored.getState().lines, [line])
  assert.equal(restored.getState().cartOpen, false)
  unavailable.getState().setQuantity(line.product.id, null, 0)
  assert.equal(unavailable.getState().totalMinor, 0)
})
