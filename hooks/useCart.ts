"use client"

import { useStore } from "zustand"

import { getCartStore } from "@/lib/cart/getCartStore"
import type { ICartStore } from "@/types/cart"

export const useCart = <TSelection>(selector: (state: ICartStore) => TSelection): TSelection => {
  const selection = useStore(getCartStore(), selector)

  return selection
}
