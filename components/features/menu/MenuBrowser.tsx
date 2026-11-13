"use client"

import type { ReactElement } from "react"

import { useSearchParams } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"
import MenuFilters from "@/components/features/menu/MenuFilters"
import MenuResults from "@/components/features/menu/MenuResults"
import { useMenuCategories } from "@/hooks/useMenuCategories"
import { getMenuFilters } from "@/lib/menu/getMenuFilters"
import type { IInitialMenuData } from "@/types/menu"

interface IProps {
  initialData: IInitialMenuData
}

const MenuBrowser = ({ initialData }: IProps): ReactElement => {
  const params = useSearchParams()
  const locale = useLocale()
  const t = useTranslations("Menu")
  const { categories, loading, error, retry } = useMenuCategories(initialData.categories)

  const { place, category, search } = getMenuFilters(params)
  const active = categories.find((item) => item.id === category)

  return (
    <>
      <MenuFilters
        categories={categories}
        loading={loading}
        error={error}
        retry={retry}
      />
      <main
        id="main-content"
        className="site-container flex min-h-0 flex-1 scroll-mt-80 flex-col pt-6 pb-12 sm:pt-8 sm:pb-16"
      >
        <MenuResults
          key={`${place}:${category}:${search}`}
          title={active?.title[locale] ?? t("all")}
          category={category}
          search={search}
          categories={categories}
          place={place}
          products={initialData.products}
        />
      </main>
    </>
  )
}

export default MenuBrowser
