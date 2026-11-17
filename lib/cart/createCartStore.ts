import { createStore } from "zustand/vanilla"
import type { StoreApi } from "zustand/vanilla"

import { CART_STORAGE_KEY } from "@/constants"
import { addCartLine } from "@/lib/cart/addCartLine"
import { getCartTotal } from "@/lib/cart/getCartTotal"
import { createDemoOrders } from "@/lib/cart/createDemoOrders"
import { createOrderActions } from "@/lib/cart/createOrderActions"
import { setCartLineQuantity } from "@/lib/cart/setCartLineQuantity"
import { productDetailsCache } from "@/lib/menu/productDetailsCache"
import { updateProductDialogURL } from "@/lib/menu/updateProductDialogURL"
import { cartStorageSchema } from "@/schemas/cartStorageSchema"
import { orderNoteSchema } from "@/schemas/orderNoteSchema"
import type { ICartLine, ICartStore, TCartStorage } from "@/types/cart"

export const createCartStore = (
  getStorage: () => TCartStorage = () => window.localStorage
): StoreApi<ICartStore> => {
  return createStore<ICartStore>()((set, get) => {
    const updateLines = (lines: ICartLine[], ready = get().ready): void => {
      set({
        lines,
        ready,
        count: lines.reduce((total, line) => total + line.quantity, 0),
        totalMinor: getCartTotal(lines),
      })
      if (ready) {
        try {
          // keeps the existing array format so previously saved demo carts remain compatible.
          getStorage().setItem(CART_STORAGE_KEY, JSON.stringify(lines))
        } catch {
          // storage restrictions must not prevent in memory cart operations.
        }
      }
    }

    return {
      ...createOrderActions(set, get),
      lines: [],
      count: 0,
      totalMinor: 0,
      ready: false,
      cartOpen: false,
      pendingOrders: [],
      selectedOrderId: null,
      cartTab: "order",
      hydrate: (demoImageURL): void => {
        if (get().ready) {
          return
        }
        let lines: ICartLine[] = []
        try {
          const saved = getStorage().getItem(CART_STORAGE_KEY)
          const value: unknown = saved ? JSON.parse(saved) : []
          const parsed = cartStorageSchema.safeParse(value)
          if (parsed.success) {
            lines = parsed.data.reduce<ICartLine[]>(addCartLine, [])
          }
        } catch {
          // malformed or inaccessible storage restores an empty demo cart.
        }
        updateLines(lines, true)
        if (demoImageURL) {
          const pendingOrders = createDemoOrders(demoImageURL)
          set({ pendingOrders, selectedOrderId: pendingOrders[0].id })
        }
      },
      addItem: (line): void => {
        if (get().ready) {
          updateLines(addCartLine(get().lines, line))
        }
      },
      setQuantity: (productId, serving, quantity): void => {
        if (get().ready) {
          updateLines(setCartLineQuantity(get().lines, productId, serving, quantity))
        }
      },
      clearCart: (): void => {
        if (get().ready) {
          updateLines([])
        }
      },
      submitDemoOrder: (note): boolean => {
        const { ready, lines, count, totalMinor, pendingOrders } = get()
        const parsedNote = orderNoteSchema.safeParse(note)
        if (!ready || count === 0 || !parsedNote.success) {
          return false
        }
        const orderId = Math.max(0, ...pendingOrders.map((order) => order.id)) + 1

        // submitted demo orders stay in session memory and never contain checkout contact fields.
        set({
          pendingOrders: [
            ...pendingOrders,
            {
              id: orderId,
              status: "pending",
              lines: structuredClone(lines),
              count,
              totalMinor,
              deliveryFeeMinor: null,
              estimatedMinutes: null,
              estimatedArrivalAt: null,
              declineReason: null,
              createdAt: new Date().toISOString(),
              note: parsedNote.data ?? "",
            },
          ],
          selectedOrderId: orderId,
          cartTab: "pending",
        })
        updateLines([])

        return true
      },
      setCartOpen: (cartOpen): void => {
        const cartTab = get().count === 0 && get().pendingOrders.length > 0 ? "pending" : "order"
        set({ cartOpen, ...(cartOpen ? { cartTab } : {}) })
      },
      openProduct: (line): void => {
        productDetailsCache.set(line.product.id, line.product)
        updateProductDialogURL(line.product.id, line.serving)
      },
    }
  })
}
