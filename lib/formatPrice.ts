import { formatAmount } from "@/lib/formatAmount"
import { CURRENCY_SYMBOL } from "@/constants"
import type { TLocale } from "@/types/locale"

export const formatPrice = (priceMinor: number, locale: TLocale): string => {
  const amount = formatAmount(priceMinor, locale)

  return `${amount} ${CURRENCY_SYMBOL}`
}
