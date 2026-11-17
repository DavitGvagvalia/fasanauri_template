"use client"

import type { ReactElement } from "react"
import { useState } from "react"
import { toast } from "sonner"
import CartAddedToast from "@/components/features/cart/CartAddedToast"

import { useLocale, useTranslations } from "next-intl"
import QuantityControl from "@/components/shared/QuantityControl"
import CardImage from "@/components/shared/CardImage"
import CartProductTitle from "@/components/features/cart/CartProductTitle"
import CartRemoveDialog from "@/components/features/cart/CartRemoveDialog"
import { useCart } from "@/hooks/useCart"
import QuantityPrice from "@/components/shared/QuantityPrice"
import type { ICartLine } from "@/types/cart"
import { cn } from "@/lib/utils"

interface IProps {
  line: ICartLine
  showDescription?: boolean
  compact?: boolean
}

const CartLine = ({ line, showDescription = false, compact = false }: IProps): ReactElement => {
  const locale = useLocale()
  const t = useTranslations("Cart")
  const menu = useTranslations("Menu")
  const setQuantity = useCart((state) => state.setQuantity)
  const openProduct = useCart((state) => state.openProduct)
  const [removalOpen, setRemovalOpen] = useState(false)

  const changeQuantity = (quantity: number): void => {
    if (quantity === 0) {
      setRemovalOpen(true)

      return
    }

    setQuantity(line.product.id, line.serving, quantity)
  }
  const showProduct = (): void => {
    openProduct(line)
  }

  const confirmRemove = (): void => {
    setQuantity(line.product.id, line.serving, 0)
    toast.custom(
      (id) => (
        <CartAddedToast
          product={line.product}
          removed
          onClose={() => toast.dismiss(id)}
          onOpen={() => openProduct(line)}
        />
      ),
      { duration: 5000 }
    )
  }

  const title = line.product.title[locale]

  return (
    <li
      className={cn(
        "grid gap-2 border-b py-3 last:border-0",
        compact
          ? "grid-cols-[3.5rem_minmax(0,1fr)_auto]"
          : "grid-cols-[4rem_minmax(0,1fr)_auto] sm:grid-cols-[5rem_minmax(0,1fr)_auto]"
      )}
    >
      <button
        type="button"
        onClick={showProduct}
        aria-label={title}
        aria-haspopup="dialog"
        className={cn(
          "relative overflow-hidden rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring",
          compact ? "size-14" : "size-16 sm:size-20"
        )}
      >
        <CardImage
          imageURL={line.product.imageURL}
          alt={menu("placeholderImage", { title })}
          sizes={compact ? "56px" : "(max-width: 639px) 64px, 80px"}
        />
      </button>
      <div
        className={cn(
          "flex min-w-0 flex-col justify-between gap-1",
          compact ? "min-h-14" : "min-h-16 sm:min-h-20"
        )}
      >
        <div>
          <CartProductTitle line={line} />
          {showDescription && (
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {line.product.description?.[locale] || menu("descriptionFallback")}
            </p>
          )}
          {line.serving && (
            <p className="mt-1 text-xs text-muted-foreground">{menu(line.serving)}</p>
          )}
        </div>
        <p className="text-base font-semibold">
          <QuantityPrice
            priceMinor={line.product.priceMinor}
            quantity={line.quantity}
          />
        </p>
      </div>
      <div className="flex items-center justify-end">
        <QuantityControl
          quantity={line.quantity}
          minimum={0}
          onChange={changeQuantity}
          label={t("quantityFor", { title })}
        />
      </div>
      <CartRemoveDialog
        open={removalOpen}
        onOpenChange={setRemovalOpen}
        onConfirm={confirmRemove}
        title={title}
      />
    </li>
  )
}

export default CartLine
