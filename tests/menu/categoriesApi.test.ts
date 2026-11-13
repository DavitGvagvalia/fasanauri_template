import assert from "node:assert/strict"
import { test } from "node:test"

import { ECategory } from "@/constants"
import { getCategories } from "@/lib/api/getCategories"
import { menuCache } from "@/lib/menu/menuCache"

test("category fetching validates the public endpoint response, reuses cache, and rejects failed or aborted loads", async (context) => {
  const originalFetch = globalThis.fetch
  const originalCategories = menuCache.categories
  context.after(() => {
    globalThis.fetch = originalFetch
    menuCache.categories = originalCategories
  })
  menuCache.categories = null
  const categories = [
    {
      id: ECategory.Salads,
      imageURL: "/_next/static/media/salad.webp",
      title: { ka: "salad", en: "salad", ru: "salad" },
    },
  ]
  const controller = new AbortController()
  let calls = 0
  globalThis.fetch = async (input, options): Promise<Response> => {
    calls += 1
    assert.equal(input, "/api/categories")
    assert.equal(options?.signal, controller.signal)

    return Response.json(categories)
  }
  assert.deepEqual(await getCategories(controller.signal), categories)
  assert.deepEqual(await getCategories(), categories)
  assert.equal(calls, 1)

  menuCache.categories = null
  globalThis.fetch = async (): Promise<Response> => Response.json([{ id: "unknown" }])
  await assert.rejects(getCategories())
  assert.equal(menuCache.categories, null)

  globalThis.fetch = async (): Promise<Response> =>
    Response.json({ error: "failed" }, { status: 503 })
  await assert.rejects(getCategories(), /Unable to load categories/)
  assert.equal(menuCache.categories, null)

  globalThis.fetch = async (): Promise<Response> => {
    controller.abort()

    return Response.json(categories)
  }
  await assert.rejects(getCategories(controller.signal), { name: "AbortError" })
  assert.equal(menuCache.categories, null)
})
