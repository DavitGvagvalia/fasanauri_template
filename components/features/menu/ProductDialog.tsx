"use client"

import type { ReactElement } from "react"

import { useState } from "react"
import { useLocale, useTranslations } from "next-intl"

import BeverageServing from "@/components/features/menu/BeverageServing"
import QuantityControl from "@/components/shared/QuantityControl"
import ImageViewer from "@/components/shared/ImageViewer"
import CardImage from "@/components/shared/CardImage"
import ProductShare from "@/components/features/menu/ProductShare"
import ProductDialogClose from "@/components/features/menu/ProductDialogClose"
import { Button } from "@/components/ui/button"
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAddToCart } from "@/hooks/useAddToCart"
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
  const [quantity, setQuantity] = useState(1)
  const [serving, setServing] = useState<TServing>(initialServing)

  const addToCart = (): void => {
    add(product, quantity, product.kind === "beverage" ? serving : null)
    onAdded()
    setQuantity(1)
    setServing(initialServing)
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
        <div className="min-h-0 space-y-4 overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="pr-2 text-xl leading-7">{product.title[locale]}</DialogTitle>
            <DialogDescription className="text-sm leading-6 text-muted-foreground">
              {product.description?.[locale] || t("descriptionFallback")}
            </DialogDescription>
          </DialogHeader>
          <p className="text-lg font-semibold tabular-nums">
            <QuantityPrice
              priceMinor={product.priceMinor}
              quantity={quantity}
            />
          </p>
          {product.kind === "beverage" && (
            <BeverageServing
              serving={serving}
              onChange={setServing}
            />
          )}
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-3 border-t bg-popover p-4 sm:p-6">
          <QuantityControl
            quantity={quantity}
            onChange={setQuantity}
            label={common("quantity")}
          />
          <Button
            onClick={addToCart}
            disabled={!ready}
            className="h-11 flex-1"
          >
            {t("addToCart")}
          </Button>
        </div>
      </div>
      <ProductShare product={product} />
    </DialogContent>
  )
}

export default ProductDialog
