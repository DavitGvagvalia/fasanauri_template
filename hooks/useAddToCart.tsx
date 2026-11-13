"use client"

import { toast } from "sonner"
import CartAddedToast from "@/components/features/cart/CartAddedToast"
import { useCart } from "@/hooks/useCart"
import type { IProduct, TServing } from "@/types/menu"

interface IUseAddToCartReturn {
  add: (product: IProduct, quantity: number, serving: TServing | null) => void
  ready: boolean
}

export const useAddToCart = (): IUseAddToCartReturn => {
  const addItem = useCart((state) => state.addItem)
  const ready = useCart((state) => state.ready)

  const add = (product: IProduct, quantity: number, serving: TServing | null): void => {
    addItem({ product, quantity, serving })
    toast.custom(
      (id) => (
        <CartAddedToast
          product={product}
          onClose={() => toast.dismiss(id)}
        />
      ),
      { duration: 3500 }
    )
  }

  return { add, ready }
}
