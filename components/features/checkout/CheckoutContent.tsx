"use client"

import type { ReactElement } from "react"

import { CheckCircle2 } from "lucide-react"
import { useState } from "react"
import { useTranslations } from "next-intl"

import CartItems from "@/components/features/cart/CartItems"
import CheckoutTotal from "@/components/features/checkout/CheckoutTotal"
import CheckoutForm from "@/components/features/checkout/CheckoutForm"
import { buttonVariants } from "@/components/ui/button"
import { useCart } from "@/hooks/useCart"
import { Link } from "@/i18n/navigation"

const CheckoutContent = (): ReactElement => {
  const t = useTranslations("Checkout")
  const cart = useTranslations("Cart")
  const count = useCart((state) => state.count)
  const clearCart = useCart((state) => state.clearCart)
  const ready = useCart((state) => state.ready)
  const [completed, setCompleted] = useState(false)
  const complete = (): void => {
    if (count > 0) {
      setCompleted(true)
      clearCart()
    }
  }
  if (completed) {
    return (
      <main
        id="main-content"
        className="site-container flex min-h-[65vh] flex-col items-center justify-center gap-5 py-12 text-center"
      >
        <CheckCircle2
          className="size-12"
          aria-hidden
        />
        <h1 className="text-3xl font-semibold">{t("successTitle")}</h1>
        <p className="max-w-xl text-sm leading-7 text-muted-foreground">
          {t("successDescription")}
        </p>
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
      className="site-container py-10 md:flex md:flex-1 md:flex-col"
    >
      {/* fills the existing layout space so the sticky column can travel without adding page height. */}
      <div className="grid items-start gap-8 md:flex-1 md:grid-cols-[minmax(18rem,3fr)_minmax(0,7fr)] md:gap-12">
        <div className="space-y-5 md:sticky md:top-28 md:max-h-[calc(100svh-8rem)] md:overflow-y-auto">
          {/* keeps every form control reachable when a short viewport needs its own form scroll. */}
          <section
            aria-label={t("details")}
            className="rounded-xl border bg-background p-5 sm:p-6"
          >
            <h1 className="mb-5 text-3xl font-semibold">{t("title")}</h1>
            <h2 className="mb-6 text-lg font-medium">{t("details")}</h2>
            <CheckoutForm
              onComplete={complete}
              disabled={!ready || count === 0}
            />
          </section>
          <CheckoutTotal />
        </div>
        <section
          aria-label={t("summary")}
          className="w-full min-w-0 max-w-[46.2rem]"
        >
          <h2 className="text-lg font-medium">{t("summary")}</h2>
          <CartItems showDescription />
          {ready && count === 0 && (
            <Link
              href="/"
              className={buttonVariants({ variant: "outline", className: "h-11" })}
            >
              {cart("continue")}
            </Link>
          )}
        </section>
      </div>
    </main>
  )
}

export default CheckoutContent
