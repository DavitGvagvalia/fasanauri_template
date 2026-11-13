"use client"

import { X } from "lucide-react"
import { useTranslations } from "next-intl"
import type { ReactElement } from "react"

import { Button } from "@/components/ui/button"
import { DialogClose } from "@/components/ui/dialog"

const ProductDialogClose = (): ReactElement => {
  const t = useTranslations("Common")

  return (
    <DialogClose
      render={
        <Button
          variant="secondary"
          size="icon"
          aria-label={t("close")}
          className="absolute top-3 right-3 z-20 rounded-full"
        />
      }
    >
      <X aria-hidden />
    </DialogClose>
  )
}

export default ProductDialogClose
