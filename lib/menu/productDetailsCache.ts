import type { IProduct } from "@/types/menu"

// only public multilingual menu records are retained here, never checkout or cart state.
export const productDetailsCache = new Map<string, IProduct>()
