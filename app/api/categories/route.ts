import { getCategories } from "@/lib/menu/getCategories"

export async function GET(): Promise<Response> {
  return Response.json(await getCategories())
}
