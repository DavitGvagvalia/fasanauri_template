import type { ReactElement } from "react"

import { SlidersHorizontal } from "lucide-react"
import { useTranslations } from "next-intl"

import { NOTIFICATION_BROWSER_GUIDES } from "@/constants"
import { getNotificationBrowser } from "@/lib/cart/getNotificationBrowser"

const NotificationBrowserHelp = (): ReactElement => {
  const t = useTranslations("PendingOrders")
  const browser = getNotificationBrowser(
    typeof navigator === "undefined" ? "" : navigator.userAgent
  )
  const guide = NOTIFICATION_BROWSER_GUIDES[browser]

  return (
    <div
      role="status"
      className="text-xs leading-5"
    >
      <p className="flex items-center gap-2 font-semibold">
        <SlidersHorizontal
          aria-hidden="true"
          className="size-3.5 shrink-0"
        />
        {t("notificationsBrowserTitle", { browser: t(guide.name) })}
      </p>
      <ol className="mt-2 list-decimal space-y-2 pl-4 text-muted-foreground">
        <li>{t(guide.first)}</li>
        <li>{t(guide.second)}</li>
        <li>{t("notificationsReturnStep")}</li>
      </ol>
    </div>
  )
}

export default NotificationBrowserHelp
