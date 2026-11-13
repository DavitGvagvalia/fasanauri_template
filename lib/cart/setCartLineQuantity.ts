import { MAX_CART_QUANTITY } from "@/constants"
import type { ICartLine } from "@/types/cart"
import type { TServing } from "@/types/menu"

// updates only the selected serving and removes its line when quantity reaches zero.
export const setCartLineQuantity = (
  lines: ICartLine[],
  productId: string,
  serving: TServing | null,
  quantity: number
): ICartLine[] => {
  if (!Number.isFinite(quantity)) {
    return lines
  }

  return lines
    .map((line) =>
      line.product.id === productId && line.serving === serving
        ? { ...line, quantity: Math.min(MAX_CART_QUANTITY, Math.floor(quantity)) }
        : line
    )
    .filter((line) => line.quantity > 0)
}
