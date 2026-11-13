"use client"

import { useEffect, useState } from "react"

export const useActiveSection = (sectionIds: readonly string[]): string => {
  const [activeSection, setActiveSection] = useState(sectionIds[0] ?? "")
  useEffect(() => {
    let frame: number | null = null
    const update = (): void => {
      frame = null
      let current = sectionIds[0] ?? ""
      for (const id of sectionIds) {
        const section = document.getElementById(id)
        // matches the section anchor offset beneath the sticky header, with a small reading margin.
        if (section && section.getBoundingClientRect().top <= 128) {
          current = id
        }
      }
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
        current = sectionIds[sectionIds.length - 1] ?? current
      }
      setActiveSection(current)
    }
    const scheduleUpdate = (): void => {
      if (frame === null) {
        frame = requestAnimationFrame(update)
      }
    }
    scheduleUpdate()
    window.addEventListener("scroll", scheduleUpdate, { passive: true })
    window.addEventListener("resize", scheduleUpdate)
    window.addEventListener("hashchange", scheduleUpdate)

    return () => {
      if (frame !== null) {
        cancelAnimationFrame(frame)
      }
      window.removeEventListener("scroll", scheduleUpdate)
      window.removeEventListener("resize", scheduleUpdate)
      window.removeEventListener("hashchange", scheduleUpdate)
    }
  }, [sectionIds])

  return activeSection
}
