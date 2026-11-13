"use client"

import ProductCard from "@/components/features/menu/ProductCard"
import { useId } from "react"
import { useTranslations } from "next-intl"
import { Separator } from "@/components/ui/separator"
import { PRODUCT_GRID_CLASS_NAME } from "@/constants"
import type { ECategory } from "@/constants"
import type { IProduct } from "@/types/menu"
import type { ReactElement } from "react"

interface IProps {
  id: ECategory
  title: string
  products: IProduct[]
  count: number
  first: boolean
}

const ProductCategorySection = ({ id, title, products, count, first }: IProps): ReactElement => {
  const headingId = useId()
  const t = useTranslations("Menu")

  return (
    <section
      className="w-full min-w-0"
      aria-labelledby={headingId}
      data-category={id}
    >
      {!first && <Separator className="my-8" />}
      <h2
        id={headingId}
        className="mb-4 flex items-baseline gap-2 text-xl font-semibold"
      >
        {title}
        <span
          className="relative -top-0.5 font-normal text-muted-foreground tabular-nums"
          aria-label={t("results", { count })}
        >
          ({count})
        </span>
      </h2>
      <div className={PRODUCT_GRID_CLASS_NAME}>
        {products.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            eager={first && index < 4}
          />
        ))}
      </div>
    </section>
  )
}

export default ProductCategorySection
