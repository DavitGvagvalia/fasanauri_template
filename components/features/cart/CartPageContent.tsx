"use client"

import type { ReactElement } from "react"

import { useTranslations } from "next-intl"
import CartItems from "@/components/features/cart/CartItems"
import CartSummary from "@/components/features/cart/CartSummary"
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
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{t("description")}</p>
      <CartItems />
      <CartSummary />
      <div className="mt-6 flex flex-col gap-3">
        {count > 0 && (
          <Link
            href="/checkout"
            className={buttonVariants({ className: "h-11" })}
          >
            {t("checkout")}
          </Link>
        )}
        <Link
          href="/"
          className={buttonVariants({ variant: "outline", className: "h-11" })}
        >
          {t("continue")}
        </Link>
      </div>
    </main>
  )
}

export default CartPageContent
