export interface TypingStats {
  correctChars: number
  wrongChars: number
  extraChars: number
  missingChars: number
  totalTyped: number
  totalErrors: number
  correctWords: number
  wrongWords: number
}
export function analyzeTyping(original: string, typed: string): TypingStats {
  const m = original.length
  const n = typed.length

  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    Array(n + 1).fill(0)
  )

  for (let i = 0; i <= m; i++) dp[i][0] = i
  for (let j = 0; j <= n; j++) dp[0][j] = j

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (original[i - 1] === typed[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1]
      } else {
        dp[i][j] =
          1 +
          Math.min(
            dp[i - 1][j],     // deletion
            dp[i][j - 1],     // insertion
            dp[i - 1][j - 1]  // substitution
          )
      }
    }
  }

  let i = m
  let j = n

  let correct = 0
  let wrong = 0
  let extra = 0
  let missing = 0

  // 🔥 Trace back to classify operations
  while (i > 0 || j > 0) {
    if (
      i > 0 &&
      j > 0 &&
      original[i - 1] === typed[j - 1]
    ) {
      correct++
      i--
      j--
    } else if (
      i > 0 &&
      j > 0 &&
      dp[i][j] === dp[i - 1][j - 1] + 1
    ) {
      wrong++        // substitution
      i--
      j--
    } else if (
      j > 0 &&
      dp[i][j] === dp[i][j - 1] + 1
    ) {
      extra++        // insertion
      j--
    } else {
      missing++      // deletion
      i--
    }
  }

  const totalErrors = wrong + extra + missing

  const originalWords = original.trim().split(/\s+/)
  const typedWords = typed.trim().split(/\s+/)

  let correctWords = 0
  let wrongWords = 0

  originalWords.forEach((word, index) => {
    if (typedWords[index] === word) correctWords++
    else wrongWords++
  })

  return {
    correctChars: correct,
    wrongChars: wrong,
    extraChars: extra,
    missingChars: missing,
    totalTyped: typed.length,
    totalErrors,
    correctWords,
    wrongWords,
  }
}
