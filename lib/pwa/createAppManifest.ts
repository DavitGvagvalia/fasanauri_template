import type { MetadataRoute } from "next"

import { PWA_BACKGROUND_COLOR, PWA_THEME_COLORS } from "@/constants"
import type { TLocale } from "@/types/locale"

export const createAppManifest = (
  locale: TLocale,
  name: string,
  description: string
): MetadataRoute.Manifest => {
  return {
    id: "/",
    name,
    short_name: name,
    description,
    lang: locale,
    start_url: `/${locale}`,
    scope: "/",
    display: "standalone",
    background_color: PWA_BACKGROUND_COLOR,
    theme_color: PWA_THEME_COLORS.light,
    categories: ["food", "shopping"],
    icons: [
      { src: "/icons/app-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/app-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      {
        src: "/icons/app-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  }
}
