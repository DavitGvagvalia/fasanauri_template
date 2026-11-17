import type { ReactElement } from "react"
import { getTranslations } from "next-intl/server"
import BrandLogo from "@/components/shared/BrandLogo"
import { Suspense } from "react"

import CartButton from "@/components/features/cart/CartButton"
import PlaceSwitcher from "@/components/features/places/PlaceSwitcher"
import LanguageSwitcher from "@/components/shared/LanguageSwitcher"
import MenuLink from "@/components/shared/MenuLink"
import ThemeSwitcher from "@/components/shared/ThemeSwitcher"
import { Skeleton } from "@/components/ui/skeleton"

const BRAND_CLASS_NAME =
  "flex min-w-0 items-center gap-2 text-base font-semibold tracking-tight sm:text-xl"

const SiteHeader = async (): Promise<ReactElement> => {
  const t = await getTranslations("Common")
  const brand = (
    <>
      <BrandLogo className="size-8 shrink-0 text-foreground sm:size-10" />
      <span className="truncate">{t("brand")}</span>
    </>
  )

  return (
    <header className="sticky top-0 z-40 h-18 shrink-0 border-b bg-background">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-background focus:p-4"
      >
        {t("skipToContent")}
      </a>
      <div className="site-container flex h-full px-3 sm:px-8 xl:px-12 items-center justify-between gap-2 sm:gap-4">
        <div className="flex min-w-0 items-center gap-3 sm:gap-5">
          <Suspense fallback={<span className={BRAND_CLASS_NAME}>{brand}</span>}>
            <MenuLink className={BRAND_CLASS_NAME}>
              <span className="truncate">{t("brand")}</span>
            </MenuLink>
          </Suspense>
          <Suspense fallback={<Skeleton className="h-10 w-10 sm:w-44" />}>
            <PlaceSwitcher />
          </Suspense>
        </div>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <ThemeSwitcher />
          <Suspense fallback={<Skeleton className="h-5 w-7.5 sm:h-7 sm:w-10.5" />}>
            <LanguageSwitcher />
          </Suspense>
          <CartButton />
        </div>
      </div>
    </header>
  )
}

export default SiteHeader
