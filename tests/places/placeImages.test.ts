import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import { resolve } from "node:path"
import { test } from "node:test"

import { PLACES } from "@/constants"

test("every branch placeholder resolves to a published WebP image", async () => {
  for (const imageURL of new Set(PLACES.map((place) => place.imageURL))) {
    const image = await readFile(resolve("public", imageURL.slice(1)))
    assert.equal(image.toString("ascii", 0, 4), "RIFF")
    assert.equal(image.toString("ascii", 8, 12), "WEBP")
    assert.ok(image.length > 12)
  }
})
