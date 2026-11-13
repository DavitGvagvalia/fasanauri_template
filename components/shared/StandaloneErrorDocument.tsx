"use client"

import type { ReactElement } from "react"

import { NextIntlClientProvider } from "next-intl"
import "@/app/globals.css"
import ErrorState from "@/components/shared/ErrorState"
import { useBrowserLocale } from "@/hooks/useBrowserLocale"
import { inter, notoSansGeorgian } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import en from "@/messages/en.json"
import ka from "@/messages/ka.json"
import ru from "@/messages/ru.json"

interface IProps {
  kind: "notFound" | "unexpected"
  onRetry?: () => void
}

const StandaloneErrorDocument = ({ kind, onRetry }: IProps): ReactElement => {
  const locale = useBrowserLocale()
  const messages = { ka, en, ru }[locale]

  return (
    <html
      lang={locale}
      className={cn(inter.variable, notoSansGeorgian.variable)}
    >
      <body className="min-h-screen font-sans antialiased">
        <title>{`${messages.Errors.brand} | ${kind === "notFound" ? messages.Errors.notFoundTitle : messages.Errors.unexpectedTitle}`}</title>
        <meta
          name="robots"
          content="noindex"
        />
        <NextIntlClientProvider
          locale={locale}
          messages={{ Errors: messages.Errors }}
          timeZone="Asia/Tbilisi"
        >
          <ErrorState
            kind={kind}
            onRetry={onRetry}
          />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

export default StandaloneErrorDocument
