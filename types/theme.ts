export type TTheme = "light" | "dark"
export interface IThemeStore {
  theme: TTheme
  setTheme: (theme: TTheme) => void
}
