import type { IDemoOrder } from "@/types/order"

export const getDemoOrderTotal = (order: IDemoOrder): number => {
  return order.totalMinor + (order.status === "pending" ? 0 : (order.deliveryFeeMinor ?? 0))
}
