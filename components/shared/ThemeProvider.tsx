"use client"
import { useEffect } from "react"
import type { ReactElement, ReactNode } from "react"
import { useTheme } from "@/hooks/useTheme"

interface IProps {
  children: ReactNode
}

const ThemeProvider = ({ children }: IProps): ReactElement => {
  const { setTheme } = useTheme()
  useEffect(() => {
    let saved: string | null = null
    try {
      saved = localStorage.getItem("theme")
    } catch {
      /* uses the light default when storage is unavailable. */
    }
    setTheme(saved === "dark" ? "dark" : "light")
    const synchronize = (event: StorageEvent): void => {
      if (event.key === "theme") {
        setTheme(event.newValue === "dark" ? "dark" : "light")
      }
    }
    window.addEventListener("storage", synchronize)

    return () => window.removeEventListener("storage", synchronize)
  }, [setTheme])

  return <>{children}</>
}

export default ThemeProvider
