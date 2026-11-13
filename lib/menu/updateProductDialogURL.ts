import type { TServing } from "@/types/menu"

// keeps modal visibility in browser history so back and forward restore product details.
export const updateProductDialogURL = (
  productId: string | null,
  serving: TServing | null = null
): void => {
  const url = new URL(window.location.href)
  if (productId) {
    url.searchParams.set("product", productId)
    if (serving) {
      url.searchParams.set("serving", serving)
    } else {
      url.searchParams.delete("serving")
    }
    window.history.pushState({ productDialog: true }, "", url)

    return
  }
  const state: unknown = window.history.state
  if (
    typeof state === "object" &&
    state !== null &&
    "productDialog" in state &&
    state.productDialog === true
  ) {
    window.history.back()

    return
  }
  url.searchParams.delete("product")
  url.searchParams.delete("serving")
  window.history.replaceState(null, "", url)
}
