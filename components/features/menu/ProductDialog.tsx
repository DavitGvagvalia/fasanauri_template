"use client"

import type { ReactElement } from "react"

import { useState } from "react"
import { useLocale, useTranslations } from "next-intl"

import { SHOW_SHARE_BUTTON } from "@/constants"
import CtaPattern from "@/components/shared/CtaPattern"
import BeverageServing from "@/components/features/menu/BeverageServing"
import QuantityControl from "@/components/shared/QuantityControl"
import ImageViewer from "@/components/shared/ImageViewer"
import CardImage from "@/components/shared/CardImage"
import ProductShare from "@/components/features/menu/ProductShare"
import ProductDialogClose from "@/components/features/menu/ProductDialogClose"
import { Button } from "@/components/ui/button"
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useCart } from "@/hooks/useCart"
import { useAddToCart } from "@/hooks/useAddToCart"
import { getProductOrderAction } from "@/lib/cart/getProductOrderAction"
import { formatPrice } from "@/lib/formatPrice"
import QuantityPrice from "@/components/shared/QuantityPrice"
import type { IProduct, TServing } from "@/types/menu"

interface IProps {
  product: IProduct
  onAdded: () => void
  initialServing?: TServing
}

const ProductDialog = ({ product, onAdded, initialServing = "bottle" }: IProps): ReactElement => {
  const locale = useLocale()
  const t = useTranslations("Menu")
  const common = useTranslations("Common")
  const { add, ready } = useAddToCart()
  const lines = useCart((state) => state.lines)
  const [serving, setServing] = useState<TServing>(initialServing)
  const [quantity, setQuantity] = useState(
    lines.find(
      (line) =>
        line.product.id === product.id &&
        line.serving === (product.kind === "beverage" ? initialServing : null)
    )?.quantity ?? 1
  )

  const selectedServing = product.kind === "beverage" ? serving : null
  const existing = lines.find(
    (line) => line.product.id === product.id && line.serving === selectedServing
  )
  const action = getProductOrderAction(quantity, existing?.quantity)

  const changeServing = (value: TServing): void => {
    setServing(value)
    setQuantity(
      lines.find((line) => line.product.id === product.id && line.serving === value)?.quantity ?? 1
    )
  }

  const addToCart = (): void => {
    add(product, quantity, selectedServing)
    onAdded()
  }

  return (
    <DialogContent
      showCloseButton={false}
      overlayClassName="product-dialog-backdrop"
      className="product-dialog flex max-h-[calc(100dvh-2rem)] flex-col gap-0 border border-foreground/25 p-0 ring-0 [--product-image-height:min(15rem,28dvh)] sm:max-w-lg lg:max-h-[90dvh] lg:[--product-image-height:min(20rem,40dvh)]"
    >
      <ProductDialogClose />
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[calc(var(--radius-xl)-1px)]">
        <ImageViewer
          imageURL={product.imageURL}
          alt={t("placeholderImage", { title: product.title[locale] })}
          title={product.title[locale]}
          className="relative block h-(--product-image-height) w-full shrink-0 overflow-hidden bg-muted"
        >
          <CardImage
            imageURL={product.imageURL}
            alt={t("placeholderImage", { title: product.title[locale] })}
            eager
            sizes="(max-width: 640px) 104vw, 589px"
          />
          <span className="absolute top-3 left-3 rounded-full bg-background/95 px-2.5 py-1 text-xs text-muted-foreground">
            {t("placeholder")}
          </span>
        </ImageViewer>
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="pr-2 text-xl leading-7 font-bold">
              {product.title[locale]}
            </DialogTitle>
            <p className="text-sm font-medium">
              {t("unitPrice", { price: formatPrice(product.priceMinor, locale) })}
            </p>
            <DialogDescription className="text-sm leading-6 text-muted-foreground">
              {product.description?.[locale] || t("descriptionFallback")}
            </DialogDescription>
          </DialogHeader>
          {product.kind === "beverage" && (
            <BeverageServing
              serving={serving}
              onChange={changeServing}
            />
          )}
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-3 border-t bg-popover p-4 sm:p-6">
          <QuantityControl
            quantity={quantity}
            minimum={0}
            onChange={setQuantity}
            label={common("quantity")}
          />
          <Button
            onClick={addToCart}
            disabled={!ready || (quantity === 0 && !existing)}
            className="relative isolate min-h-11 h-auto flex-1 flex-wrap gap-x-2 gap-y-0 overflow-hidden px-3 py-2 font-semibold whitespace-normal"
          >
            <CtaPattern />
            {t(action)}
            {quantity > 0 && (
              <QuantityPrice
                priceMinor={product.priceMinor}
                quantity={quantity}
              />
            )}
          </Button>
        </div>
      </div>
      {SHOW_SHARE_BUTTON && <ProductShare product={product} />}
    </DialogContent>
  )
}

export default ProductDialog
