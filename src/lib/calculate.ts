export function calculateGrossWPM(totalChars: number, minutes: number) {
  return (totalChars / 5) / minutes
}

export function calculateNetWPM(gross: number, errors: number, minutes: number) {
  return gross - errors / minutes
}

export function calculateAccuracy(correct: number, total: number) {
  if (total === 0) return 0
  return (correct / total) * 100
}
