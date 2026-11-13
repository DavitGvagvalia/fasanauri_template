import { categoriesSchema } from "@/schemas/categoriesSchema"
import { menuCache } from "@/lib/menu/menuCache"
import type { ICategory } from "@/types/menu"

export const getCategories = async (signal?: AbortSignal): Promise<ICategory[]> => {
  if (menuCache.categories) {
    return menuCache.categories
  }
  const response = await fetch("/api/categories", { signal })
  if (!response.ok) {
    throw new Error("Unable to load categories")
  }
  const data: unknown = await response.json()

  const categories = categoriesSchema.parse(data)
  signal?.throwIfAborted()
  menuCache.categories = categories

  return categories
}
