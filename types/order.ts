import type { ICartLine } from "@/types/cart"

export type TCartTab = "order" | "pending"
export type TOrderStatus =
  "pending" | "confirmationRequired" | "confirmed" | "onTheWay" | "declined" | "delivered"

export interface IOrderGroup {
  heading: "confirmationRequired" | "title" | "onTheWay" | "history"
  orders: IDemoOrder[]
}

export interface IDemoOrder {
  id: number
  status: TOrderStatus
  lines: ICartLine[]
  count: number
  totalMinor: number
  deliveryFeeMinor: number | null
  estimatedMinutes: number | null
  estimatedArrivalAt: string | null
  declineReason: "tooCringe" | null
  createdAt: string
  note: string
}

export type TOrderArrivalState =
  { status: "unknown" } | { status: "soon" } | { status: "scheduled"; timestamp: number }

export interface IOrderActions {
  setCartTab: (tab: TCartTab) => void
  openOrder: (orderId: number) => void
  toggleOrder: (orderId: number) => void
  requestOrderConfirmation: (orderId: number) => void
  confirmOrder: (orderId: number) => void
}
