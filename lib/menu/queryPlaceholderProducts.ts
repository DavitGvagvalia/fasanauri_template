import { ECategory } from "@/constants"
import type { IMenuFilters, IMenuPage, IProduct, TCategoryCounts } from "@/types/menu"

// filters the complete catalog by branch and category, matching search across every translation.
export const queryPlaceholderProducts = (
  products: IProduct[],
  filters: IMenuFilters
): IMenuPage => {
  const search = filters.search.trim().normalize("NFKC").toLocaleLowerCase()
  const filtered = products.filter((product) => {
    return (
      product.placeIds.includes(filters.place) &&
      (filters.category === ECategory.All ||
        (filters.category === ECategory.Popular
          ? product.isPopular
          : product.categoryId === filters.category)) &&
      (!search ||
        Object.values(product.title).some((title) =>
          title.normalize("NFKC").toLocaleLowerCase().includes(search)
        ))
    )
  })
  const categoryCounts: TCategoryCounts = {}
  for (const product of filtered) {
    categoryCounts[product.categoryId] = (categoryCounts[product.categoryId] ?? 0) + 1
  }

  return {
    products: filtered,
    total: filtered.length,
    nextCursor: null,
    popularProducts: filtered.filter((product) => product.isPopular).slice(0, 4),
    categoryCounts,
  }
}
