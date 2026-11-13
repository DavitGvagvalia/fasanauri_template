"use client"

import type { ReactElement } from "react"

import StandaloneErrorDocument from "@/components/shared/StandaloneErrorDocument"

const GlobalNotFound = (): ReactElement => {
  return <StandaloneErrorDocument kind="notFound" />
}

export default GlobalNotFound
