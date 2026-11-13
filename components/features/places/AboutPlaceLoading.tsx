import type { ReactElement } from "react"
import { useTranslations } from "next-intl"

import { Skeleton } from "@/components/ui/skeleton"

const AboutPlaceLoading = (): ReactElement => {
  const t = useTranslations("Places")

  return (
    <main
      id="main-content"
      aria-busy="true"
      aria-label={t("loading")}
    >
      <Skeleton className="h-[65svh] min-h-80 w-full rounded-none" />
      <div className="site-container grid gap-12 py-12 md:grid-cols-2">
        <Skeleton className="h-96" />
        <Skeleton className="h-96" />
      </div>
    </main>
  )
}

export default AboutPlaceLoading
