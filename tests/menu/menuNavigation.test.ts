import assert from "node:assert/strict"
import { test } from "node:test"
import { NextRequest } from "next/server"

import { DEFAULT_PLACE, LOCALES, PLACE_IDS } from "@/constants"
import { getMenuPlaceRedirect } from "@/lib/menu/getMenuPlaceRedirect"
import proxy from "@/proxy"

test("bare and localized menus add the default place while preserving filters", () => {
  for (const pathname of ["/", ...LOCALES.flatMap((locale) => [`/${locale}`, `/${locale}/`])]) {
    const source = new URL(
      `${pathname}?category=cold-dishes&search=test&cursor=12`,
      "https://menu.example"
    )
    const destination = getMenuPlaceRedirect(source)
    assert.ok(destination)
    assert.equal(destination.pathname, pathname)
    assert.equal(destination.searchParams.get("place"), DEFAULT_PLACE)
    for (const key of ["category", "search", "cursor"]) {
      assert.equal(destination.searchParams.get(key), source.searchParams.get(key))
    }
    assert.equal(source.searchParams.has("place"), false)
    assert.equal(getMenuPlaceRedirect(destination), null)
  }
})

test("every valid restaurant remains unchanged without a redirect loop", () => {
  for (const locale of LOCALES) {
    for (const place of PLACE_IDS) {
      assert.equal(
        getMenuPlaceRedirect(new URL(`https://menu.example/${locale}?place=${place}`)),
        null
      )
      const response = proxy(new NextRequest(`https://menu.example/${locale}?place=${place}`))
      assert.equal(response.headers.get("location"), null)
    }
  }
})

test("empty or unknown menu places normalize to the existing default", () => {
  for (const place of ["", "unknown"]) {
    const destination = getMenuPlaceRedirect(new URL(`https://menu.example/en?place=${place}`))
    assert.equal(destination?.searchParams.get("place"), DEFAULT_PLACE)
  }
})

test("non-menu routes are outside place normalization", () => {
  for (const pathname of [
    "/en/cart",
    "/ru/checkout",
    "/ka/login",
    "/en/missing",
    "/api/products",
    "/images/photo.jpg",
    "/fr",
  ]) {
    assert.equal(getMenuPlaceRedirect(new URL(pathname, "https://menu.example")), null)
  }
})

test("locale negotiation and default place share a single redirect", () => {
  const response = proxy(
    new NextRequest("https://menu.example/?category=cold-dishes", {
      headers: { "accept-language": "ru" },
    })
  )
  assert.equal(response.status, 307)
  const destination = new URL(response.headers.get("location") ?? "")
  assert.equal(destination.pathname, "/ru")
  assert.equal(destination.searchParams.get("place"), DEFAULT_PLACE)
  assert.equal(destination.searchParams.get("category"), "cold-dishes")
  assert.equal(proxy(new NextRequest(destination)).headers.get("location"), null)
})

test("locale redirects preserve an explicitly chosen restaurant", () => {
  const response = proxy(
    new NextRequest("https://menu.example/?place=leonidze", {
      headers: { "accept-language": "en" },
    })
  )
  const destination = new URL(response.headers.get("location") ?? "")
  assert.equal(destination.pathname, "/en")
  assert.equal(destination.searchParams.get("place"), "leonidze")
})
