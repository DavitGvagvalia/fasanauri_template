"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { useSearchParams } from "next/navigation"
import CategoryCarousel from "@/components/features/menu/CategoryCarousel"
import MenuFiltersToggle from "@/components/features/menu/MenuFiltersToggle"
import MenuSearch from "@/components/features/menu/MenuSearch"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"
import { getMenuCategory } from "@/lib/menu/getMenuCategory"
import { updateMenuFilters } from "@/lib/menu/updateMenuFilters"
import { menuCache } from "@/lib/menu/menuCache"
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
  const [open, setOpen] = useState(menuCache.filtersOpen)
  const handleOpenChange = (value: boolean): void => {
    setOpen(value)
    menuCache.filtersOpen = value
  }
  const category = getMenuCategory(params.get("category"))
  const selectCategory = (id: ECategory): void => {
    updateMenuFilters({ category: id }, "push")
  }

  return (
    <div className="sticky top-18 z-30 w-full shrink-0 border-b bg-menu-panel/97 backdrop-blur-md dark:bg-menu-panel">
      <Collapsible
        open={open}
        onOpenChange={handleOpenChange}
        className="site-container relative min-h-12 py-2"
      >
        <MenuFiltersToggle open={open} />
        {/* includes the gutters in the clipping box so animated content keeps its outer arrows. */}
        <CollapsibleContent className="-mx-4 flow-root h-(--collapsible-panel-height) overflow-hidden px-4 opacity-100 transition-[height,opacity] duration-300 ease-out data-ending-style:h-0 data-ending-style:opacity-0 data-starting-style:h-0 data-starting-style:opacity-0 motion-reduce:transition-none sm:-mx-8 sm:px-8 xl:-mx-12 xl:px-12">
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
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

export default MenuFilters
