"use client"

import { toast } from "sonner"
import CartAddedToast from "@/components/features/cart/CartAddedToast"
import { saveProductOrder } from "@/lib/cart/saveProductOrder"
import { useCart } from "@/hooks/useCart"
import type { IProduct, TServing } from "@/types/menu"
import { getCartStore } from "@/lib/cart/getCartStore"
import { getProductOrderAction } from "@/lib/cart/getProductOrderAction"

interface IUseAddToCartReturn {
  add: (product: IProduct, quantity: number, serving: TServing | null) => void
  ready: boolean
}

export const useAddToCart = (): IUseAddToCartReturn => {
  const ready = useCart((state) => state.ready)

  const add = (product: IProduct, quantity: number, serving: TServing | null): void => {
    const store = getCartStore().getState()
    if (!store.ready) {
      return
    }
    const existing = store.lines.find(
      (line) => line.product.id === product.id && line.serving === serving
    )
    const action = getProductOrderAction(quantity, existing?.quantity)
    saveProductOrder(store, { product, quantity, serving })
    toast.custom(
      (id) => (
        <CartAddedToast
          product={product}
          removed={quantity === 0}
          updated={action === "updateOrder"}
          onClose={() => toast.dismiss(id)}
        />
      ),
      { duration: 3500 }
    )
  }

  return { add, ready }
}
