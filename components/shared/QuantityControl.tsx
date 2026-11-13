"use client"

import type { ReactElement } from "react"

import { Minus, Plus } from "lucide-react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { MAX_CART_QUANTITY } from "@/constants"

interface IProps {
  quantity: number
  onChange: (quantity: number) => void
  minimum?: number
  label: string
}

const QuantityControl = ({ quantity, onChange, minimum = 1, label }: IProps): ReactElement => {
  const t = useTranslations("Common")
  const decrease = (): void => {
    onChange(quantity - 1)
  }
  const increase = (): void => {
    onChange(quantity + 1)
  }

  return (
    <div
      role="group"
      aria-label={label}
      className="inline-flex shrink-0 items-center gap-1 rounded-lg border p-1"
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={decrease}
        disabled={quantity <= minimum}
        aria-label={t("decrease")}
      >
        <Minus aria-hidden />
      </Button>
      <span
        aria-live="polite"
        className="min-w-7 text-center text-sm tabular-nums"
      >
        {quantity}
      </span>
      <Button
        variant="ghost"
        size="icon"
        onClick={increase}
        disabled={quantity >= MAX_CART_QUANTITY}
        aria-label={t("increase")}
      >
        <Plus aria-hidden />
      </Button>
    </div>
  )
}

export default QuantityControl
