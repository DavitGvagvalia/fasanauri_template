import { PWA_THEME_COLORS } from "@/constants"
import type { TTheme } from "@/types/theme"

export const updateAppThemeColor = (theme: TTheme): void => {
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", PWA_THEME_COLORS[theme])
}
