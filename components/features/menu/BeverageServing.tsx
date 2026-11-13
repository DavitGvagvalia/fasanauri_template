"use client"

import { useId } from "react"
import { useTranslations } from "next-intl"
import { Label } from "@/components/ui/label"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import type { TServing } from "@/types/menu"
import type { ReactElement } from "react"

interface IProps {
  serving: TServing
  onChange: (serving: TServing) => void
}

const BeverageServing = ({ serving, onChange }: IProps): ReactElement => {
  const t = useTranslations("Menu")
  const id = useId()
  const handleChange = (values: string[]): void => {
    const value = values[0]
    if (value === "bottle" || value === "glass") {
      onChange(value)
    }
  }

  return (
    <div className="space-y-2">
      <Label id={id}>{t("serving")}</Label>
      <ToggleGroup
        aria-labelledby={id}
        value={[serving]}
        onValueChange={handleChange}
        variant="outline"
        size="sm"
        className="w-fit"
      >
        <ToggleGroupItem
          value="bottle"
          className="h-8 px-3 data-pressed:bg-primary data-pressed:text-primary-foreground data-pressed:hover:bg-primary/85"
        >
          {t("bottle")}
        </ToggleGroupItem>
        <ToggleGroupItem
          value="glass"
          className="h-8 px-3 data-pressed:bg-primary data-pressed:text-primary-foreground data-pressed:hover:bg-primary/85"
        >
          {t("glass")}
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}

export default BeverageServing
