import assert from "node:assert/strict"
import { test } from "node:test"
import { createTranslator } from "next-intl"

import { LOCALES } from "@/constants"
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
      "Checkout.addressPlaceholder",
      "Checkout.phoneCountry",
      "Information.gallery",
      "Information.facilitiesPlaceholder",
      "Places.loading",
    ] as const) {
      const translation = t(key)
      assert.ok(translation.trim().length > 0)
      assert.notEqual(translation, key)
    }
    assert.notEqual(
      messages.Menu.descriptionFallback,
      getLocaleMessages(locale === "en" ? "ka" : "en").Menu.descriptionFallback
    )
  }
})
