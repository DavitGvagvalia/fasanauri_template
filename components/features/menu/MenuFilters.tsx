"use client"

import { useTranslations } from "next-intl"
import { useSearchParams } from "next/navigation"
import CategoryCarousel from "@/components/features/menu/CategoryCarousel"
import MenuSearch from "@/components/features/menu/MenuSearch"
import { Button } from "@/components/ui/button"
import { getMenuCategory } from "@/lib/menu/getMenuCategory"
import { updateMenuFilters } from "@/lib/menu/updateMenuFilters"
import type { ECategory } from "@/constants"
import type { ICategory } from "@/types/menu"
import type { ReactElement } from "react"

interface IProps {
  categories: ICategory[]
  loading: boolean
  error: boolean
  retry: () => void
}

const MenuFilters = ({ categories, loading, error, retry }: IProps): ReactElement => {
  const t = useTranslations("Menu")
  const params = useSearchParams()
  const category = getMenuCategory(params.get("category"))
  const selectCategory = (id: ECategory): void => {
    updateMenuFilters({ category: id }, "push")
  }

  return (
    <div className="sticky top-18 z-30 w-full shrink-0 border-b bg-menu-panel/97 backdrop-blur-md dark:bg-menu-panel">
      <div className="site-container py-2">
        <div className="-mx-4 flow-root px-4 sm:-mx-8 sm:px-8 xl:-mx-12 xl:px-12">
          <CategoryCarousel
            categories={categories}
            selected={category}
            loading={loading}
            onSelect={selectCategory}
          />
          {error && (
            <Button
              onClick={retry}
              variant="outline"
              className="mt-2"
            >
              {t("retryCategories")}
            </Button>
          )}
          <MenuSearch />
        </div>
      </div>
    </div>
  )
}

export default MenuFilters
