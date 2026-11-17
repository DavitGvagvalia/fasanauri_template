"use client"

import { Search, X } from "lucide-react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useMenuSearch } from "@/hooks/useMenuSearch"
import type { ReactElement } from "react"

const MenuSearch = (): ReactElement => {
  const t = useTranslations("Menu")
  const { value, handleChange, handleSubmit, clear } = useMenuSearch()

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className="relative mt-2 w-full max-w-md"
    >
      <Button
        type="submit"
        variant="ghost"
        size="icon"
        aria-label={t("search")}
        className="absolute top-1 left-1 z-10"
      >
        <Search aria-hidden />
      </Button>
      <Input
        type="search"
        value={value}
        onChange={handleChange}
        maxLength={100}
        aria-label={t("search")}
        placeholder={t("searchPlaceholder")}
        className="h-10 bg-background pr-12 pl-10 focus:border-search-focus focus-visible:border-search-focus focus-visible:shadow-none focus-visible:ring-0 focus-visible:outline-none"
      />
      {value && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={clear}
          aria-label={t("clearSearch")}
          className="absolute top-1 right-1"
        >
          <X aria-hidden />
        </Button>
      )}
    </form>
  )
}

export default MenuSearch
