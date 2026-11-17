import type { IDemoOrder } from "@/types/order"

export const getSortedOrders = (orders: IDemoOrder[]): IDemoOrder[] => {
  return [...orders].sort(
    (first, second) =>
      Date.parse(second.createdAt) - Date.parse(first.createdAt) || second.id - first.id
  )
}
