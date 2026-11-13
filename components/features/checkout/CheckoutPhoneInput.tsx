"use client"

import { getCountryCallingCode, parsePhoneNumberFromString } from "libphonenumber-js"
import { useState } from "react"
import type { CountryCode } from "libphonenumber-js"
import type { ChangeEvent, ClipboardEvent, ReactElement, Ref } from "react"

import PhoneCountrySelect from "@/components/features/checkout/PhoneCountrySelect"
import { Input } from "@/components/ui/input"
import { getPhoneMask } from "@/lib/checkout/getPhoneMask"
import { formatPhoneDigits } from "@/lib/checkout/formatPhoneDigits"
import { getPhoneEdit } from "@/lib/checkout/getPhoneEdit"
import { getPhoneDigits } from "@/lib/checkout/getPhoneDigits"

interface IProps {
  value: string
  onChange: (value: string) => void
  onBlur: () => void
  inputRef: Ref<HTMLInputElement>
  invalid: boolean
}

const CheckoutPhoneInput = ({
  value,
  onChange,
  onBlur,
  inputRef,
  invalid,
}: IProps): ReactElement => {
  const [country, setCountry] = useState<CountryCode>("GE")
  const prefix = `+${getCountryCallingCode(country)}`
  const digits = value.startsWith(prefix) ? getPhoneDigits(country, value.slice(prefix.length)) : ""
  const mask = getPhoneMask(country, digits.length)
  const formatted = formatPhoneDigits(country, digits)

  const changeNumber = (event: ChangeEvent<HTMLInputElement>): void => {
    const input = event.target
    const edit = getPhoneEdit({
      country,
      previousDigits: digits,
      value: input.value,
      caret: input.selectionStart ?? input.value.length,
      inputType: (event.nativeEvent as InputEvent).inputType,
    })

    onChange(edit.digits ? `${prefix}${edit.digits}` : "")
    // formatting inserts spaces, restore the caret by digit position for edits within the number.
    requestAnimationFrame(() => input.setSelectionRange(edit.caret, edit.caret))
  }

  const changeCountry = (nextCountry: CountryCode): void => {
    const national = getPhoneDigits(nextCountry, digits)
    setCountry(nextCountry)
    onChange(national ? `+${getCountryCallingCode(nextCountry)}${national}` : "")
  }

  const pasteNumber = (event: ClipboardEvent<HTMLInputElement>): void => {
    const pasted = event.clipboardData.getData("text").trim()
    if (!pasted.startsWith("+")) {
      return
    }
    const parsed = parsePhoneNumberFromString(pasted)
    if (parsed?.country) {
      event.preventDefault()
      setCountry(parsed.country)
      const national = getPhoneDigits(parsed.country, parsed.nationalNumber)
      onChange(`+${getCountryCallingCode(parsed.country)}${national}`)
    }
  }

  return (
    <div className="flex min-w-0">
      <PhoneCountrySelect
        country={country}
        onChange={changeCountry}
      />
      <div className="relative min-w-0 flex-1">
        <Input
          ref={inputRef}
          id="checkout-phone"
          name="phone"
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          value={formatted}
          onChange={changeNumber}
          onBlur={onBlur}
          onPaste={pasteNumber}
          placeholder={getPhoneMask(country, 0)}
          maxLength={getPhoneMask(country, 0).length}
          aria-invalid={invalid}
          aria-describedby={invalid ? "phone-error" : undefined}
          className="h-11 rounded-l-none font-mono placeholder:text-transparent"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-2.5 left-2.5 flex items-center overflow-hidden font-mono text-base whitespace-pre text-muted-foreground md:text-sm"
        >
          <span className="invisible">{formatted}</span>
          {mask}
        </span>
      </div>
    </div>
  )
}

export default CheckoutPhoneInput
