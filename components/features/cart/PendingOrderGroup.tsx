import type { ReactElement } from "react"

import { useTranslations } from "next-intl"

import PendingOrderCard from "@/components/features/cart/PendingOrderCard"
import { useCart } from "@/hooks/useCart"
import type { IOrderGroup } from "@/types/order"

interface IProps {
  group: IOrderGroup
}

const PendingOrderGroup = ({ group }: IProps): ReactElement => {
  const t = useTranslations("PendingOrders")
  const selectedOrderId = useCart((state) => state.selectedOrderId)
  const toggleOrder = useCart((state) => state.toggleOrder)

  return (
    <section
      aria-label={t(group.heading)}
      className="space-y-4"
    >
      <h2 className="text-lg font-semibold">{t(group.heading)}</h2>
      {group.orders.map((order) => (
        <PendingOrderCard
          key={order.id}
          order={order}
          selected={order.id === selectedOrderId}
          onSelect={() => toggleOrder(order.id)}
        />
      ))}
    </section>
  )
}

export default PendingOrderGroup
