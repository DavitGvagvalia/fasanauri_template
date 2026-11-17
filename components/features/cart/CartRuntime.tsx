"use client"

import { Suspense, useEffect } from "react"
import type { ReactElement } from "react"

import ProductModal from "@/components/features/menu/ProductModal"
import placeholderFood from "@/assets/images/placeholder_food.webp"
import OrderNotifications from "@/components/features/cart/OrderNotifications"
import { useCart } from "@/hooks/useCart"
import { useDemoOrderConfirmation } from "@/hooks/useDemoOrderConfirmation"

const CartRuntime = (): ReactElement => {
  const hydrate = useCart((state) => state.hydrate)
  useDemoOrderConfirmation()
  useEffect(() => {
    hydrate(placeholderFood.src)
  }, [hydrate])

  return (
    <>
      <Suspense fallback={null}>
        <ProductModal />
      </Suspense>
      <OrderNotifications />
    </>
  )
}

export default CartRuntime
