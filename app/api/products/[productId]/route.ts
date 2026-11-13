import { PLACEHOLDER_PRODUCTS } from "@/lib/menu/placeholderProducts"

export async function GET(
  _request: Request,
  context: RouteContext<"/api/products/[productId]">
): Promise<Response> {
  const { productId } = await context.params
  // public fixture identity lookup keeps deep links independent of the current menu page or filters.
  const product = PLACEHOLDER_PRODUCTS.find((item) => item.id === productId)
  if (!product) {
    return Response.json({ error: "Product not found" }, { status: 404 })
  }

  return Response.json(product)
}
