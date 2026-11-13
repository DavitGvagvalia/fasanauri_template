import type { ReactElement } from "react"
import { getTranslations } from "next-intl/server"
import { LogIn, Utensils } from "lucide-react"
import { Suspense } from "react"

import CartButton from "@/components/features/cart/CartButton"
import PlaceSwitcher from "@/components/features/places/PlaceSwitcher"
import LanguageSwitcher from "@/components/shared/LanguageSwitcher"
import MenuLink from "@/components/shared/MenuLink"
import ThemeSwitcher from "@/components/shared/ThemeSwitcher"
import { buttonVariants } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Link } from "@/i18n/navigation"

const BRAND_CLASS_NAME =
  "flex min-w-0 items-center gap-2 text-base font-semibold tracking-tight sm:text-xl"

const SiteHeader = async (): Promise<ReactElement> => {
  const t = await getTranslations("Common")
  const brand = (
    <>
      <span className="hidden rounded-full bg-primary p-2.5 text-primary-foreground sm:inline-flex">
        <Utensils
          className="size-5"
          aria-hidden
        />
      </span>
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
        <div className="flex min-w-0 items-center gap-2 sm:gap-4">
          <Suspense fallback={<span className={BRAND_CLASS_NAME}>{brand}</span>}>
            <MenuLink className={BRAND_CLASS_NAME}>{brand}</MenuLink>
          </Suspense>
          <Suspense fallback={<Skeleton className="h-10 w-10 sm:w-44" />}>
            <PlaceSwitcher />
          </Suspense>
        </div>
        <div className="flex shrink-0 items-center gap-0.5 sm:gap-3">
          <ThemeSwitcher />
          <Suspense fallback={<Skeleton className="mr-1 h-5 w-7.5 sm:mr-2 sm:h-7 sm:w-10.5" />}>
            <LanguageSwitcher />
          </Suspense>
          <CartButton />
          <Link
            href="/login"
            aria-label={t("login")}
            className={buttonVariants({
              variant: "ghost",
              className: "size-10 p-0 md:w-auto md:px-3 [&_svg]:size-5",
            })}
          >
            <LogIn
              className="size-5"
              aria-hidden
            />
            <span className="hidden md:inline">{t("login")}</span>
          </Link>
        </div>
      </div>
    </header>
  )
}

export default SiteHeader
