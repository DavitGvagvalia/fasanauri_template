"use client"

import { useFormatter, useTranslations } from "next-intl"
import { Skeleton } from "@/components/ui/skeleton"
import type { ReactElement } from "react"

interface IProps {
  title: string
  count: number
  loading: boolean
  error: boolean
}

const MenuHeading = ({ title, count, loading, error }: IProps): ReactElement => {
  const t = useTranslations("Menu")
  const format = useFormatter()

  return (
    <header className="mb-5 flex flex-wrap items-baseline gap-x-2 gap-y-1 sm:mb-6">
      <h1 className="min-w-0 text-3xl font-semibold tracking-tight break-words sm:text-4xl">
        {title}
      </h1>
      {loading ? (
        <Skeleton
          role="status"
          aria-label={t("loading")}
          className="h-5 w-8 self-center sm:h-6"
        />
      ) : (
        !error && (
          <span
            aria-live="polite"
            aria-label={t("results", { count })}
            className="relative -top-0.5 text-base text-muted-foreground tabular-nums sm:-top-1 sm:text-lg"
          >
            ({format.number(count)})
          </span>
        )
      )}
    </header>
  )
}

export default MenuHeading
