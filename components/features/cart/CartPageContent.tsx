"use client"

import type { ReactElement } from "react"

import { useTranslations } from "next-intl"
import CartItems from "@/components/features/cart/CartItems"
import CartSummary from "@/components/features/cart/CartSummary"
import CtaPattern from "@/components/shared/CtaPattern"
import { buttonVariants } from "@/components/ui/button"
import { useCart } from "@/hooks/useCart"
import { Link } from "@/i18n/navigation"

const CartPageContent = (): ReactElement => {
  const t = useTranslations("Cart")
  const count = useCart((state) => state.count)

  return (
    <main
      id="main-content"
      className="site-container py-10"
    >
      <h1 className="text-3xl font-semibold">{t("title")}</h1>
      <CartItems />
      <CartSummary />
      <div className="mt-6 flex flex-col gap-3">
        {count > 0 && (
          <Link
            href="/checkout"
            className={buttonVariants({ className: "relative isolate h-11 overflow-hidden" })}
          >
            <CtaPattern />
            {t("checkout")}
          </Link>
        )}
        <Link
          href="/"
          className={buttonVariants({
            variant: "outline",
            className: "relative isolate h-11 overflow-hidden",
          })}
        >
          {t("continue")}
        </Link>
      </div>
    </main>
  )
}

export default CartPageContent
