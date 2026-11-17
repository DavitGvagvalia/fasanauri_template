export const goBackFromError = (): boolean => {
  if (window.history.length > 1) {
    window.history.back()

    return true
  }

  return false
}
