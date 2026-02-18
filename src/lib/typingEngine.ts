export interface TypingStats {
  correctChars: number
  wrongChars: number
  extraChars: number
  missingChars: number
  totalTyped: number
  totalErrors: number
}

export function analyzeTyping(original: string, typed: string): TypingStats {
  let correct = 0
  let wrong = 0
  let extra = 0
  let missing = 0

  const maxLength = Math.max(original.length, typed.length)

  for (let i = 0; i < maxLength; i++) {
    const o = original[i]
    const t = typed[i]

    if (o && t) {
      if (o === t) correct++
      else wrong++
    } else if (!o && t) {
      extra++
    } else if (o && !t) {
      missing++
    }
  }

  return {
    correctChars: correct,
    wrongChars: wrong,
    extraChars: extra,
    missingChars: missing,
    totalTyped: typed.length,
    totalErrors: wrong + extra + missing,
  }
}
