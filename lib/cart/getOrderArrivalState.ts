import { ORDER_MINUTE_MS } from "@/constants"
import type { TOrderArrivalState } from "@/types/order"

export const getOrderArrivalState = (
  estimatedArrivalAt: string | null | undefined,
  now = Date.now()
): TOrderArrivalState => {
  const timestamp = estimatedArrivalAt ? Date.parse(estimatedArrivalAt) : Number.NaN
  if (!Number.isFinite(timestamp)) {
    return { status: "unknown" }
  }
  if (timestamp - now < ORDER_MINUTE_MS) {
    return { status: "soon" }
  }

  return { status: "scheduled", timestamp }
}
