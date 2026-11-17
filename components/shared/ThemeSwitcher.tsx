"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/hooks/useTheme"
import { useTranslations } from "next-intl"
import type { ReactElement } from "react"

import { Button } from "@/components/ui/button"
import { transitionTheme } from "@/lib/theme/transitionTheme"

const ThemeSwitcher = (): ReactElement => {
  const { theme, setTheme } = useTheme()
  const t = useTranslations("Common")

  const toggleTheme = (): void => {
    transitionTheme(() => setTheme(theme === "dark" ? "light" : "dark"))
  }

  return (
    <Button
      variant="secondary"
      size="icon"
      onClick={toggleTheme}
      aria-label={t("toggleTheme")}
      className="size-10 shrink-0"
    >
      <Moon
        className="size-5 dark:hidden"
        aria-hidden
      />
      <Sun
        className="hidden size-5 dark:block"
        aria-hidden
      />
    </Button>
  )
}

export default ThemeSwitcher
