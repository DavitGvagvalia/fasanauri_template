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
      <Skeleton className="h-[71.5svh] min-h-88 w-full rounded-none" />
      <div className="site-container max-w-[1200px] grid gap-12 py-12 md:grid-cols-2">
        <Skeleton className="h-96" />
        <Skeleton className="h-96" />
      </div>
    </main>
  )
}

export default AboutPlaceLoading
