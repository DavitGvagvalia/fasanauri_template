import type { ReactElement } from "react"

import { BellRing, CheckCircle2, Clock3, PackageCheck, Truck, XCircle } from "lucide-react"
import { useTranslations } from "next-intl"

import { Badge } from "@/components/ui/badge"
import type { IDemoOrder } from "@/types/order"
import { cn } from "@/lib/utils"

interface IProps {
  status: IDemoOrder["status"]
}

const OrderStatusBadge = ({ status }: IProps): ReactElement => {
  const t = useTranslations("PendingOrders")
  const icons = {
    pending: Clock3,
    confirmationRequired: BellRing,
    confirmed: CheckCircle2,
    onTheWay: Truck,
    declined: XCircle,
    delivered: PackageCheck,
  }
  const Icon = icons[status]

  return (
    <Badge
      variant={
        status === "declined"
          ? "destructive"
          : status === "confirmationRequired"
            ? "default"
            : "secondary"
      }
      className={cn(
        "h-auto gap-1.5 rounded-md py-1 whitespace-normal",
        status === "confirmationRequired" && "bg-confirmation text-confirmation-foreground"
      )}
    >
      <Icon
        aria-hidden="true"
        className={cn(status === "confirmationRequired" && "confirmation-bell")}
      />
      {t(status)}
    </Badge>
  )
}

export default OrderStatusBadge
