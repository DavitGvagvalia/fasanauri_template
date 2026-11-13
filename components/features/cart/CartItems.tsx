"use client"

import type { ReactElement } from "react"

import { ShoppingBag } from "lucide-react"
import { useTranslations } from "next-intl"
import CartLine from "@/components/features/cart/CartLine"
import CartItemsSkeleton from "@/components/features/cart/CartItemsSkeleton"
import { useCart } from "@/hooks/useCart"

interface IProps {
  showDescription?: boolean
}

const CartItems = ({ showDescription = false }: IProps): ReactElement => {
  const t = useTranslations("Cart")
  const lines = useCart((state) => state.lines)
  const ready = useCart((state) => state.ready)

  if (!ready) {
    return <CartItemsSkeleton showDescription={showDescription} />
  }
  if (!lines.length) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <ShoppingBag
          className="size-10 text-muted-foreground"
          aria-hidden
        />
        <h2 className="text-lg font-medium">{t("emptyTitle")}</h2>
        <p className="max-w-xs text-sm leading-6 text-muted-foreground">{t("emptyDescription")}</p>
      </div>
    )
  }

  return (
    <ul>
      {lines.map((line) => (
        <CartLine
          key={`${line.product.id}:${line.serving}`}
          line={line}
          showDescription={showDescription}
        />
      ))}
    </ul>
  )
}

export default CartItems
