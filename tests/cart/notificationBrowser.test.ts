import assert from "node:assert/strict"
import { test } from "node:test"

import { getNotificationBrowser } from "@/lib/cart/getNotificationBrowser"

test("notification instructions distinguish browser brands before shared engine tokens", () => {
  assert.equal(getNotificationBrowser("Mozilla/5.0 Gecko/20100101 Firefox/144.0"), "firefox")
  assert.equal(getNotificationBrowser("Mozilla/5.0 Chrome/142.0 Safari/537.36 Edg/142.0"), "edge")
  assert.equal(getNotificationBrowser("Mozilla/5.0 Chrome/142.0 Safari/537.36"), "chrome")
  assert.equal(getNotificationBrowser("Mozilla/5.0 Version/26.0 Safari/605.1.15"), "safari")
  assert.equal(getNotificationBrowser("Mozilla/5.0 FxiOS/144.0 Safari/605.1.15"), "firefox")
  assert.equal(getNotificationBrowser("Mozilla/5.0 EdgiOS/142.0 Safari/605.1.15"), "edge")
  assert.equal(getNotificationBrowser("Mozilla/5.0 CriOS/142.0 Safari/605.1.15"), "chrome")
})

test("unknown browsers retain generic instructions instead of inheriting incorrect Chrome controls", () => {
  assert.equal(getNotificationBrowser("Mozilla/5.0 Chrome/142.0 Safari/537.36 OPR/120.0"), "other")
  assert.equal(getNotificationBrowser("Mozilla/5.0 SamsungBrowser/28.0 Chrome/142.0"), "other")
  assert.equal(getNotificationBrowser("Mozilla/5.0 Chrome/142.0 Vivaldi/7.0"), "other")
  assert.equal(getNotificationBrowser(""), "other")
})
