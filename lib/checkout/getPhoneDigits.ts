import type { CountryCode } from "libphonenumber-js"

import { getPhoneTemplate } from "@/lib/checkout/getPhoneTemplate"

export const getPhoneDigits = (country: CountryCode, value: string): string => {
  const limit = getPhoneTemplate(country).replaceAll(" ", "").length

  return value.replace(/\D/g, "").slice(0, limit)
}
