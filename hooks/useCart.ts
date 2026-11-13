"use client"

import { useState } from "react"
import { useStore } from "zustand"

import { getCartStore } from "@/lib/cart/getCartStore"
import type { ICartStore } from "@/types/cart"

export const useCart = <TSelection>(selector: (state: ICartStore) => TSelection): TSelection => {
  const [store] = useState(getCartStore)
  const selection = useStore(store, selector)

  return selection
}
