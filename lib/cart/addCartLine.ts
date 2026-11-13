import { MAX_CART_QUANTITY } from "@/constants"
import type { ICartLine } from "@/types/cart"

// merges matching product and serving identities while enforcing the cart quantity limit.
export const addCartLine = (lines: ICartLine[], item: ICartLine): ICartLine[] => {
  const { product, serving, quantity } = item
  if (
    !Number.isFinite(quantity) ||
    quantity < 1 ||
    (product.kind === "beverage" && !serving) ||
    (product.kind === "food" && serving !== null)
  ) {
    return lines
  }
  const matches = (line: ICartLine): boolean => {
    return line.product.id === product.id && line.serving === serving
  }
  const boundedQuantity = Math.min(MAX_CART_QUANTITY, Math.floor(quantity))
  if (lines.some(matches)) {
    return lines.map((line) =>
      matches(line)
        ? { ...line, quantity: Math.min(MAX_CART_QUANTITY, line.quantity + boundedQuantity) }
        : line
    )
  }

  return [...lines, { product, serving, quantity: boundedQuantity }]
}
