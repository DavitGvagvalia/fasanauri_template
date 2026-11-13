export type TCategoryScrollDirection = "left" | "right"

export interface IHorizontalBounds {
  left: number
  right: number
}

export interface ICategoryScrollMeasurements {
  viewport: IHorizontalBounds
  slides: readonly IHorizontalBounds[]
  position: number
  target: number
  min: number
  max: number
  useTarget: boolean
}
