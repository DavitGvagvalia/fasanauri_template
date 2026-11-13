"use client"
import { useState } from "react"
import { useStore } from "zustand"
import { getThemeStore } from "@/lib/theme/getThemeStore"
import type { IThemeStore } from "@/types/theme"

export const useTheme = (): IThemeStore => {
  const [store] = useState(getThemeStore)
  const theme = useStore(store, (state) => state.theme)
  const setTheme = useStore(store, (state) => state.setTheme)

  return { theme, setTheme }
}
