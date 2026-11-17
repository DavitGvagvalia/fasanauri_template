import { DEMO_CONFIRMATION_DELAY_MS, DEMO_TRANSITION_ORDER_ID } from "@/constants"

export const scheduleDemoOrderConfirmation = (
  requestConfirmation: (orderId: number) => void
): (() => void) => {
  const timer = setTimeout(
    () => requestConfirmation(DEMO_TRANSITION_ORDER_ID),
    DEMO_CONFIRMATION_DELAY_MS
  )

  return () => clearTimeout(timer)
}
