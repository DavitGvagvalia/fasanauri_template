import type { ICartLine } from "@/types/cart"

export const getCartTotal = (lines: ICartLine[]): number => {
  return lines.reduce((total, line) => total + line.product.priceMinor * line.quantity, 0)
}
