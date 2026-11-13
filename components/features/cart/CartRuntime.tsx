"use client"

import { Suspense, useEffect } from "react"
import type { ReactElement } from "react"

import ProductModal from "@/components/features/menu/ProductModal"
import { useCart } from "@/hooks/useCart"

const CartRuntime = (): ReactElement => {
  const hydrate = useCart((state) => state.hydrate)
  useEffect(() => {
    hydrate()
  }, [hydrate])

  return (
    <Suspense fallback={null}>
      <ProductModal />
    </Suspense>
  )
}

export default CartRuntime
