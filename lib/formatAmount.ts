import type { TLocale } from "@/types/locale"

export const formatAmount = (priceMinor: number, locale: TLocale): string => {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(priceMinor / 100)
}
