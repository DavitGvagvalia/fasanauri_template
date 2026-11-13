import { getExampleNumber } from "libphonenumber-js"
import examples from "libphonenumber-js/examples.mobile.json"
import type { CountryCode } from "libphonenumber-js"

export const getPhoneTemplate = (country: CountryCode): string => {
  const example = getExampleNumber(country, examples)

  return example
    ? example
        .formatInternational()
        .slice(example.countryCallingCode.length + 2)
        .replace(/\d/g, "X")
    : "XXXXXXXXXX"
}
