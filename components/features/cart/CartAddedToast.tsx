"use client"

import Image from "next/image"
import { X } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/useCart"
import type { IProduct } from "@/types/menu"
import type { ReactElement } from "react"

interface IProps {
  product: IProduct
  onClose: () => void
  onOpen?: () => void
  removed?: boolean
}

const CartAddedToast = ({ product, onClose, onOpen, removed = false }: IProps): ReactElement => {
  const locale = useLocale()
  const t = useTranslations("Cart")
  const common = useTranslations("Common")
  const setCartOpen = useCart((state) => state.setCartOpen)

  const openCart = (): void => {
    onClose()
    if (onOpen) {
      onOpen()

      return
    }
    setCartOpen(true)
  }

  return (
    <div className="relative w-[min(356px,calc(100vw-2rem))] max-w-full rounded-xl border bg-popover text-popover-foreground shadow-lg">
      <button
        type="button"
        onClick={openCart}
        aria-label={removed ? t("viewProduct", { title: product.title[locale] }) : t("viewCart")}
        aria-haspopup="dialog"
        className="flex w-full min-w-0 cursor-pointer items-center gap-3 rounded-xl p-3 pr-14 text-left outline-none focus-visible:ring-3 focus-visible:ring-ring"
      >
        <Image
          src={product.imageURL}
          alt=""
          width={56}
          height={56}
          className="size-14 shrink-0 rounded-lg object-cover"
        />
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold">{t(removed ? "removed" : "added")}</span>
          <span className="mt-1 line-clamp-2 text-xs text-muted-foreground">
            {product.title[locale]}
          </span>
        </span>
      </button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        aria-label={common("close")}
        className="absolute top-1/2 right-3 -translate-y-1/2"
      >
        <X aria-hidden />
      </Button>
    </div>
  )
}

export default CartAddedToast
