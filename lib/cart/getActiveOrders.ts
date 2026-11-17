import { getSortedOrders } from "@/lib/cart/getSortedOrders"
import type { IDemoOrder } from "@/types/order"

export const getActiveOrders = (orders: IDemoOrder[]): IDemoOrder[] => {
  return getSortedOrders(orders).filter(
    (order) =>
      order.status === "pending" ||
      order.status === "confirmationRequired" ||
      order.status === "confirmed" ||
      order.status === "onTheWay"
  )
}
