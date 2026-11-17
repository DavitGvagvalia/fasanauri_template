import type { ReactElement } from "react"

import { useLocale, useTranslations } from "next-intl"

import CardImage from "@/components/shared/CardImage"
import QuantityPrice from "@/components/shared/QuantityPrice"
import { formatPrice } from "@/lib/formatPrice"
import type { ICartLine } from "@/types/cart"

interface IProps {
  line: ICartLine
}

const PendingOrderLine = ({ line }: IProps): ReactElement => {
  const locale = useLocale()
  const t = useTranslations("PendingOrders")
  const menu = useTranslations("Menu")

  return (
    <li className="group/card flex gap-3 border-b py-4 last:border-0">
      <div className="relative size-20 shrink-0 overflow-hidden rounded-md">
        <CardImage
          imageURL={line.product.imageURL}
          alt={line.product.title[locale]}
          sizes="80px"
        />
      </div>
      <div className="min-h-20 min-w-0 flex-1 space-y-1">
        <p className="text-sm font-medium">{line.product.title[locale]}</p>
        {line.serving && <p className="text-xs text-muted-foreground">{menu(line.serving)}</p>}
        <p className="text-xs text-muted-foreground">
          {t("unitPrice", { price: formatPrice(line.product.priceMinor, locale) })}
        </p>
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
          <span className="text-xs text-muted-foreground">
            {t("quantity", { count: line.quantity })}
          </span>
          <span className="font-semibold">
            <QuantityPrice
              priceMinor={line.product.priceMinor}
              quantity={line.quantity}
            />
          </span>
        </div>
      </div>
    </li>
  )
}

export default PendingOrderLine
