import { menuPageSchema } from "@/schemas/menuPageSchema"
import { menuCache } from "@/lib/menu/menuCache"
import type { IMenuFilters, IMenuPage } from "@/types/menu"

export const getProducts = async (
  filters: IMenuFilters,
  signal?: AbortSignal
): Promise<IMenuPage> => {
  const params = new URLSearchParams({
    category: filters.category,
    place: filters.place,
    search: filters.search,
    cursor: String(filters.cursor),
  })
  const cached = menuCache.pages.get(params.toString())
  if (cached) {
    return cached
  }
  const response = await fetch(`/api/products?${params}`, {
    signal,
  })
  if (!response.ok) {
    throw new Error("Unable to load placeholder products")
  }
  const data: unknown = await response.json()

  const page = menuPageSchema.parse(data)
  menuCache.pages.set(params.toString(), page)

  return page
}
