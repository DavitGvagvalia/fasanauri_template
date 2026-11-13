import type { CountryCode } from "libphonenumber-js"

import { formatPhoneDigits } from "@/lib/checkout/formatPhoneDigits"
import { getPhoneTemplate } from "@/lib/checkout/getPhoneTemplate"

// reserves untyped national number positions using the selected country numbering plan.
export const getPhoneMask = (country: CountryCode, typedLength: number): string => {
  const length = formatPhoneDigits(country, "0".repeat(Math.max(0, typedLength))).length

  return getPhoneTemplate(country).slice(length)
}
