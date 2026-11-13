"use client"

import { SearchX } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import MenuHeading from "@/components/features/menu/MenuHeading"
import ProductCard from "@/components/features/menu/ProductCard"
import ProductCategorySection from "@/components/features/menu/ProductCategorySection"
import { ECategory, PRODUCT_GRID_CLASS_NAME } from "@/constants"
import { queryPlaceholderProducts } from "@/lib/menu/queryPlaceholderProducts"
import { groupMenuProducts } from "@/lib/menu/groupMenuProducts"
import { cn } from "@/lib/utils"
import type { EPlace } from "@/constants"
import type { ICategory, IProduct } from "@/types/menu"
import type { ReactElement } from "react"

interface IProps {
  title: string
  category: ECategory
  search: string
  place: EPlace
  categories: ICategory[]
  products: IProduct[]
}

const MenuResults = ({
  title,
  category,
  search,
  place,
  categories,
  products: catalog,
}: IProps): ReactElement => {
  const t = useTranslations("Menu")
  const locale = useLocale()
  const { products, popularProducts, categoryCounts, total } = queryPlaceholderProducts(catalog, {
    category,
    search,
    place,
    cursor: 0,
  })
  const empty = products.length === 0

  const groups = groupMenuProducts(products, categories)
  const grouped = category === ECategory.All && categories.length > 0

  return (
    <section
      aria-label={t("products")}
      aria-busy={false}
      className={cn("w-full min-w-0", empty && "flex min-h-0 flex-1 flex-col")}
    >
      <MenuHeading
        title={title}
        count={total}
        loading={false}
        error={false}
      />
      {grouped ? (
        <>
          {popularProducts.length > 0 && (
            <ProductCategorySection
              id={ECategory.Popular}
              title={t("popular")}
              products={popularProducts}
              count={popularProducts.length}
              first
            />
          )}
          {groups.map((group, index) => (
            <ProductCategorySection
              key={group.category.id}
              id={group.category.id}
              title={group.category.title[locale]}
              products={group.products}
              count={categoryCounts[group.category.id] ?? group.products.length}
              first={index === 0 && popularProducts.length === 0}
            />
          ))}
        </>
      ) : (
        <div className={PRODUCT_GRID_CLASS_NAME}>
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              eager={index < 4}
            />
          ))}
        </div>
      )}
      {empty && (
        <div className="flex min-h-48 w-full flex-1 flex-col items-center justify-center gap-2 rounded-xl border border-dashed p-6 text-center">
          <SearchX
            className="size-7 shrink-0 text-muted-foreground"
            aria-hidden
          />
          <h2 className="font-medium">{t("emptyTitle")}</h2>
          <p className="max-w-md text-sm text-muted-foreground">{t("emptyDescription")}</p>
        </div>
      )}
    </section>
  )
}

export default MenuResults
