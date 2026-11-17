"use client"

import type { MouseEvent, ReactElement } from "react"

import { ArrowLeft, RotateCcw } from "lucide-react"
import { useTranslations } from "next-intl"
import { Button, buttonVariants } from "@/components/ui/button"
import BrandLogo from "@/components/shared/BrandLogo"
import { Link } from "@/i18n/navigation"
import { goBackFromError } from "@/lib/navigation/goBackFromError"

interface IProps {
  kind: "notFound" | "unexpected"
  onRetry?: () => void
}

const ErrorState = ({ kind, onRetry }: IProps): ReactElement => {
  const t = useTranslations("Errors")

  const goBack = (event: MouseEvent<HTMLAnchorElement>): void => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return
    }
    if (goBackFromError()) {
      event.preventDefault()
    }
  }

  return (
    <main
      id="main-content"
      className="site-container flex min-h-[70vh] flex-col items-center justify-center py-16 text-center"
    >
      <Link
        href="/"
        className="mb-8 flex items-center gap-2 text-lg font-semibold"
      >
        <BrandLogo className="size-8 shrink-0 sm:size-10" />
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
            onClick={goBack}
            className={buttonVariants({ variant: "outline", className: "h-11" })}
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
