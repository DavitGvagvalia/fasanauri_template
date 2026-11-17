import type { TProductOrderAction } from "@/types/cart"

export const getProductOrderAction = (quantity: number, savedQuantity = 0): TProductOrderAction => {
  if (quantity === 0) {
    return "removeFromOrder"
  }
  if (savedQuantity === 0) {
    return "addToCart"
  }

  return "updateOrder"
}
