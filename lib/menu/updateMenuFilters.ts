import type { IMenuFilters } from "@/types/menu"

export const updateMenuFilters = (
  changes: Partial<Pick<IMenuFilters, "category" | "search" | "place">>,
  mode: "push" | "replace" = "replace"
): void => {
  const next = new URLSearchParams(window.location.search)
  for (const [key, value] of Object.entries(changes)) {
    if (value) {
      next.set(key, value)
    } else {
      next.delete(key)
    }
  }
  if (next.toString() === new URLSearchParams(window.location.search).toString()) {
    return
  }
  next.delete("cursor")
  const url = `${window.location.pathname}${next.size ? `?${next}` : ""}`
  if (mode === "push") {
    window.history.pushState(null, "", url)
  } else {
    window.history.replaceState(null, "", url)
  }
  window.scrollTo({ top: 0, behavior: "instant" })
}
