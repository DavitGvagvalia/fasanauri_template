"use client"

import type { ReactElement } from "react"

import { Clock3 } from "lucide-react"
import { useState } from "react"
import { useTranslations } from "next-intl"

import CartItems from "@/components/features/cart/CartItems"
import OrderFlow from "@/components/features/cart/OrderFlow"
import OrderNotificationPermission from "@/components/features/cart/OrderNotificationPermission"
import CheckoutTotal from "@/components/features/checkout/CheckoutTotal"
import CheckoutForm from "@/components/features/checkout/CheckoutForm"
import { Button, buttonVariants } from "@/components/ui/button"
import { useCart } from "@/hooks/useCart"
import { Link } from "@/i18n/navigation"
import type { TCheckoutValues } from "@/types/checkout"

const CheckoutContent = (): ReactElement => {
  const t = useTranslations("Checkout")
  const cart = useTranslations("Cart")
  const count = useCart((state) => state.count)
  const submitDemoOrder = useCart((state) => state.submitDemoOrder)
  const setCartOpen = useCart((state) => state.setCartOpen)
  const ready = useCart((state) => state.ready)
  const [completed, setCompleted] = useState(false)
  const complete = (values: TCheckoutValues): void => {
    if (submitDemoOrder(values.note)) {
      setCompleted(true)
    }
  }

  const viewPendingOrder = (): void => {
    setCartOpen(true)
  }

  if (completed) {
    return (
      <main
        id="main-content"
        className="site-container flex min-h-[65vh] flex-col items-center justify-center gap-5 py-12 text-center"
      >
        <Clock3
          className="size-12"
          aria-hidden
        />
        <h1 className="text-3xl font-semibold">{t("successTitle")}</h1>
        <p className="max-w-xl text-sm leading-7 text-muted-foreground">
          {t("successDescription")}
        </p>
        <Button
          onClick={viewPendingOrder}
          className="h-11"
        >
          {t("viewPendingOrder")}
        </Button>
        <div className="w-full max-w-sm">
          <OrderNotificationPermission prompt />
        </div>
        <Link
          href="/"
          className={buttonVariants({ className: "mt-3 h-11" })}
        >
          {cart("continue")}
        </Link>
      </main>
    )
  }

  return (
    <main
      id="main-content"
      className="site-container py-6 md:flex md:flex-1 md:flex-col md:py-8"
    >
      {/* keeps the columns close together and lets the document own scrolling. */}
      <div className="mx-auto grid w-full max-w-[86rem] items-start gap-4 md:flex-1 md:grid-cols-[minmax(18rem,1fr)_minmax(0,1.1fr)] lg:grid-cols-[minmax(16rem,1fr)_minmax(0,1.1fr)_minmax(16rem,1fr)] xl:gap-5">
        <div className="space-y-4">
          <section
            aria-label={t("details")}
            className="rounded-xl border bg-background p-5"
          >
            <h1 className="mb-4 text-3xl font-semibold">{t("title")}</h1>
            <h2 className="mb-4 text-lg font-medium">{t("details")}</h2>
            <CheckoutForm
              onComplete={complete}
              disabled={!ready || count === 0}
            />
          </section>
          <CheckoutTotal />
        </div>
        <section
          aria-label={t("summary")}
          className="w-full min-w-0"
        >
          <h2 className="text-lg font-medium">{t("summary")}</h2>
          <CartItems compact />
          {ready && count === 0 && (
            <Link
              href="/"
              className={buttonVariants({ variant: "outline", className: "h-11" })}
            >
              {cart("continue")}
            </Link>
          )}
        </section>
        <aside
          aria-label={t("orderInformation")}
          className="min-w-0 rounded-xl border bg-card p-5 md:col-span-2 lg:col-span-1"
        >
          <OrderFlow />
        </aside>
      </div>
    </main>
  )
}

export default CheckoutContent
