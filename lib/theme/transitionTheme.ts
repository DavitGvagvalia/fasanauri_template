let transitionTimer: number | undefined

// applies one color transition policy while preserving normal component motion afterwards.
export const transitionTheme = (apply: () => void): void => {
  const root = document.documentElement
  if (transitionTimer !== undefined) {
    window.clearTimeout(transitionTimer)
  }
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    root.classList.add("theme-changing")
    apply()
    void window.getComputedStyle(document.body).color
    root.classList.remove("theme-changing")

    return
  }
  root.classList.add("theme-changing")
  void window.getComputedStyle(document.body).color
  apply()
  transitionTimer = window.setTimeout(() => {
    root.classList.remove("theme-changing")
    transitionTimer = undefined
  }, 250)
}
