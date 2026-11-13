"use client"

import type { ReactElement } from "react"
import { useTranslations } from "next-intl"

import { LEGAL_SECTIONS } from "@/constants"
import { useActiveSection } from "@/hooks/useActiveSection"
import { cn } from "@/lib/utils"

const LegalTableOfContents = (): ReactElement => {
  const t = useTranslations("Information")
  const activeSection = useActiveSection(LEGAL_SECTIONS)

  return (
    <nav aria-label={t("contents")}>
      <h2 className="mb-4 font-semibold">{t("contents")}</h2>
      <ul className="space-y-2">
        {LEGAL_SECTIONS.map((section) => (
          <li key={section}>
            <a
              href={`#${section}`}
              aria-current={activeSection === section ? "location" : undefined}
              className={cn(
                "block w-fit rounded-md px-3 py-2 text-sm transition-colors duration-200 focus-visible:outline-2 motion-reduce:transition-none",
                activeSection === section
                  ? "bg-category-selected font-medium text-primary-foreground hover:bg-category-selected-hover"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {t(section)}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default LegalTableOfContents
