import assert from "node:assert/strict"
import { test } from "node:test"

import { getPhoneMask } from "@/lib/checkout/getPhoneMask"
import { formatPhoneDigits } from "@/lib/checkout/formatPhoneDigits"
import { getPhoneEdit } from "@/lib/checkout/getPhoneEdit"
import { getPhoneDigits } from "@/lib/checkout/getPhoneDigits"

test("Georgian digits replace the mask in fixed groups through every partial entry", () => {
  const digits = "555123456"
  const expected = [
    "XXX XX XX XX",
    "5XX XX XX XX",
    "55X XX XX XX",
    "555 XX XX XX",
    "555 1X XX XX",
    "555 12 XX XX",
    "555 12 3X XX",
    "555 12 34 XX",
    "555 12 34 5X",
    "555 12 34 56",
  ]
  for (let length = 0; length <= digits.length; length++) {
    assert.equal(
      formatPhoneDigits("GE", digits.slice(0, length)) + getPhoneMask("GE", length),
      expected[length]
    )
  }
  assert.equal(formatPhoneDigits("US", "2015550123"), "201 555 0123")
  assert.equal(formatPhoneDigits("RU", "9123456789"), "912 345 67 89")
})

test("phone edits preserve digit positions for insertion, replacement, and separator deletion", () => {
  const edit = { country: "GE" as const, previousDigits: "555123456" }
  assert.deepEqual(
    getPhoneEdit({ ...edit, value: "555 912 34 56", caret: 5, inputType: "insertText" }),
    { digits: "555912345", caret: 5 }
  )
  assert.deepEqual(
    getPhoneEdit({ ...edit, value: "555 98 34 56", caret: 6, inputType: "insertText" }),
    { digits: "555983456", caret: 6 }
  )
  assert.deepEqual(
    getPhoneEdit({ ...edit, value: "55512 34 56", caret: 3, inputType: "deleteContentBackward" }),
    { digits: "55123456", caret: 2 }
  )
  assert.deepEqual(
    getPhoneEdit({ ...edit, value: "55512 34 56", caret: 3, inputType: "deleteContentForward" }),
    { digits: "55523456", caret: 3 }
  )
  assert.deepEqual(
    getPhoneEdit({ ...edit, value: "", caret: 0, inputType: "deleteContentBackward" }),
    { digits: "", caret: 0 }
  )
  assert.deepEqual(
    getPhoneEdit({ ...edit, value: "555 12 34 56", caret: 12, inputType: "insertFromPaste" }),
    { digits: "555123456", caret: 12 }
  )
})

test("phone input accepts exactly one digit per mask position for typing, paste, and country changes", () => {
  for (const [country, limit] of [
    ["GE", 9],
    ["US", 10],
    ["AM", 8],
  ] as const) {
    const full = "5".repeat(limit)
    const edit = {
      country,
      previousDigits: full,
      value: `${full}6`,
      caret: limit + 1,
      inputType: "insertText",
    }
    assert.deepEqual(getPhoneEdit(edit), {
      digits: full,
      caret: formatPhoneDigits(country, full).length,
    })
    assert.equal(getPhoneDigits(country, `${full}123456789`), full)
    assert.equal(getPhoneDigits(country, formatPhoneDigits(country, full)), full)
  }
  assert.equal(getPhoneDigits("GE", "2015550123"), "201555012")
  assert.equal(getPhoneDigits("AM", "555123456"), "55512345")
  assert.equal(formatPhoneDigits("GE", "5551234567"), "555 12 34 56")
  assert.equal(getPhoneDigits("GE", "555 12-34-56789"), "555123456")
  assert.deepEqual(
    getPhoneEdit({
      country: "GE",
      previousDigits: "555123456",
      value: "555 12 34 56789",
      caret: 15,
      inputType: "insertFromPaste",
    }),
    { digits: "555123456", caret: 12 }
  )
})
