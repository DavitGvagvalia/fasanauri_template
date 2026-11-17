import type { StoreApi } from "zustand/vanilla"

import {
  DEMO_DELIVERY_FEE_MINOR,
  DEMO_ESTIMATED_DURATION_MINUTES,
  ORDER_MINUTE_MS,
} from "@/constants"
import type { ICartStore } from "@/types/cart"
import type { IOrderActions } from "@/types/order"
import { updateProductDialogURL } from "@/lib/menu/updateProductDialogURL"

export const createOrderActions = (
  set: StoreApi<ICartStore>["setState"],
  get: StoreApi<ICartStore>["getState"]
): IOrderActions => {
  return {
    setCartTab: (cartTab): void => {
      set({ cartTab })
    },
    openOrder: (orderId): void => {
      if (get().pendingOrders.some((order) => order.id === orderId)) {
        if (
          typeof window !== "undefined" &&
          window.location?.href &&
          new URL(window.location.href).searchParams.has("product")
        ) {
          updateProductDialogURL(null)
        }
        set({ selectedOrderId: orderId, cartTab: "pending", cartOpen: true })
      }
    },
    toggleOrder: (orderId): void => {
      if (get().pendingOrders.some((order) => order.id === orderId)) {
        set({ selectedOrderId: get().selectedOrderId === orderId ? null : orderId })
      }
    },
    requestOrderConfirmation: (orderId): void => {
      set({
        pendingOrders: get().pendingOrders.map((order) =>
          order.id === orderId && order.status === "pending"
            ? {
                ...order,
                status: "confirmationRequired",
                deliveryFeeMinor: DEMO_DELIVERY_FEE_MINOR,
                estimatedMinutes: DEMO_ESTIMATED_DURATION_MINUTES,
                estimatedArrivalAt: new Date(
                  Date.now() + DEMO_ESTIMATED_DURATION_MINUTES * ORDER_MINUTE_MS
                ).toISOString(),
              }
            : order
        ),
      })
    },
    confirmOrder: (orderId): void => {
      set({
        pendingOrders: get().pendingOrders.map((order) =>
          order.id === orderId &&
          order.status === "confirmationRequired" &&
          order.deliveryFeeMinor !== null
            ? { ...order, status: "confirmed" }
            : order
        ),
      })
    },
  }
}
