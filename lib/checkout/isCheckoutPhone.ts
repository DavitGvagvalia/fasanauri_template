import parsePhoneNumber from "libphonenumber-js/max"

export const isCheckoutPhone = (value: string): boolean => {
  const phone = parsePhoneNumber(value, { defaultCountry: "GE", extract: false })

  return !!phone && !phone.ext && phone.isValid()
}
