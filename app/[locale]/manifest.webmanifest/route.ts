import { hasLocale } from "next-intl"
import { getTranslations } from "next-intl/server"

import { routing } from "@/i18n/routing"
import { createAppManifest } from "@/lib/pwa/createAppManifest"

export const GET = async (
  _request: Request,
  { params }: RouteContext<"/[locale]/manifest.webmanifest">
): Promise<Response> => {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    return new Response(null, { status: 404 })
  }
  const t = await getTranslations({ locale })

  return Response.json(createAppManifest(locale, t("Common.brand"), t("Metadata.description")), {
    headers: { "Content-Type": "application/manifest+json" },
  })
}
