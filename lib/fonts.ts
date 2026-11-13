import { Inter, Noto_Sans_Georgian } from "next/font/google"

// the normal layout and standalone error documents share one font configuration.
export const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
})
export const notoSansGeorgian = Noto_Sans_Georgian({
  subsets: ["georgian", "latin"],
  variable: "--font-noto-georgian",
  display: "swap",
})
