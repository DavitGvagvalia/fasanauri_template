import { ECategory } from "@/constants"

export const getMenuCategory = (value: string | null): ECategory => {
  return Object.values(ECategory).find((category) => category === value) ?? ECategory.All
}
