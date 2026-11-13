import type { IProduct } from "@/types/menu"

export const mergeMenuProducts = (previous: IProduct[], incoming: IProduct[]): IProduct[] => {
  // navigation can replay an effect for a batch that is already in the list.
  const products = new Map(previous.map((product) => [product.id, product]))
  for (const product of incoming) {
    products.set(product.id, product)
  }

  return [...products.values()]
}
