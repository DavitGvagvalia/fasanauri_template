import type { ICartLine, ICartStore } from "@/types/cart"

// product details commit an absolute quantity so editing never adds duplicate quantities.
export const saveProductOrder = (store: ICartStore, selection: ICartLine): void => {
  if (!store.ready) {
    return
  }
  // product detail edits target the draft even when order history was selected.
  store.setCartTab("order")
  const existing = store.lines.some(
    (line) => line.product.id === selection.product.id && line.serving === selection.serving
  )
  if (existing) {
    store.setQuantity(selection.product.id, selection.serving, selection.quantity)

    return
  }
  store.addItem(selection)
}
