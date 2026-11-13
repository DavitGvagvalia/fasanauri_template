"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { createSearchDebouncer } from "@/lib/menu/createSearchDebouncer"
import { updateMenuFilters } from "@/lib/menu/updateMenuFilters"
import type { ChangeEvent, FormEvent } from "react"

interface IUseMenuSearchReturn {
  value: string
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void
  clear: () => void
}

export const useMenuSearch = (): IUseMenuSearchReturn => {
  const params = useSearchParams()
  const committed = params.get("search") ?? ""
  const [draft, setDraft] = useState({ source: committed, value: committed })
  if (draft.source !== committed) {
    // sync URL navigation before painting without moving focus out of the input.
    setDraft({ source: committed, value: committed })
  }
  const debouncer = useMemo(
    () => createSearchDebouncer((search) => updateMenuFilters({ search })),
    []
  )
  const value = draft.source === committed ? draft.value : committed
  useEffect(() => {
    if (value === committed) {
      return
    }
    debouncer.schedule(value)

    return debouncer.cancel
  }, [value, committed, debouncer])
  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setDraft({ source: committed, value: event.target.value })
  }
  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    debouncer.flush(value)
  }
  const clear = (): void => {
    setDraft({ source: committed, value: "" })
    debouncer.flush("")
  }

  return { value, handleChange, handleSubmit, clear }
}
