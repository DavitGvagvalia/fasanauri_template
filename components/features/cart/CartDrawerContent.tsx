"use client"

import type { ReactElement } from "react"

import { useTranslations } from "next-intl"

import CartItems from "@/components/features/cart/CartItems"
import CartSummary from "@/components/features/cart/CartSummary"
import PendingOrders from "@/components/features/cart/PendingOrders"
import CtaPattern from "@/components/shared/CtaPattern"
import { buttonVariants } from "@/components/ui/button"
import { SheetFooter } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsIndicator, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCart } from "@/hooks/useCart"
import { Link } from "@/i18n/navigation"

const CartDrawerContent = (): ReactElement => {
  const t = useTranslations("Cart")
  const pending = useTranslations("PendingOrders")
  const count = useCart((state) => state.count)
  const ready = useCart((state) => state.ready)
  const cartTab = useCart((state) => state.cartTab)
  const setCartTab = useCart((state) => state.setCartTab)
  const setCartOpen = useCart((state) => state.setCartOpen)
  const requiresConfirmation = useCart((state) =>
    state.pendingOrders.some((order) => order.status === "confirmationRequired")
  )

  const close = (): void => {
    setCartOpen(false)
  }

  const changeTab = (value: unknown): void => {
    if (value === "order" || value === "pending") {
      setCartTab(value)
    }
  }

  return (
    <Tabs
      value={cartTab}
      onValueChange={changeTab}
      className="min-h-0 flex-1 gap-0"
    >
      <TabsList
        variant="pill"
        aria-label={t("drawerTabs")}
        className="mx-4 mb-3 grid w-auto shrink-0 grid-cols-2 rounded-xl bg-secondary p-1 group-data-horizontal/tabs:h-auto"
      >
        <TabsTrigger
          value="order"
          className="min-h-10 min-w-0 rounded-lg whitespace-normal px-3 text-sm"
        >
          {t("orderTab")}
        </TabsTrigger>
        <TabsTrigger
          value="pending"
          className="min-h-10 min-w-0 rounded-lg whitespace-normal px-3 text-sm"
        >
          <span className="relative">
            {t("pendingTab")}
            {requiresConfirmation && (
              <>
                <span
                  aria-hidden="true"
                  className="absolute -top-0.5 -right-2.5 size-1.5 rounded-full bg-confirmation"
                />
                <span className="sr-only">. {pending("orderRequiresConfirmation")}</span>
              </>
            )}
          </span>
        </TabsTrigger>
        <TabsIndicator className="rounded-lg" />
      </TabsList>
      <TabsContent
        value="order"
        className="flex min-h-0 flex-1 flex-col"
      >
        <div className="min-h-0 flex-1 overflow-y-auto px-4 pt-1">
          <CartItems />
        </div>
        <SheetFooter className="shrink-0 border-t p-4">
          <CartSummary />
          {count > 0 && (
            <Link
              href="/checkout"
              onClick={close}
              className={buttonVariants({ className: "relative isolate h-11 overflow-hidden" })}
              aria-disabled={!ready}
            >
              <CtaPattern />
              {t("checkout")}
            </Link>
          )}
        </SheetFooter>
      </TabsContent>
      <TabsContent
        value="pending"
        className="min-h-0 flex-1 overflow-y-auto px-4 pb-6 pt-2"
      >
        <PendingOrders />
      </TabsContent>
    </Tabs>
  )
}

export default CartDrawerContent
