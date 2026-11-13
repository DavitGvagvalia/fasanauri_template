import { formatPhoneDigits } from "@/lib/checkout/formatPhoneDigits"
import { getPhoneDigits } from "@/lib/checkout/getPhoneDigits"
import type { IPhoneEdit, IPhoneEditOptions } from "@/types/checkoutPhone"

export const getPhoneEdit = ({
  country,
  previousDigits,
  value,
  caret,
  inputType,
}: IPhoneEditOptions): IPhoneEdit => {
  const beforeCaret = value.slice(0, caret).replace(/\D/g, "").length
  const national = value.replace(/\D/g, "")
  const formatted = formatPhoneDigits(country, previousDigits)
  const deletingSeparator = national === previousDigits && value.length < formatted.length
  const removeIndex = Math.max(
    0,
    inputType === "deleteContentBackward" ? beforeCaret - 1 : beforeCaret
  )
  const digits = getPhoneDigits(
    country,
    deletingSeparator ? national.slice(0, removeIndex) + national.slice(removeIndex + 1) : national
  )
  const nextCaret = deletingSeparator ? removeIndex : beforeCaret

  return { digits, caret: formatPhoneDigits(country, digits.slice(0, nextCaret)).length }
}
