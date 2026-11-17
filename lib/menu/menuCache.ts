"use client"

import type { ICategory, IMenuPage } from "@/types/menu"

// public fixture data includes every translation, so locale navigation can reuse it safely.
export const menuCache = {
  categories: null as ICategory[] | null,
  pages: new Map<string, IMenuPage>(),
  snapshots: new Map<string, IMenuPage>(),
}
