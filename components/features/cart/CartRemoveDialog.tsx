"use client"

import type { ReactElement } from "react"
import { useRef } from "react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface IProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  title: string
}

const CartRemoveDialog = ({ open, onOpenChange, onConfirm, title }: IProps): ReactElement => {
  const t = useTranslations("Cart")
  // keeps keyboard confirmation on the non destructive action until the user chooses removal.
  const cancelButton = useRef<HTMLButtonElement>(null)

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent
        showCloseButton={false}
        initialFocus={cancelButton}
      >
        <DialogHeader className="py-2">
          <DialogTitle>{t("removeTitle")}</DialogTitle>
          <DialogDescription>{t("removeDescription", { title })}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="py-2">
          <DialogClose
            render={
              <Button
                ref={cancelButton}
                variant="outline"
              />
            }
          >
            {t("keepItem")}
          </DialogClose>
          <Button
            variant="destructive"
            onClick={onConfirm}
          >
            {t("confirmRemove")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CartRemoveDialog
