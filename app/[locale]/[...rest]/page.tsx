import { notFound } from "next/navigation"

// this route always throws a 404, so it has no successful UI for instant validation.
export const instant = false

const MissingPage = (): never => {
  notFound()
}

export default MissingPage
