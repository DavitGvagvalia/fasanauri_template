import type { ReactElement } from "react"
import type { Metadata } from "next"
import { hasLocale } from "next-intl"
import { getTranslations } from "next-intl/server"
import { notFound } from "next/navigation"
import { locale as getLocale } from "next/root-params"

import "@/app/globals.css"
import SiteHeader from "@/components/shared/SiteHeader"
import SiteFooter from "@/components/shared/SiteFooter"
import AppIntlProvider from "@/components/shared/AppIntlProvider"
import ThemeProvider from "@/components/shared/ThemeProvider"
import CartRuntime from "@/components/features/cart/CartRuntime"
import { Toaster } from "@/components/ui/sonner"
import { routing } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { inter, notoSansGeorgian } from "@/lib/fonts"
import type { TLocale } from "@/types/locale"

export function generateStaticParams(): { locale: TLocale }[] {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  const t = await getTranslations({ locale, namespace: "Metadata" })

  return { title: t("title"), description: t("description") }
}

const LocaleLayout = async ({ children }: LayoutProps<"/[locale]">): Promise<ReactElement> => {
  const locale = await getLocale()

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  const t = await getTranslations({ locale, namespace: "Common" })

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={cn(inter.variable, notoSansGeorgian.variable)}
    >
      {/* tolerates attributes added by browser extensions before hydration. */}
      <body
        suppressHydrationWarning
        className="flex min-h-screen flex-col font-sans antialiased"
      >
        <AppIntlProvider locale={locale}>
          <ThemeProvider>
            <CartRuntime />
            <div className="flex min-h-svh flex-col">
              <SiteHeader />
              {children}
            </div>
            <SiteFooter />
            <Toaster
              position="bottom-right"
              containerAriaLabel={t("notifications")}
            />
          </ThemeProvider>
        </AppIntlProvider>
      </body>
    </html>
  )
}

export default LocaleLayout
