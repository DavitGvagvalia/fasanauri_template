"use client"

import { NextIntlClientProvider } from "next-intl"
import type { ReactElement, ReactNode } from "react"

import { getLocaleMessages } from "@/lib/i18n/getLocaleMessages"
import type { TLocale } from "@/types/locale"

interface IProps {
  locale: TLocale
  children: ReactNode
}

const AppIntlProvider = ({ locale, children }: IProps): ReactElement => {
  return (
    // keeps client messages in the module graph instead of retaining serialized layout messages during hot reload.
    <NextIntlClientProvider
      locale={locale}
      messages={getLocaleMessages(locale)}
      timeZone="Asia/Tbilisi"
    >
      {children}
    </NextIntlClientProvider>
  )
}

export default AppIntlProvider
