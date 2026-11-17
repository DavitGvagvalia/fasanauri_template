"use client"

import type { ReactElement } from "react"
import { useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"

import ProductDialog from "@/components/features/menu/ProductDialog"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/useCart"
import { useProductDetails } from "@/hooks/useProductDetails"
import { updateProductDialogURL } from "@/lib/menu/updateProductDialogURL"

const ProductModal = (): ReactElement | null => {
  const params = useSearchParams()
  const t = useTranslations("Menu")
  const common = useTranslations("Common")
  const ready = useCart((state) => state.ready)
  const id = params.get("product")
  const { product, error } = useProductDetails(id)
  const close = (): void => {
    updateProductDialogURL(null)
  }
  const handleOpenChange = (open: boolean): void => {
    if (!open) {
      close()
    }
  }

  if (!id && !product) {
    return null
  }

  return (
    <Dialog
      open={!!id}
      onOpenChange={handleOpenChange}
    >
      {product && ready ? (
        <ProductDialog
          key={`${product.id}:${params.get("serving")}`}
          product={product}
          initialServing={params.get("serving") === "glass" ? "glass" : "bottle"}
          onAdded={close}
        />
      ) : (
        <DialogContent showCloseButton={false}>
          <DialogTitle>{error ? t("productUnavailable") : t("loading")}</DialogTitle>
          <DialogDescription>
            {error ? t("productUnavailableDescription") : t("loading")}
          </DialogDescription>
          <Button onClick={close}>{common("close")}</Button>
        </DialogContent>
      )}
    </Dialog>
  )
}

export default ProductModal
