"use client"

import type { ReactElement } from "react"

import { useFormatter, useTranslations } from "next-intl"

import { ORDER_TIME_ZONE } from "@/constants"
import { useCurrentTime } from "@/hooks/useCurrentTime"
import { getOrderArrivalState } from "@/lib/cart/getOrderArrivalState"

interface IProps {
  estimatedArrivalAt?: string | null
}

const OrderArrival = ({ estimatedArrivalAt }: IProps): ReactElement => {
  const t = useTranslations("PendingOrders")
  const formatter = useFormatter()
  const now = useCurrentTime(Boolean(estimatedArrivalAt))
  const arrival = getOrderArrivalState(estimatedArrivalAt, now)

  if (arrival.status === "unknown") {
    return <>{t("awaitingEstimate")}</>
  }
  if (arrival.status === "soon") {
    return <>{t("soon")}</>
  }

  return (
    <time dateTime={new Date(arrival.timestamp).toISOString()}>
      {t("arrivalAt", {
        time: formatter.dateTime(arrival.timestamp, {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: ORDER_TIME_ZONE,
        }),
      })}
    </time>
  )
}

export default OrderArrival
