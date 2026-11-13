import { createStore } from "zustand/vanilla"
import type { StoreApi } from "zustand/vanilla"

import { CART_STORAGE_KEY } from "@/constants"
import { addCartLine } from "@/lib/cart/addCartLine"
import { getCartTotal } from "@/lib/cart/getCartTotal"
import { setCartLineQuantity } from "@/lib/cart/setCartLineQuantity"
import { productDetailsCache } from "@/lib/menu/productDetailsCache"
import { updateProductDialogURL } from "@/lib/menu/updateProductDialogURL"
import { cartStorageSchema } from "@/schemas/cartStorageSchema"
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
      lines: [],
      count: 0,
      totalMinor: 0,
      ready: false,
      cartOpen: false,
      hydrate: (): void => {
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
      setCartOpen: (cartOpen): void => {
        set({ cartOpen })
      },
      openProduct: (line): void => {
        productDetailsCache.set(line.product.id, line.product)
        updateProductDialogURL(line.product.id, line.serving)
      },
    }
  })
}
