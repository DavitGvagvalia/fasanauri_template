import type { ICategory, IProduct, IProductGroup } from "@/types/menu"

export const groupMenuProducts = (
  products: IProduct[],
  categories: ICategory[]
): IProductGroup[] => {
  return categories
    .map((category) => ({
      category,
      products: products.filter((product) => product.categoryId === category.id),
    }))
    .filter((group) => group.products.length > 0)
}
