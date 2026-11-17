import type { ReactElement } from "react"
import { Suspense } from "react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { SITE_LINKS } from "@/constants"
import BrandLogo from "@/components/shared/BrandLogo"
import FooterFacebookLink from "@/components/shared/FooterFacebookLink"
import PlaceLink from "@/components/shared/PlaceLink"

const SiteFooter = (): ReactElement => {
  const t = useTranslations("Footer")

  return (
    <footer className="shrink-0 border-t bg-menu-panel/97 dark:bg-menu-panel">
      <div className="site-container flex min-h-40 flex-col justify-between gap-8 py-10 text-sm leading-7 text-muted-foreground sm:min-h-48 sm:py-12">
        <Link
          href="/"
          className="flex w-fit items-center gap-2 rounded-sm text-foreground focus-visible:outline-2"
        >
          <BrandLogo className="size-8 shrink-0" />
          {t("brand")}
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-6">
          <nav
            aria-label={t("navigation")}
            className="flex flex-wrap items-center gap-x-6 gap-y-3"
          >
            {SITE_LINKS.map(({ href, key }) => (
              <Suspense
                key={key}
                fallback={
                  <Link
                    href={href}
                    className="link-underline"
                  >
                    {t(key)}
                  </Link>
                }
              >
                <PlaceLink
                  key={key}
                  href={href}
                  className="link-underline rounded-sm transition-colors duration-200 hover:text-foreground focus-visible:outline-2 motion-reduce:transition-none"
                >
                  {t(key)}
                </PlaceLink>
              </Suspense>
            ))}
          </nav>
          <FooterFacebookLink />
        </div>
      </div>
    </footer>
  )
}

export default SiteFooter
