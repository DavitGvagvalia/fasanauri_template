"use client"

import { useEffect, useState } from "react"
import { getCategories } from "@/lib/api/getCategories"
import { menuCache } from "@/lib/menu/menuCache"
import type { ICategory } from "@/types/menu"

interface IUseMenuCategoriesReturn {
  categories: ICategory[]
  error: boolean
  loading: boolean
  retry: () => void
}

export const useMenuCategories = (initialCategories: ICategory[]): IUseMenuCategoriesReturn => {
  const [categories, setCategories] = useState<ICategory[]>(initialCategories)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (attempt === 0) {
      menuCache.categories = initialCategories

      return
    }
    const controller = new AbortController()
    const load = async (): Promise<void> => {
      try {
        const data = await getCategories(controller.signal)
        if (!controller.signal.aborted) {
          setCategories(data)
          setError(false)
        }
      } catch {
        if (!controller.signal.aborted) {
          setError(true)
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }
    void load()

    return () => controller.abort()
  }, [attempt, initialCategories])

  const retry = (): void => {
    setLoading(true)
    setAttempt((value) => value + 1)
  }

  return { categories, error, loading, retry }
}
