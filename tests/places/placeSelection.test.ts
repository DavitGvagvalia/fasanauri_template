import assert from "node:assert/strict"
import { test } from "node:test"

import { EPlace, LOCALES } from "@/constants"
import { getMenuFilters } from "@/lib/menu/getMenuFilters"
import { updateMenuFilters } from "@/lib/menu/updateMenuFilters"

test("menu branch changes update URL filters synchronously and retain language and active filters", (context) => {
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window")
  context.after(() => {
    if (originalWindow) {
      Object.defineProperty(globalThis, "window", originalWindow)
    } else {
      Reflect.deleteProperty(globalThis, "window")
    }
  })

  for (const locale of LOCALES) {
    const initial = new URL(
      `https://menu.example/${locale}?place=dolidze&category=salads&search=salad&cursor=12`
    )
    const location = { pathname: initial.pathname, search: initial.search }
    const entries: string[] = []
    const scrolls: ScrollToOptions[] = []
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: {
        location,
        history: {
          pushState: (_state: unknown, _title: string, href: string): void => {
            const next = new URL(href, initial)
            location.search = next.search
            entries.push(next.href)
          },
        },
        scrollTo: (options: ScrollToOptions): void => {
          scrolls.push(options)
        },
      },
    })

    for (const place of [EPlace.Leonidze, EPlace.Kazbegi, EPlace.Dolidze]) {
      updateMenuFilters({ place }, "push")
      const filters = getMenuFilters(new URLSearchParams(location.search))
      assert.equal(filters.place, place)
      assert.equal(filters.category, "salads")
      assert.equal(filters.search, "salad")
      assert.equal(filters.cursor, 0)
      assert.equal(new URL(entries.at(-1) ?? "").pathname, `/${locale}`)
    }

    assert.equal(entries.length, 3)
    assert.equal(scrolls.length, 3)
    updateMenuFilters({ place: EPlace.Dolidze }, "push")
    assert.equal(entries.length, 3)
  }
})
