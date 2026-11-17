import type { IProduct, TServing } from "@/types/menu"
import type { IDemoOrder, IOrderActions, TCartTab } from "@/types/order"

export interface ICartLine {
  product: IProduct
  serving: TServing | null
  quantity: number
}

export type TCartStorage = Pick<Storage, "getItem" | "setItem">

export type TProductOrderAction = "addToCart" | "updateOrder" | "removeFromOrder"

export interface ICartStore extends IOrderActions {
  lines: ICartLine[]
  count: number
  totalMinor: number
  ready: boolean
  hydrate: (demoImageURL?: string) => void
  addItem: (line: ICartLine) => void
  setQuantity: (productId: string, serving: TServing | null, quantity: number) => void
  clearCart: () => void
  pendingOrders: IDemoOrder[]
  selectedOrderId: number | null
  cartTab: TCartTab
  submitDemoOrder: (note?: string) => boolean
  cartOpen: boolean
  setCartOpen: (open: boolean) => void
  openProduct: (line: ICartLine) => void
}
