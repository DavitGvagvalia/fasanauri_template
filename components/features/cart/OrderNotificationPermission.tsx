"use client"

import type { ReactElement } from "react"
import { useRef } from "react"

import { Bell } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import NotificationBrowserHelp from "@/components/features/cart/NotificationBrowserHelp"
import { useNotificationPermission } from "@/hooks/useNotificationPermission"
import { cn } from "@/lib/utils"
import NoticeCollapseButton from "@/components/features/cart/NoticeCollapseButton"
import NotificationPermissionArrow from "@/components/features/cart/NotificationPermissionArrow"

interface IProps {
  prompt?: boolean
  floating?: boolean
  onCollapse?: () => void
}

const OrderNotificationPermission = ({
  prompt = false,
  floating = false,
  onCollapse,
}: IProps): ReactElement | null => {
  const t = useTranslations("PendingOrders")
  const common = useTranslations("Common")
  const dialogRef = useRef<HTMLDivElement>(null)
  const {
    permission,
    declined,
    requesting,
    retryBlocked,
    enableNotifications,
    declineNotifications,
    dismissHelp,
    reminderHidden,
    hideReminder,
  } = useNotificationPermission()

  const handleHelpOpenChange = (open: boolean): void => {
    if (!open) {
      dismissHelp()
    }
  }

  if (permission === "granted" || reminderHidden) {
    return null
  }
  if (permission === "unsupported") {
    return prompt ? (
      <p className="text-sm text-muted-foreground">{t("notificationsUnsupported")}</p>
    ) : null
  }

  return (
    <>
      <section
        aria-label={t("enableNotifications")}
        className={cn(
          "relative rounded-lg border bg-popover p-3 text-left text-popover-foreground shadow-lg",
          floating && "flex h-full flex-col justify-between gap-0.5 p-2.5"
        )}
      >
        {(prompt || declined || floating) && (
          <p
            aria-live="polite"
            className={cn(
              floating ? "text-[11px] leading-4" : "mb-3 text-xs leading-5",
              onCollapse && "pr-6"
            )}
          >
            {t(
              floating
                ? declined
                  ? "notificationsDeclinedShort"
                  : "notificationPromptShort"
                : declined
                  ? "notificationsDeclined"
                  : "notificationPrompt"
            )}
          </p>
        )}
        <div className={cn("flex flex-wrap gap-2", floating && declined && "flex-nowrap gap-1")}>
          <Button
            onClick={enableNotifications}
            disabled={requesting}
            className={cn(
              "h-auto min-h-8 flex-1",
              floating
                ? "gap-1 rounded-md whitespace-nowrap px-1.5 py-1 text-[11px]"
                : "whitespace-normal text-xs"
            )}
          >
            <Bell aria-hidden="true" />
            {t(declined ? "askNotificationsAgain" : "enableNotifications")}
          </Button>
          {declined && (
            <Button
              variant="ghost"
              onClick={hideReminder}
              className={cn(
                "h-auto min-h-8 font-normal",
                floating ? "rounded-md whitespace-nowrap px-1.5 py-1 text-[11px]" : "text-xs"
              )}
            >
              {t("notificationsDontShowAgain")}
            </Button>
          )}
          {prompt && !declined && (
            <Button
              variant="outline"
              onClick={declineNotifications}
              className="h-auto min-h-8 text-xs"
            >
              {t("notificationsNotNow")}
            </Button>
          )}
        </div>
        {onCollapse && <NoticeCollapseButton onCollapse={onCollapse} />}
        {retryBlocked && !floating && (
          <div className="mt-3">
            <NotificationBrowserHelp />
          </div>
        )}
      </section>
      {floating && (
        <Dialog
          open={retryBlocked}
          onOpenChange={handleHelpOpenChange}
        >
          <DialogContent
            ref={dialogRef}
            showCloseButton={false}
            overlayClassName="z-70"
            className="z-70 max-h-[75dvh] overflow-y-auto rounded-lg"
          >
            <DialogTitle className="sr-only">{t("notificationsBrowserHelp")}</DialogTitle>
            <DialogDescription className="sr-only">{t("notificationsSettings")}</DialogDescription>
            <NotificationBrowserHelp />
            {retryBlocked && <NotificationPermissionArrow dialogRef={dialogRef} />}
            <Button
              variant="outline"
              onClick={dismissHelp}
            >
              {common("close")}
            </Button>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}

export default OrderNotificationPermission
