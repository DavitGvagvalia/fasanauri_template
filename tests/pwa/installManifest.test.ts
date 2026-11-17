import assert from "node:assert/strict"
import { test } from "node:test"
import sharp from "sharp"

import { LOCALES } from "@/constants"
import { getLocaleMessages } from "@/lib/i18n/getLocaleMessages"
import { createAppManifest } from "@/lib/pwa/createAppManifest"

test("localized installs share one identity and keep locale routes inside the standalone app", () => {
  for (const locale of LOCALES) {
    const messages = getLocaleMessages(locale)
    const manifest = createAppManifest(locale, messages.Common.brand, messages.Metadata.description)
    assert.equal(manifest.id, "/")
    assert.equal(manifest.scope, "/")
    assert.equal(manifest.start_url, `/${locale}`)
    assert.equal(manifest.lang, locale)
    assert.equal(manifest.name, messages.Common.brand)
    assert.equal(manifest.display, "standalone")
    const origin = "https://restaurant.example"
    for (const targetLocale of LOCALES) {
      assert.ok(
        new URL(`/${targetLocale}/checkout`, origin).href.startsWith(
          new URL(manifest.scope, origin).href
        )
      )
    }
  }
})

test("install icons have declared dimensions and an opaque mask safe logo", async () => {
  for (const [file, size] of [
    ["app-192.png", 192],
    ["app-512.png", 512],
    ["app-maskable-512.png", 512],
    ["apple-touch-icon.png", 180],
  ] as const) {
    const metadata = await sharp(`public/icons/${file}`).metadata()
    assert.equal(metadata.format, "png")
    assert.equal(metadata.width, size)
    assert.equal(metadata.height, size)
  }
  const { data, info } = await sharp("public/icons/app-maskable-512.png")
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  for (let offset = 0; offset < data.length; offset += info.channels) {
    assert.equal(data[offset + 3], 255)
    if (data[offset] > 200) {
      const pixel = offset / info.channels
      const x = (pixel % info.width) - info.width / 2
      const y = Math.floor(pixel / info.width) - info.height / 2
      assert.ok(Math.hypot(x, y) < info.width * 0.4)
    }
  }
})
