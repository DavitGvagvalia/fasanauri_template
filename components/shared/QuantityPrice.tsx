import type { ReactElement } from "react"
import { useLocale } from "next-intl"

import { formatAmount } from "@/lib/formatAmount"
import { formatPrice } from "@/lib/formatPrice"

interface IProps {
  priceMinor: number
  quantity: number
}

const QuantityPrice = ({ priceMinor, quantity }: IProps): ReactElement => {
  const locale = useLocale()

  return (
    <span className="tabular-nums">
      {quantity > 1 && (
        <>
          <span className="font-normal text-muted-foreground">{quantity}x</span>
          {formatAmount(priceMinor, locale)}
          <span className="font-normal text-muted-foreground"> = </span>
        </>
      )}
      {formatPrice(priceMinor * quantity, locale)}
    </span>
  )
}

export default QuantityPrice
