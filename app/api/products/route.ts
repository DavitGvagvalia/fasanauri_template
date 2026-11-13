import { getProducts } from "@/lib/menu/getProducts"
import { menuFiltersSchema } from "@/schemas/menuFiltersSchema"

export async function GET(request: Request): Promise<Response> {
  const parsed = menuFiltersSchema.safeParse(Object.fromEntries(new URL(request.url).searchParams))
  if (!parsed.success) {
    return Response.json({ error: "Invalid menu filters" }, { status: 400 })
  }

  return Response.json(await getProducts(parsed.data))
}
