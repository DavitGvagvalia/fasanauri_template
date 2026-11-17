"use client"

import type { ReactElement } from "react"

import { ShoppingBag, X } from "lucide-react"
import { useTranslations } from "next-intl"

import CartDrawerContent from "@/components/features/cart/CartDrawerContent"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useCart } from "@/hooks/useCart"

const CartButton = (): ReactElement => {
  const t = useTranslations("Cart")
  const common = useTranslations("Common")
  const count = useCart((state) => state.count)
  const cartOpen = useCart((state) => state.cartOpen)
  const setCartOpen = useCart((state) => state.setCartOpen)

  return (
    <Sheet
      open={cartOpen}
      onOpenChange={setCartOpen}
    >
      <SheetTrigger
        render={
          <Button
            variant="secondary"
            aria-label={t("open", { count })}
            className="relative size-10 p-0 [&_svg]:size-5"
          />
        }
      >
        <ShoppingBag
          className="size-5"
          aria-hidden
        />
        <span
          aria-hidden
          className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs text-primary-foreground"
        >
          {count}
        </span>
      </SheetTrigger>
      <SheetContent
        showCloseButton={false}
        aria-describedby={undefined}
        className="order-sheet gap-0 data-[side=right]:w-full data-[side=right]:sm:max-w-md"
      >
        <SheetHeader className="flex-row items-center justify-between gap-3 p-4 pb-3">
          <SheetTitle className="text-2xl font-bold">{t("title")}</SheetTitle>
          <SheetClose
            render={
              <Button
                variant="ghost"
                size="icon"
                aria-label={common("close")}
              />
            }
          >
            <X aria-hidden />
          </SheetClose>
        </SheetHeader>
        <CartDrawerContent />
      </SheetContent>
    </Sheet>
  )
}

export default CartButton
