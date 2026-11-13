"use client"

import { useLocale } from "next-intl"

import { useCart } from "@/hooks/useCart"
import type { ICartLine } from "@/types/cart"
import type { ReactElement } from "react"

interface IProps {
  line: ICartLine
}

const CartProductTitle = ({ line }: IProps): ReactElement => {
  const locale = useLocale()
  const openProduct = useCart((state) => state.openProduct)

  const showProduct = (): void => {
    openProduct(line)
  }

  return (
    <button
      type="button"
      onClick={showProduct}
      aria-haspopup="dialog"
      className="link-underline cursor-pointer rounded-sm text-left text-sm leading-5 font-medium outline-none focus-visible:ring-3 focus-visible:ring-ring sm:leading-6"
    >
      {line.product.title[locale]}
    </button>
  )
}

export default CartProductTitle
