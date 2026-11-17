import assert from "node:assert/strict"
import { test } from "node:test"
import { createTranslator } from "next-intl"

import { LOCALES, NOTIFICATION_BROWSER_GUIDES } from "@/constants"
import { getLocaleMessages } from "@/lib/i18n/getLocaleMessages"

test("client and server message registry resolves product fallback and share actions in every locale", () => {
  for (const locale of LOCALES) {
    const messages = getLocaleMessages(locale)
    const t = createTranslator({
      locale,
      messages,
      onError: (error) => {
        throw error
      },
    })
    for (const key of [
      "Menu.descriptionFallback",
      "Menu.productUnavailable",
      "Menu.productUnavailableDescription",
      "Share.facebookTooltip",
      "Share.twitterTooltip",
      "Share.pinterestTooltip",
      "Share.linkedinTooltip",
      "Share.copy",
      "Share.close",
      "Common.toggleTheme",
      "Checkout.namePlaceholder",
      "Checkout.summary",
      "Errors.back",
      "Checkout.addressPlaceholder",
      "Checkout.phoneCountry",
      "Information.gallery",
      "Information.facilitiesPlaceholder",
      "Places.loading",
      "Menu.addToCart",
      "Menu.updateOrder",
      "Cart.updated",
      "Menu.removeFromOrder",
      "Cart.title",
      "PendingOrders.confirmationRequired",
      "PendingOrders.orderRequiresConfirmation",
      "PendingOrders.history",
      "PendingOrders.delivered",
      "PendingOrders.onTheWay",
      "PendingOrders.onTheWayDescription",
      "PendingOrders.orderWasDeclined",
      "PendingOrders.deliveryCostPending",
      "PendingOrders.enableNotifications",
      "PendingOrders.notificationPrompt",
      "PendingOrders.notificationsDeclined",
      "PendingOrders.notificationsDeclinedShort",
      "PendingOrders.notificationsDontShowAgain",
      "PendingOrders.collapseNotice",
      "PendingOrders.notificationPromptShort",
      "PendingOrders.askNotificationsAgain",
      "PendingOrders.notificationsNotNow",
      "PendingOrders.notificationsSettings",
      "PendingOrders.notificationsUnsupported",
      "Checkout.note",
      "Checkout.noteError",
      "PendingOrders.soon",
      "PendingOrders.estimatedArrival",
    ] as const) {
      const translation = t(key)
      assert.ok(translation.trim().length > 0)
      assert.notEqual(translation, key)
    }
    assert.notEqual(
      messages.Menu.descriptionFallback,
      getLocaleMessages(locale === "en" ? "ka" : "en").Menu.descriptionFallback
    )
    assert.ok(t("Menu.unitPrice", { price: "24.99 ₾" }).includes("24.99 ₾"))
    assert.ok(t("PendingOrders.expandNotice", { label: "Order 1" }).includes("Order 1"))
    assert.ok(
      t("PendingOrders.confirmationPosition", { current: 1, total: 2, count: 1 }).includes("1/2")
    )
    for (const guide of Object.values(NOTIFICATION_BROWSER_GUIDES)) {
      assert.ok(t(`PendingOrders.${guide.first}`).trim().length > 0)
      assert.ok(t(`PendingOrders.${guide.second}`).trim().length > 0)
      assert.ok(
        t("PendingOrders.notificationsBrowserTitle", {
          browser: t(`PendingOrders.${guide.name}`),
        }).trim().length > 0
      )
    }
    assert.ok(t("PendingOrders.notificationsReturnStep").trim().length > 0)
    assert.ok(t("PendingOrders.notificationsBrowserHelp").trim().length > 0)
  }
})
