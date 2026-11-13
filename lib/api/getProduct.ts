import { productSchema } from "@/schemas/productSchema"
import { productDetailsCache } from "@/lib/menu/productDetailsCache"
import type { IProduct } from "@/types/menu"

export const getProduct = async (id: string, signal?: AbortSignal): Promise<IProduct> => {
  const cached = productDetailsCache.get(id)
  if (cached) {
    return cached
  }
  const response = await fetch(`/api/products/${encodeURIComponent(id)}`, { signal })
  if (!response.ok) {
    throw new Error("Unable to load product")
  }
  const data: unknown = await response.json()
  const product = productSchema.parse(data)
  productDetailsCache.set(id, product)

  return product
}
