export const playOrderAlertSound = (context: AudioContext): void => {
  if (context.state !== "running") {
    return
  }
  for (const [index, frequency] of [660, 880].entries()) {
    const start = context.currentTime + index * 0.18
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    oscillator.frequency.value = frequency
    gain.gain.setValueAtTime(0, start)
    gain.gain.linearRampToValueAtTime(0.12, start + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.16)
    oscillator.connect(gain)
    gain.connect(context.destination)
    oscillator.start(start)
    oscillator.stop(start + 0.18)
    oscillator.onended = (): void => {
      oscillator.disconnect()
      gain.disconnect()
    }
  }
}
