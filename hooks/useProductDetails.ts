"use client"

import { useEffect, useState } from "react"
import { getProduct } from "@/lib/api/getProduct"
import { productDetailsCache } from "@/lib/menu/productDetailsCache"
import type { IProduct } from "@/types/menu"

interface IUseProductDetailsReturn {
  product: IProduct | null
  error: boolean
}

export const useProductDetails = (id: string | null): IUseProductDetailsReturn => {
  const [result, setResult] = useState<{
    id: string | null
    product: IProduct | null
    error: boolean
  }>({ id: null, product: null, error: false })
  const cached = id ? productDetailsCache.get(id) : undefined
  useEffect(() => {
    if (!id) {
      return
    }
    const controller = new AbortController()
    const load = async (): Promise<void> => {
      try {
        const product = await getProduct(id, controller.signal)
        if (!controller.signal.aborted) {
          setResult({ id, product, error: false })
        }
      } catch {
        if (!controller.signal.aborted) {
          setResult({ id, product: null, error: true })
        }
      }
    }
    void load()

    return () => controller.abort()
  }, [id])

  return {
    product: cached ?? (result.id === id || !id ? result.product : null),
    error: result.id === id && result.error,
  }
}
