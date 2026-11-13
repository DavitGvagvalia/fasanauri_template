import type { IProduct, TServing } from "@/types/menu"

export interface ICartLine {
  product: IProduct
  serving: TServing | null
  quantity: number
}

export type TCartStorage = Pick<Storage, "getItem" | "setItem">

export interface ICartStore {
  lines: ICartLine[]
  count: number
  totalMinor: number
  ready: boolean
  hydrate: () => void
  addItem: (line: ICartLine) => void
  setQuantity: (productId: string, serving: TServing | null, quantity: number) => void
  clearCart: () => void
  cartOpen: boolean
  setCartOpen: (open: boolean) => void
  openProduct: (line: ICartLine) => void
}
