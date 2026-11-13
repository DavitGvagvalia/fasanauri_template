import type { TLocale } from "@/types/locale"
import type { ECategory, EPlace } from "@/constants"

export type TLocalizedTitle = Record<TLocale, string>
export type TServing = "bottle" | "glass"
export type TCategoryCounts = Partial<Record<ECategory, number>>

export interface ICategory {
  id: ECategory
  title: TLocalizedTitle
  imageURL: string
}

export interface IProduct {
  id: string
  categoryId: ECategory
  title: TLocalizedTitle
  description: TLocalizedTitle
  kind: "food" | "beverage"
  imageURL: string
  isPlaceholder: true
  priceMinor: number
  placeIds: EPlace[]
  isPopular: boolean
}

export interface IMenuFilters {
  category: ECategory
  place: EPlace
  search: string
  cursor: number
}

export interface IMenuPage {
  products: IProduct[]
  nextCursor: number | null
  total: number
  popularProducts: IProduct[]
  categoryCounts: TCategoryCounts
}

export interface IInitialMenuData {
  categories: ICategory[]
  products: IProduct[]
}

export interface IProductGroup {
  category: ICategory
  products: IProduct[]
}

export interface IHiddenCategoryCounts {
  left: number
  right: number
}

export interface ISearchDebouncer {
  schedule: (value: string) => void
  flush: (value: string) => void
  cancel: () => void
}
