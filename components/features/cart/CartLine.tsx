"use client"

import type { ReactElement } from "react"
import { useState } from "react"
import { toast } from "sonner"
import CartAddedToast from "@/components/features/cart/CartAddedToast"

import { Trash2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import QuantityControl from "@/components/shared/QuantityControl"
import ImageViewer from "@/components/shared/ImageViewer"
import CardImage from "@/components/shared/CardImage"
import CartProductTitle from "@/components/features/cart/CartProductTitle"
import CartRemoveDialog from "@/components/features/cart/CartRemoveDialog"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/useCart"
import QuantityPrice from "@/components/shared/QuantityPrice"
import type { ICartLine } from "@/types/cart"

interface IProps {
  line: ICartLine
  showDescription?: boolean
}

const CartLine = ({ line, showDescription = false }: IProps): ReactElement => {
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
  const remove = (): void => {
    setRemovalOpen(true)
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
    <li className="grid grid-cols-[6rem_minmax(0,1fr)] gap-3 border-b py-5 last:border-0 sm:grid-cols-[7rem_minmax(0,1fr)]">
      <ImageViewer
        imageURL={line.product.imageURL}
        alt={menu("placeholderImage", { title })}
        title={title}
        className="relative size-24 overflow-hidden rounded-lg sm:size-28"
      >
        <CardImage
          imageURL={line.product.imageURL}
          alt={menu("placeholderImage", { title })}
          sizes="(max-width: 639px) 111px, 129px"
        />
      </ImageViewer>
      <div className="flex min-h-24 min-w-0 flex-col justify-between gap-2 sm:min-h-28">
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
      <div className="col-span-2 flex items-center justify-between gap-2">
        <QuantityControl
          quantity={line.quantity}
          minimum={0}
          onChange={changeQuantity}
          label={t("quantityFor", { title })}
        />
        <Button
          onClick={remove}
          variant="ghost"
          size="icon"
          aria-label={t("remove", { title })}
        >
          <Trash2 aria-hidden />
        </Button>
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
