import { getActiveOrders } from "@/lib/cart/getActiveOrders"
import type { IDemoOrder } from "@/types/order"

export const getImportantOrders = (orders: IDemoOrder[]): IDemoOrder[] => {
  const active = getActiveOrders(orders)
  const priority = active.some((order) => order.status === "confirmationRequired")
    ? "confirmationRequired"
    : active.some((order) => order.status === "pending")
      ? "pending"
      : "confirmed"

  return [
    ...active.filter((order) => order.status === "onTheWay"),
    ...active.filter((order) => order.status === priority),
  ]
}
