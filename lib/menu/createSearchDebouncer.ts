import { SEARCH_DEBOUNCE_MS } from "@/constants"
import type { ISearchDebouncer } from "@/types/menu"

export const createSearchDebouncer = (commit: (value: string) => void): ISearchDebouncer => {
  let timer: ReturnType<typeof setTimeout> | null = null
  const cancel = (): void => {
    if (timer !== null) {
      clearTimeout(timer)
      timer = null
    }
  }
  const schedule = (value: string): void => {
    cancel()
    timer = setTimeout(() => {
      timer = null
      commit(value)
    }, SEARCH_DEBOUNCE_MS)
  }
  const flush = (value: string): void => {
    cancel()
    commit(value)
  }

  return { schedule, flush, cancel }
}
