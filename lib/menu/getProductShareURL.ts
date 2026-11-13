import type { IProduct } from "@/types/menu"
import type { TLocale } from "@/types/locale"

// builds a localized public menu link without carrying checkout or contact parameters.
export const getProductShareURL = (origin: string, locale: TLocale, product: IProduct): string => {
  const url = new URL(`/${locale}`, origin)
  if (product.placeIds[0]) {
    url.searchParams.set("place", product.placeIds[0])
  }
  url.searchParams.set("product", product.id)

  return url.toString()
}
