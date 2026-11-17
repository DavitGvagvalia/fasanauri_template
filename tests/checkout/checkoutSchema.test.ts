import assert from "node:assert/strict"
import { test } from "node:test"
import { checkoutSchema } from "@/schemas/checkoutSchema"

const details = { name: "Demo Guest", phone: "+995 555 123 456", address: "Sample street 12" }

test("checkout trims contact details and accepts Georgian local and international numbers", () => {
  const parsed = checkoutSchema.parse({
    ...details,
    name: "  Demo Guest  ",
    address: "  Sample street 12  ",
  })
  assert.equal(parsed.name, "Demo Guest")
  assert.equal(parsed.address, "Sample street 12")
  for (const phone of ["555123456", "+995 (555) 123-456", "+1 213 373 4253", "+44 20 7946 0018"]) {
    assert.equal(checkoutSchema.safeParse({ ...details, phone }).success, true, phone)
  }
})

test("checkout rejects incomplete, malformed, invalid-country, and embedded phone numbers", () => {
  for (const phone of [
    "",
    "123456",
    "+995 555 12",
    "+995 555 123 4567",
    "+000 555 123 456",
    "+1 111 111 1111",
    "call +995 555 123 456",
    "+995 555 123 456 ext 2",
    "+ - ( )",
  ]) {
    assert.equal(checkoutSchema.safeParse({ ...details, phone }).success, false, phone)
  }
})

test("checkout enforces trimmed name boundaries and rejects missing or oversized addresses", () => {
  for (const name of ["", " ", "A", "  A  ", "A".repeat(101)]) {
    assert.equal(checkoutSchema.safeParse({ ...details, name }).success, false)
  }
  for (const name of ["AB", "A".repeat(100)]) {
    assert.equal(checkoutSchema.safeParse({ ...details, name }).success, true)
  }
  for (const address of ["", "    ", "abc", "A".repeat(301)]) {
    assert.equal(checkoutSchema.safeParse({ ...details, address }).success, false)
  }
})

test("checkout notes are optional, trimmed, and bounded", () => {
  assert.equal(checkoutSchema.parse(details).note, undefined)
  assert.equal(
    checkoutSchema.parse({ ...details, note: "  No cutlery please  " }).note,
    "No cutlery please"
  )
  assert.equal(checkoutSchema.safeParse({ ...details, note: "a".repeat(500) }).success, true)
  assert.equal(checkoutSchema.safeParse({ ...details, note: "a".repeat(501) }).success, false)
  assert.equal(checkoutSchema.safeParse({ ...details, note: 12 }).success, false)
})
