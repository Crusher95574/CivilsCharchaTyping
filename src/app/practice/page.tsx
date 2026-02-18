"use client"

import { useState } from "react"
import { analyzeTyping } from "@/lib/typingEngine"
import {
    calculateGrossWPM,
    calculateNetWPM,
    calculateAccuracy,
} from "@/lib/calculate"
import Timer from "@/components/Timer"
import TypingBox from "@/components/TypingBox"
import ResultCard from "@/components/ResultCard"

const paragraph =
    "The quick brown fox jumps over the lazy dog. This is a professional typing simulation test."

export default function PracticePage() {
    const [typedText, setTypedText] = useState("")
    const [time, setTime] = useState(60)
    const [result, setResult] = useState<any>(null)

    const [liveStats, setLiveStats] = useState<any>(null)
    const [backspaceCount, setBackspaceCount] = useState(0)

    const minutesElapsed = (60 - time) / 60 || 1 / 60

    const grossWPM = liveStats
        ? calculateGrossWPM(liveStats.totalTyped, minutesElapsed)
        : 0

    const cpm = liveStats
        ? liveStats.totalTyped / minutesElapsed
        : 0

    const accuracy = liveStats
        ? calculateAccuracy(
            liveStats.correctChars,
            liveStats.totalTyped
        )
        : 0

    const progress =
        (typedText.length / paragraph.length) * 100

    const finishTest = () => {
        const stats = analyzeTyping(paragraph, typedText)
        const minutes = 1

        const gross = calculateGrossWPM(stats.totalTyped, minutes)
        const net = calculateNetWPM(gross, stats.totalErrors, minutes)
        const finalAccuracy = calculateAccuracy(
            stats.correctChars,
            stats.totalTyped
        )

        setResult({
            gross,
            net,
            accuracy: finalAccuracy,
            backspaceCount,
            ...stats,
        })
    }

    return (
        <div className="space-y-6">

            <h1 className="text-2xl font-bold">Practice Mode</h1>

            {!result && (
                <>
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-300 rounded h-3">
                        <div
                            className="bg-green-500 h-3 rounded"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    {/* Live Stats */}
                    <div className="flex flex-wrap gap-6 text-lg font-semibold">
                        {/* <div>Time: {time}s</div> */}
                        <div>WPM: {grossWPM.toFixed(2)}</div>
                        <div>CPM: {cpm.toFixed(0)}</div>
                        <div>Accuracy: {accuracy.toFixed(2)}%</div>
                        <div>Backspaces: {backspaceCount}</div>
                    </div>

                    <Timer
                        time={time}
                        setTime={setTime}
                        onTimeUp={finishTest}
                    />

                    <TypingBox
                        originalText={paragraph}
                        typedText={typedText}
                        setTypedText={setTypedText}
                        setLiveStats={setLiveStats}
                        backspaceCount={backspaceCount}
                        setBackspaceCount={setBackspaceCount}
                    />

                    <button
                        onClick={finishTest}
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Submit
                    </button>
                </>
            )}

            {result && <ResultCard result={result} />}
        </div>
    )
}
