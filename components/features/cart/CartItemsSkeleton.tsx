import type { ReactElement } from "react"
import { useTranslations } from "next-intl"

import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface IProps {
  showDescription?: boolean
  compact?: boolean
}

const CartItemsSkeleton = ({ showDescription = false, compact = false }: IProps): ReactElement => {
  const t = useTranslations("Cart")

  return (
    <div
      role="status"
      aria-label={t("loading")}
    >
      <span className="sr-only">{t("loading")}</span>
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          aria-hidden
          className={cn(
            "grid gap-2 border-b py-3 last:border-0",
            compact
              ? "grid-cols-[3.5rem_minmax(0,1fr)_auto]"
              : "grid-cols-[4rem_minmax(0,1fr)_auto] sm:grid-cols-[5rem_minmax(0,1fr)_auto]"
          )}
        >
          <Skeleton className={cn("rounded-lg", compact ? "size-14" : "size-16 sm:size-20")} />
          <div className={cn("flex flex-col gap-2", compact ? "min-h-14" : "min-h-16 sm:min-h-20")}>
            <Skeleton className="h-5 w-3/4" />
            {showDescription && <Skeleton className="h-10 w-full" />}
            <Skeleton className="mt-auto h-5 w-24" />
          </div>
          <div className="flex items-center justify-end">
            <Skeleton className="h-9 w-28" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default CartItemsSkeleton
