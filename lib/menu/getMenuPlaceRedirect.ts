import { DEFAULT_PLACE, LOCALES, PLACE_IDS } from "@/constants"

// adds a valid branch to menu entry URLs while retaining existing filters.
export const getMenuPlaceRedirect = (url: URL): URL | null => {
  const pathname = url.pathname.endsWith("/") ? url.pathname.slice(0, -1) : url.pathname
  const isMenu = pathname === "" || LOCALES.some((locale) => pathname === `/${locale}`)
  const place = url.searchParams.get("place")
  if (!isMenu || PLACE_IDS.some((placeId) => placeId === place)) {
    return null
  }

  const destination = new URL(url.href)
  destination.searchParams.set("place", DEFAULT_PLACE)

  return destination
}
