import type { CountryCode } from "libphonenumber-js"

import { getPhoneTemplate } from "@/lib/checkout/getPhoneTemplate"
import { getPhoneDigits } from "@/lib/checkout/getPhoneDigits"

export const formatPhoneDigits = (country: CountryCode, digits: string): string => {
  const template = getPhoneTemplate(country)
  const characters: string[] = []

  for (const digit of getPhoneDigits(country, digits)) {
    if (template[characters.length] === " ") {
      characters.push(" ")
    }
    characters.push(digit)
  }

  return characters.join("")
}
