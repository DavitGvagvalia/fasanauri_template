import "server-only"

import placeholderFood from "@/assets/images/placeholder_food.webp"
import { ECategory } from "@/constants"
import type { ICategory } from "@/types/menu"

// category order follows the supplied reference screenshots, products remain placeholder data.
export const PLACEHOLDER_CATEGORIES: ICategory[] = [
  {
    id: ECategory.ColdDishes,
    title: { ka: "ცივი კერძები", en: "Cold dishes", ru: "Холодные блюда" },
  },
  { id: ECategory.Salads, title: { ka: "სალათები", en: "Salads", ru: "Салаты" } },
  { id: ECategory.Soups, title: { ka: "წვნიანი კერძები", en: "Soups", ru: "Супы" } },
  {
    id: ECategory.Grill,
    title: { ka: "მწვადი/ქაბაბი", en: "Mtsvadi / kebab", ru: "Шашлык / кебаб" },
  },
  {
    id: ECategory.HotDishes,
    title: { ka: "ცხელი კერძები", en: "Hot dishes", ru: "Горячие блюда" },
  },
  { id: ECategory.Khinkali, title: { ka: "ხინკალი", en: "Khinkali", ru: "Хинкали" } },
  { id: ECategory.Bakery, title: { ka: "ცომეული", en: "Bakery", ru: "Выпечка" } },
  {
    id: ECategory.BeerSnacks,
    title: {
      ka: "ლუდზე მისაყოლებელი",
      en: "Beer snacks",
      ru: "Закуски к пиву",
    },
  },
  { id: ECategory.Sauces, title: { ka: "სოუსები", en: "Sauces", ru: "Соусы" } },
  { id: ECategory.Desserts, title: { ka: "დესერტი", en: "Dessert", ru: "Десерт" } },
  {
    id: ECategory.SoftDrinks,
    title: { ka: "ცივი სასმელები", en: "Cold drinks", ru: "Холодные напитки" },
  },
  {
    id: ECategory.HotDrinks,
    title: { ka: "ცხელი სასმელები", en: "Hot drinks", ru: "Горячие напитки" },
  },
  { id: ECategory.Beer, title: { ka: "ლუდი", en: "Beer", ru: "Пиво" } },
  {
    id: ECategory.ShumiWine,
    title: {
      ka: "შუმი - ქართული ღვინო",
      en: "Shumi  Georgian wine",
      ru: "Шуми  грузинское вино",
    },
  },
  {
    id: ECategory.MatrobelaWine,
    title: {
      ka: "მათრობელა ღვინო",
      en: "Matrobela wine",
      ru: "Вино Матробела",
    },
  },
  {
    id: ECategory.VodkaChacha,
    title: { ka: "არაყი | ჭაჭა", en: "Vodka | Chacha", ru: "Водка | Чача" },
  },
  {
    id: ECategory.Spirits,
    title: {
      ka: "ალკოჰოლური სასმელები",
      en: "Alcoholic drinks",
      ru: "Алкогольные напитки",
    },
  },
  {
    id: ECategory.VillaMosavali,
    title: { ka: "ვილა მოსავალი", en: "Villa Mosavali", ru: "Вилла Мосавали" },
  },
].map((category) => ({ ...category, imageURL: placeholderFood.src }))
