import type { ReactElement } from "react"
import { useLocale } from "next-intl"

import { formatPrice } from "@/lib/formatPrice"

interface IProps {
  priceMinor: number
  quantity: number
}

const QuantityPrice = ({ priceMinor, quantity }: IProps): ReactElement => {
  const locale = useLocale()

  return <span className="tabular-nums">{formatPrice(priceMinor * quantity, locale)}</span>
}

export default QuantityPrice
