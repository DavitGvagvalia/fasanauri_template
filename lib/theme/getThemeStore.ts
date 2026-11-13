"use client"
import type { StoreApi } from "zustand/vanilla"
import { createThemeStore } from "@/lib/theme/createThemeStore"
import type { IThemeStore } from "@/types/theme"

let browserThemeStore: StoreApi<IThemeStore> | undefined

// isolates server snapshots while sharing appearance between browser consumers.
export const getThemeStore = (): StoreApi<IThemeStore> => {
  if (typeof window === "undefined") {
    return createThemeStore()
  }
  browserThemeStore ??= createThemeStore()

  return browserThemeStore
}
