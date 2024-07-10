export default class ColorHandler {
  // Helper function to hash a string into a number
  private static hashStringToNumber(seed: string): number {
    let hash = 0
    for (let i = 0; i < seed.length; i++) {
      const char = seed.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash |= 0 // Convert to 32-bit integer
    }
    return Math.abs(hash)
  }

  // Pseudo-random number generator using seed
  private static seededRandom(seed: number): () => number {
    return () => {
      seed = (seed * 9301 + 49297) % 233280
      return seed / 233280
    }
  }

  // Convert HSL to hex color
  static hslToHex(h: number, s: number, l: number): string {
    l /= 100
    const a = (s * Math.min(l, 1 - l)) / 100
    const f = (n: number) => {
      const k = (n + h / 30) % 12
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
      return Math.round(255 * color)
        .toString(16)
        .padStart(2, '0') // Convert to hex and pad
    }
    return `#${f(0)}${f(8)}${f(4)}`
  }

  // Generate a pastel color from a seed
  static generatePastelColor(seed: string): string {
    const hash = ColorHandler.hashStringToNumber(seed)
    const random = ColorHandler.seededRandom(hash)

    const h = 100 + Math.floor(random() * 220)
    const s = 35
    const l = 60

    return ColorHandler.hslToHex(h, s, l)
  }
}
