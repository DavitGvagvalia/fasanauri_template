"use client"

import type { StoreApi } from "zustand/vanilla"

import { createCartStore } from "@/lib/cart/createCartStore"
import type { ICartStore } from "@/types/cart"

let browserCartStore: StoreApi<ICartStore> | undefined

export const getCartStore = (): StoreApi<ICartStore> => {
  if (typeof window === "undefined") {
    // server renders receive isolated empty stores, browser state never crosses requests.

    return createCartStore()
  }
  browserCartStore ??= createCartStore()

  return browserCartStore
}
