"use client"

import type { ReactElement } from "react"

import { ArrowLeft, ShoppingBag, X } from "lucide-react"
import { useTranslations } from "next-intl"

import CartItems from "@/components/features/cart/CartItems"
import CartSummary from "@/components/features/cart/CartSummary"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useCart } from "@/hooks/useCart"
import { Link } from "@/i18n/navigation"

const CartButton = (): ReactElement => {
  const t = useTranslations("Cart")
  const common = useTranslations("Common")
  const count = useCart((state) => state.count)
  const ready = useCart((state) => state.ready)
  const cartOpen = useCart((state) => state.cartOpen)
  const setCartOpen = useCart((state) => state.setCartOpen)

  const close = (): void => {
    setCartOpen(false)
  }

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
            className="relative size-10 gap-2 p-0 sm:w-auto sm:px-3 [&_svg]:size-5"
          />
        }
      >
        <ShoppingBag
          className="size-5"
          aria-hidden
        />
        <span className="hidden md:inline">{t("title")}</span>
        {count > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[0.625rem] text-primary-foreground sm:static sm:min-w-5 sm:text-xs">
            {count}
          </span>
        )}
      </SheetTrigger>
      <SheetContent
        showCloseButton={false}
        className="data-[side=right]:w-full data-[side=right]:sm:max-w-md"
      >
        <SheetHeader className="border-b px-5 py-6 pr-14">
          <SheetTitle>{t("title")}</SheetTitle>
          <SheetDescription>{t("description")}</SheetDescription>
        </SheetHeader>
        <SheetClose
          render={
            <Button
              variant="ghost"
              size="icon"
              aria-label={common("close")}
              className="absolute top-5 right-4"
            />
          }
        >
          <X aria-hidden />
        </SheetClose>
        <div className="min-h-0 flex-1 overflow-y-auto px-5">
          <CartItems />
        </div>
        <SheetFooter className="border-t p-5">
          <CartSummary />
          {count > 0 && (
            <Link
              href="/checkout"
              onClick={close}
              className={buttonVariants({ className: "h-11" })}
              aria-disabled={!ready}
            >
              {t("checkout")}
            </Link>
          )}
          <Button
            variant="outline"
            className="h-11"
            onClick={close}
          >
            <ArrowLeft aria-hidden />
            {t("goBack")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export default CartButton
