import type { ReactElement } from "react"
import { useTranslations } from "next-intl"

import { LEGAL_SECTIONS } from "@/constants"
import LegalTableOfContents from "@/components/shared/LegalTableOfContents"

interface IProps {
  kind: "terms" | "privacy"
}

const LegalContent = ({ kind }: IProps): ReactElement => {
  const t = useTranslations("Information")

  return (
    <main
      id="main-content"
      className="site-container py-10"
    >
      <div className="grid items-start gap-8 md:grid-cols-[12rem_minmax(0,1fr)] lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_minmax(0,1fr)]">
        <aside className="md:sticky md:top-28 md:max-h-[calc(100svh-8rem)] md:overflow-y-auto">
          <h1 className="mb-10 text-3xl font-semibold wrap-break-word">{t(kind)}</h1>
          <LegalTableOfContents />
        </aside>
        <article className="w-full max-w-3xl space-y-12 lg:col-start-2 lg:justify-self-center">
          {LEGAL_SECTIONS.map((section) => (
            <section
              id={section}
              key={section}
              className="scroll-mt-28 space-y-5"
            >
              <h2 className="text-xl font-semibold">{t(section)}</h2>
              {[0, 1, 2].map((paragraph) => (
                <p
                  key={paragraph}
                  className="leading-8 text-muted-foreground"
                >
                  {t("placeholder")}
                </p>
              ))}
            </section>
          ))}
        </article>
      </div>
    </main>
  )
}

export default LegalContent
