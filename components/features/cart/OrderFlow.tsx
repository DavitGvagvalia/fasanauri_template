import type { ReactElement } from "react"

import { useTranslations } from "next-intl"

const OrderFlow = (): ReactElement => {
  const t = useTranslations("OrderFlow")

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold">{t("title")}</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{t("introduction")}</p>
      </div>
      <ol className="space-y-5">
        {(["review", "delivery", "payment", "tracking"] as const).map((step, index) => (
          <li
            key={step}
            className="flex gap-3"
          >
            <span
              aria-hidden="true"
              className="flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold"
            >
              {index + 1}
            </span>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold leading-7">{t(`${step}Title`)}</h3>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {t(`${step}Description`)}
              </p>
              {step === "review" && (
                <p className="mt-2 rounded-lg bg-muted p-3 text-sm leading-6 text-muted-foreground">
                  {t("declinedDescription")}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
      <p className="border-t pt-4 text-xs leading-5 text-muted-foreground">{t("previewNotice")}</p>
    </div>
  )
}

export default OrderFlow
