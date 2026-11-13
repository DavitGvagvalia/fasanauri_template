import assert from "node:assert/strict"
import { test } from "node:test"

import { ECategory, EPlace, LOCALES } from "@/constants"
import { getProductShareURL } from "@/lib/menu/getProductShareURL"
import { updateProductDialogURL } from "@/lib/menu/updateProductDialogURL"
import type { IProduct } from "@/types/menu"

const product: IProduct = {
  id: "product-with-special-title",
  description: { ka: "Sample description", en: "Sample description", ru: "Sample description" },
  categoryId: ECategory.Salads,
  title: { ka: "სალათი & ყველი", en: "Salad & cheese", ru: "Салат & сыр" },
  imageURL: "/images/product.webp",
  placeIds: [EPlace.Leonidze],
  priceMinor: 2499,
  kind: "food",
  isPlaceholder: true,
  isPopular: false,
}

test("shared product links retain language, identity, and a place that serves the product", () => {
  for (const locale of LOCALES) {
    const url = new URL(getProductShareURL("https://menu.example", locale, product))
    assert.equal(url.origin, "https://menu.example")
    assert.equal(url.pathname, `/${locale}`)
    assert.equal(url.searchParams.get("product"), product.id)
    assert.equal(url.searchParams.get("place"), EPlace.Leonidze)
    assert.equal(url.searchParams.has("search"), false)
  }
})

test("sharing from checkout uses the localized menu and never includes contact or checkout parameters", () => {
  const source = new URL("https://menu.example/ru/checkout?name=private&product=old")
  const shared = new URL(getProductShareURL(source.origin, "ru", product))
  assert.equal(shared.pathname, "/ru")
  assert.deepEqual([...shared.searchParams.keys()].sort(), ["place", "product"])
  assert.equal(shared.searchParams.get("product"), product.id)
})

test("products with no active restaurant never put an undefined place in the shared URL", () => {
  const shared = new URL(
    getProductShareURL("https://menu.example", "ka", { ...product, placeIds: [] })
  )
  assert.equal(shared.searchParams.has("place"), false)
  assert.equal(shared.searchParams.get("product"), product.id)
})

test("opening details preserves the current route and filters; closing uses Back or cleans a direct link", (context) => {
  const location = { href: "https://menu.example/en?place=dolidze&search=salad&cursor=12" }
  let backCount = 0
  const history = {
    state: null as unknown,
    pushState: (state: unknown, _title: string, url: URL): void => {
      history.state = state
      location.href = url.href
    },
    replaceState: (state: unknown, _title: string, url: URL): void => {
      history.state = state
      location.href = url.href
    },
    back: (): void => {
      backCount += 1
    },
  }
  Object.defineProperty(globalThis, "window", { configurable: true, value: { history, location } })
  context.after(() => {
    Reflect.deleteProperty(globalThis, "window")
  })
  updateProductDialogURL(product.id, "glass")
  const opened = new URL(location.href)
  assert.equal(opened.pathname, "/en")
  assert.equal(opened.searchParams.get("search"), "salad")
  assert.equal(opened.searchParams.get("cursor"), "12")
  assert.equal(opened.searchParams.get("product"), product.id)
  assert.equal(opened.searchParams.get("serving"), "glass")
  updateProductDialogURL(null)
  assert.equal(backCount, 1)
  history.state = null
  updateProductDialogURL(null)
  const closed = new URL(location.href)
  assert.equal(closed.searchParams.has("product"), false)
  assert.equal(closed.searchParams.has("serving"), false)
  assert.equal(closed.searchParams.get("search"), "salad")
})
