import {
  DEMO_DELIVERY_FEE_MINOR,
  DEMO_ESTIMATED_DURATION_MINUTES,
  PLACEHOLDER_PRICE_MINOR,
  DEMO_TRANSITION_ORDER_ID,
  ORDER_MINUTE_MS,
} from "@/constants"
import { getCartTotal } from "@/lib/cart/getCartTotal"
import seeds from "@/lib/menu/placeholderProductSeeds.json"
import { productSchema } from "@/schemas/productSchema"
import type { ICartLine } from "@/types/cart"
import type { IDemoOrder } from "@/types/order"

export const createDemoOrders = (imageURL: string, now = Date.now()): IDemoOrder[] => {
  const products = ["placeholder-khinkali", "placeholder-khachapuri", "placeholder-salad"].map(
    (id) => {
      const seed = seeds.find((product) => product.id === id)

      return productSchema.parse({
        ...seed,
        imageURL,
        isPlaceholder: true,
        priceMinor: PLACEHOLDER_PRICE_MINOR,
      })
    }
  )
  const pendingLines: ICartLine[] = [
    { product: products[0], serving: null, quantity: 2 },
    { product: products[1], serving: null, quantity: 1 },
  ]
  const declinedLines: ICartLine[] = [{ product: products[2], serving: null, quantity: 1 }]

  return [
    {
      id: 1,
      status: "pending",
      lines: pendingLines,
      count: 3,
      totalMinor: getCartTotal(pendingLines),
      deliveryFeeMinor: DEMO_DELIVERY_FEE_MINOR,
      estimatedMinutes: DEMO_ESTIMATED_DURATION_MINUTES,
      estimatedArrivalAt: new Date(
        now + DEMO_ESTIMATED_DURATION_MINUTES * ORDER_MINUTE_MS
      ).toISOString(),
      declineReason: null,
      createdAt: new Date(now - 240_000).toISOString(),
      note: "",
    },
    {
      id: 2,
      status: "declined",
      lines: declinedLines,
      count: 1,
      totalMinor: getCartTotal(declinedLines),
      deliveryFeeMinor: 0,
      estimatedMinutes: null,
      estimatedArrivalAt: null,
      declineReason: "tooCringe",
      createdAt: new Date(now - 600_000).toISOString(),
      note: "",
    },
    {
      id: 3,
      status: "confirmationRequired",
      lines: pendingLines.map((line) => ({ ...line })),
      count: 3,
      totalMinor: getCartTotal(pendingLines),
      deliveryFeeMinor: DEMO_DELIVERY_FEE_MINOR,
      estimatedMinutes: DEMO_ESTIMATED_DURATION_MINUTES,
      estimatedArrivalAt: new Date(
        now + DEMO_ESTIMATED_DURATION_MINUTES * ORDER_MINUTE_MS
      ).toISOString(),
      declineReason: null,
      createdAt: new Date(now - 120_000).toISOString(),
      note: "",
    },
    ...[4, 5].map((id): IDemoOrder => ({
      id,
      status: "delivered",
      lines: declinedLines.map((line) => ({ ...line })),
      count: 1,
      totalMinor: getCartTotal(declinedLines),
      deliveryFeeMinor: DEMO_DELIVERY_FEE_MINOR,
      estimatedMinutes: DEMO_ESTIMATED_DURATION_MINUTES,
      estimatedArrivalAt: new Date(
        now -
          (id - 3) * 86_400_000 -
          id * 3_600_000 +
          DEMO_ESTIMATED_DURATION_MINUTES * ORDER_MINUTE_MS
      ).toISOString(),
      declineReason: null,
      createdAt: new Date(now - (id - 3) * 86_400_000 - id * 3_600_000).toISOString(),
      note: "",
    })),
    {
      id: 7,
      status: "onTheWay",
      lines: pendingLines.map((line) => ({ ...line })),
      count: 3,
      totalMinor: getCartTotal(pendingLines),
      deliveryFeeMinor: DEMO_DELIVERY_FEE_MINOR,
      estimatedMinutes: DEMO_ESTIMATED_DURATION_MINUTES,
      estimatedArrivalAt: new Date(now + 15 * ORDER_MINUTE_MS).toISOString(),
      declineReason: null,
      createdAt: new Date(now - 20 * ORDER_MINUTE_MS).toISOString(),
      note: "",
    },
    {
      id: DEMO_TRANSITION_ORDER_ID,
      status: "pending",
      lines: pendingLines.map((line) => ({ ...line })),
      count: 3,
      totalMinor: getCartTotal(pendingLines),
      deliveryFeeMinor: null,
      estimatedMinutes: null,
      estimatedArrivalAt: null,
      declineReason: null,
      createdAt: new Date(now).toISOString(),
      note: "",
    },
  ]
}
