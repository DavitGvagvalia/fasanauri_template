import type { ReactElement } from "react"
import { useTranslations } from "next-intl"
import ProductGridSkeleton from "@/components/features/menu/ProductGridSkeleton"
import { Skeleton } from "@/components/ui/skeleton"

const MenuLoading = (): ReactElement => {
  const t = useTranslations("Menu")

  return (
    <>
      <div
        aria-hidden
        className="sticky top-18 z-30 w-full shrink-0 border-b bg-menu-panel/97 backdrop-blur-md"
      >
        <div className="site-container py-2">
          <div className="pb-14 xl:pb-0">
            <div className="flex gap-1 overflow-hidden py-1">
              {Array.from({ length: 12 }, (_, index) => (
                <div
                  key={`category-loading-${index}`}
                  className="flex h-32 w-23 shrink-0 flex-col items-center gap-3 p-3 sm:h-40 sm:w-31"
                >
                  <Skeleton className="aspect-square w-full rounded-lg" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              ))}
            </div>
          </div>
          <Skeleton className="mt-5 mb-2 h-10 w-[calc(100%-3rem)] max-w-md bg-background/80" />
        </div>
      </div>
      <main
        id="main-content"
        aria-label={t("loading")}
        className="site-container min-h-0 flex-1 pt-6 pb-12 sm:pt-8 sm:pb-16"
      >
        <div className="mb-5 flex min-h-9 items-center gap-2 sm:mb-6 sm:min-h-10">
          <Skeleton className="h-9 w-48 sm:h-10" />
          <Skeleton className="h-5 w-8 sm:h-6" />
        </div>
        <Skeleton className="mb-4 h-7 w-36" />
        <ProductGridSkeleton />
      </main>
    </>
  )
}

export default MenuLoading
