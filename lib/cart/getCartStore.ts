"use client"

import type { StoreApi } from "zustand/vanilla"

import { createCartStore } from "@/lib/cart/createCartStore"
import type { ICartStore } from "@/types/cart"

const CART_STORE_KEY = Symbol.for("fasanauri.cart.store")

export const getCartStore = (): StoreApi<ICartStore> => {
  if (typeof window === "undefined") {
    // server renders receive isolated empty stores, browser state never crosses requests.

    return createCartStore()
  }
  // preserves one browser store when development refresh reloads this module.
  const browser = window as Window & { [CART_STORE_KEY]?: StoreApi<ICartStore> }
  browser[CART_STORE_KEY] ??= createCartStore()

  return browser[CART_STORE_KEY]
}
