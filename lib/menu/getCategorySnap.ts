// finds the retained carousel snap when edge containment merges several slides.
export const getCategorySnap = (registry: number[][], slideIndex: number): number => {
  const snapIndex = registry.findIndex((slides) => slides.includes(slideIndex))

  return Math.max(0, snapIndex)
}
