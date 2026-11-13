"use client"

import type { ReactElement } from "react"

import { ArrowLeft, RotateCcw, Utensils } from "lucide-react"
import { useTranslations } from "next-intl"
import { Button, buttonVariants } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"

interface IProps {
  kind: "notFound" | "unexpected"
  onRetry?: () => void
}

const ErrorState = ({ kind, onRetry }: IProps): ReactElement => {
  const t = useTranslations("Errors")

  return (
    <main
      id="main-content"
      className="site-container flex min-h-[70vh] flex-col items-center justify-center py-16 text-center"
    >
      <Link
        href="/"
        className="mb-8 flex items-center gap-2 text-lg font-semibold"
      >
        <Utensils
          className="size-5"
          aria-hidden
        />
        {t("brand")}
      </Link>
      <div className="flex w-full flex-col items-center rounded-2xl border bg-muted/30 px-5 py-14 sm:py-20">
        <p className="mb-4 text-7xl font-semibold tracking-tight text-muted-foreground/50">
          {kind === "notFound" ? 404 : 500}
        </p>
        <h1 className="text-2xl font-semibold sm:text-3xl">
          {t(kind === "notFound" ? "notFoundTitle" : "unexpectedTitle")}
        </h1>
        <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground">
          {t(kind === "notFound" ? "notFoundDescription" : "unexpectedDescription")}
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          {onRetry && (
            <Button
              onClick={onRetry}
              className="h-11"
            >
              <RotateCcw aria-hidden />
              {t("retry")}
            </Button>
          )}
          <Link
            href="/"
            className={buttonVariants({
              variant: "outline",
              className: "h-11",
            })}
          >
            <ArrowLeft aria-hidden />
            {t("back")}
          </Link>
        </div>
      </div>
    </main>
  )
}

export default ErrorState
