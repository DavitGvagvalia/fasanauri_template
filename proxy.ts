import createMiddleware from "next-intl/middleware"
import { NextResponse } from "next/server"

import { routing } from "@/i18n/routing"
import { getMenuPlaceRedirect } from "@/lib/menu/getMenuPlaceRedirect"
import type { NextRequest } from "next/server"

const handleLocaleRouting = createMiddleware(routing)

const proxy = (request: NextRequest): NextResponse => {
  const response = handleLocaleRouting(request)
  const location = response.headers.get("location")
  const destination = getMenuPlaceRedirect(new URL(location ?? request.url, request.url))
  if (!destination) {
    return response
  }
  if (location) {
    // Extend locale negotiation's redirect instead of introducing another redirect hop.
    response.headers.set("location", destination.href)

    return response
  }

  return NextResponse.redirect(destination)
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
}

export default proxy
