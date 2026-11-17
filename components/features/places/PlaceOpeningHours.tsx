import { Clock, Settings } from "lucide-react"
import { useTranslations } from "next-intl"
import type { ReactElement } from "react"

import { WEEK_DAYS } from "@/constants"

const PlaceOpeningHours = (): ReactElement => {
  const t = useTranslations("Information")

  return (
    <div className="space-y-12">
      <section aria-labelledby="opening-hours">
        <h2
          id="opening-hours"
          className="mb-6 flex items-center gap-3 text-lg font-medium"
        >
          <Clock
            className="size-5 text-muted-foreground"
            aria-hidden
          />
          {t("hours")}
        </h2>
        <dl className="w-fit space-y-5 text-sm sm:text-base">
          {WEEK_DAYS.map((day) => (
            <div
              key={day}
              className="grid grid-cols-[minmax(0,1fr)_auto] gap-8 text-muted-foreground"
            >
              <dt>{t(day)}</dt>
              <dd className="shrink-0 tabular-nums">{t("hoursValue")}</dd>
            </div>
          ))}
        </dl>
      </section>
      <section aria-labelledby="place-facilities">
        <h2
          id="place-facilities"
          className="mb-5 flex items-center gap-3 text-lg font-medium"
        >
          <Settings
            className="size-5 text-muted-foreground"
            aria-hidden
          />
          {t("facilities")}
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">{t("facilitiesPlaceholder")}</p>
      </section>
    </div>
  )
}

export default PlaceOpeningHours
