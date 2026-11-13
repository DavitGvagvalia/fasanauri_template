import type { ReactElement } from "react"
import { useTranslations } from "next-intl"

import { Skeleton } from "@/components/ui/skeleton"

interface IProps {
  showDescription?: boolean
}

const CartItemsSkeleton = ({ showDescription = false }: IProps): ReactElement => {
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
          className="grid grid-cols-[6rem_minmax(0,1fr)] gap-3 border-b py-5 last:border-0 sm:grid-cols-[7rem_minmax(0,1fr)]"
        >
          <Skeleton className="size-24 rounded-lg sm:size-28" />
          <div className="flex min-h-24 flex-col gap-3 sm:min-h-28">
            <Skeleton className="h-5 w-3/4" />
            {showDescription && <Skeleton className="h-10 w-full" />}
            <Skeleton className="mt-auto h-5 w-24" />
          </div>
          <div className="col-span-2 flex justify-between">
            <Skeleton className="h-9 w-28" />
            <Skeleton className="size-9" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default CartItemsSkeleton
