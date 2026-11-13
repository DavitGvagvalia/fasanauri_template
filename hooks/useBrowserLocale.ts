"use client"

import { useSyncExternalStore } from "react"
import { DEFAULT_LOCALE, LOCALES } from "@/constants"
import type { TLocale } from "@/types/locale"

const subscribe = (): (() => void) => {
  return () => {}
}

const getLocale = (): TLocale => {
  const segment = window.location.pathname.split("/")[1]

  return LOCALES.find((locale) => locale === segment) ?? DEFAULT_LOCALE
}

export const useBrowserLocale = (): TLocale => {
  const locale = useSyncExternalStore<TLocale>(subscribe, getLocale, () => DEFAULT_LOCALE)

  return locale
}
