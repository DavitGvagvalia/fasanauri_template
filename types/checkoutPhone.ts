import type { CountryCode } from "libphonenumber-js"

export interface IPhoneEditOptions {
  country: CountryCode
  previousDigits: string
  value: string
  caret: number
  inputType?: string
}

export interface IPhoneEdit {
  digits: string
  caret: number
}
