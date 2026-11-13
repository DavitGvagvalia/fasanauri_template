"use client"

import { getCountries, getCountryCallingCode } from "libphonenumber-js"
import { useLocale, useTranslations } from "next-intl"
import type { CountryCode } from "libphonenumber-js"
import type { ReactElement } from "react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
} from "@/components/ui/select"

interface IProps {
  country: CountryCode
  onChange: (country: CountryCode) => void
}

const PhoneCountrySelect = ({ country, onChange }: IProps): ReactElement => {
  const locale = useLocale()
  const t = useTranslations("Checkout")
  const names = new Intl.DisplayNames([locale], { type: "region" })
  const preferred: CountryCode[] = ["GE", "RU", "UA"]
  const countries = getCountries()
    .filter((code) => !preferred.includes(code))
    .sort((first, second) =>
      (names.of(first) ?? first).localeCompare(names.of(second) ?? second, locale)
    )

  const changeCountry = (value: CountryCode | null): void => {
    if (value) {
      onChange(value)
    }
  }

  return (
    <Select
      value={country}
      onValueChange={changeCountry}
    >
      <SelectTrigger
        aria-label={t("phoneCountry")}
        className="h-11! shrink-0 rounded-r-none border-r-0 px-2"
      >
        <span>
          {country} +{getCountryCallingCode(country)}
        </span>
      </SelectTrigger>
      <SelectContent
        align="start"
        alignItemWithTrigger={false}
        className="max-h-72 w-72 max-w-[calc(100vw-2rem)]"
      >
        {preferred.map((code) => (
          <SelectItem
            key={code}
            value={code}
            className="px-4 py-3"
          >
            {names.of(code) ?? code} +{getCountryCallingCode(code)}
          </SelectItem>
        ))}
        <SelectSeparator />
        {countries.map((code) => (
          <SelectItem
            key={code}
            value={code}
            className="px-4 py-3"
          >
            {names.of(code) ?? code} +{getCountryCallingCode(code)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default PhoneCountrySelect
