"use client"

import type { ReactElement } from "react"

import { useLocale, useTranslations } from "next-intl"
import CardImage from "@/components/shared/CardImage"
import { useCart } from "@/hooks/useCart"
import { PRODUCT_CARD_BODY_CLASS_NAME, PRODUCT_IMAGE_CLASS_NAME } from "@/constants"
import { formatPrice } from "@/lib/formatPrice"
import type { IProduct } from "@/types/menu"

interface IProps {
  product: IProduct
  eager?: boolean
}

const ProductCard = ({ product, eager = false }: IProps): ReactElement => {
  const locale = useLocale()
  const t = useTranslations("Menu")
  const openProduct = useCart((state) => state.openProduct)

  const showProduct = (): void => {
    openProduct({ product, quantity: 1, serving: null })
  }

  return (
    <button
      type="button"
      onClick={showProduct}
      aria-haspopup="dialog"
      className="group/card flex w-full min-w-0 flex-col overflow-hidden rounded-xl border bg-card text-left outline-none transition-colors hover:border-foreground/30 focus-visible:ring-3 focus-visible:ring-ring"
    >
      <div className={PRODUCT_IMAGE_CLASS_NAME}>
        <CardImage
          imageURL={product.imageURL}
          alt={t("placeholderImage", { title: product.title[locale] })}
          eager={eager}
          sizes="(max-width: 639px) calc(115vw - 37px), (max-width: 1023px) calc(57.5vw - 49px), (max-width: 1279px) calc(38.34vw - 40px), (max-width: 1839px) calc(28.75vw - 45px), 485px"
        />
        <span className="absolute top-3 left-3 rounded-full bg-background/95 px-2.5 py-1 text-xs text-muted-foreground">
          {t("placeholder")}
        </span>
      </div>
      <div className={PRODUCT_CARD_BODY_CLASS_NAME}>
        <h3 className="line-clamp-2 text-base leading-6 font-medium">{product.title[locale]}</h3>
        <div className="mt-auto flex items-center justify-between gap-3">
          <span className="text-base font-semibold tabular-nums">
            {formatPrice(product.priceMinor, locale)}
          </span>
        </div>
      </div>
    </button>
  )
}

export default ProductCard
