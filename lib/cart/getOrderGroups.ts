import { getSortedOrders } from "@/lib/cart/getSortedOrders"
import type { IDemoOrder, IOrderGroup } from "@/types/order"

export const getOrderGroups = (orders: IDemoOrder[]): IOrderGroup[] => {
  const sorted = getSortedOrders(orders)
  const groups: IOrderGroup[] = [
    {
      heading: "onTheWay",
      orders: sorted.filter((order) => order.status === "onTheWay"),
    },
    {
      heading: "confirmationRequired",
      orders: sorted.filter((order) => order.status === "confirmationRequired"),
    },
    {
      heading: "title",
      orders: sorted.filter((order) => order.status === "pending" || order.status === "confirmed"),
    },
    {
      heading: "history",
      orders: sorted.filter((order) => order.status === "declined" || order.status === "delivered"),
    },
  ]

  return groups.filter((group) => group.orders.length > 0)
}
