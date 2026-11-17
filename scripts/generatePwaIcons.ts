import { mkdir, readFile, writeFile } from "node:fs/promises"
import sharp from "sharp"

import { PWA_THEME_COLORS } from "@/constants"

const generatePwaIcons = async (): Promise<void> => {
  const source = await readFile("app/icon.svg", "utf8")
  const artwork = source.replace(/<style>[\s\S]*?<\/style>/, "").replace(/<\/?svg[^>]*>/g, "")
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" fill="${PWA_THEME_COLORS.dark}"/><g fill="#fafafa" transform="translate(88 88) scale(${336 / 188.07})">${artwork}</g></svg>`
  await mkdir("public/icons", { recursive: true })
  for (const [filename, size] of [
    ["app-192.png", 192],
    ["app-512.png", 512],
    ["app-maskable-512.png", 512],
    ["apple-touch-icon.png", 180],
  ] as const) {
    await sharp(Buffer.from(svg)).resize(size, size).png().toFile(`public/icons/${filename}`)
  }
  const favicon = await sharp(Buffer.from(svg)).resize(48, 48).png().toBuffer()
  const header = Buffer.alloc(22)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(1, 4)
  header[6] = 48
  header[7] = 48
  header.writeUInt16LE(1, 10)
  header.writeUInt16LE(32, 12)
  header.writeUInt32LE(favicon.length, 14)
  header.writeUInt32LE(header.length, 18)
  await writeFile("app/favicon.ico", Buffer.concat([header, favicon]))
}

void generatePwaIcons()
