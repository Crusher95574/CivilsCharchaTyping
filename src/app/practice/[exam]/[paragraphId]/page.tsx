"use client"

import { useParams } from "next/navigation"
import { useState } from "react"
import { examConfig, ExamType } from "@/lib/examConfig"
import { paragraphs } from "@/lib/paragraphs"
import { analyzeTyping } from "@/lib/typingEngine"
import {
    calculateGrossWPM,
    calculateNetWPM,
    calculateAccuracy,
} from "@/lib/calculate"
import Timer from "@/components/Timer"
import TypingBox from "@/components/TypingBox"
import ResultCard from "@/components/ResultCard"

export default function PracticeTypingPage() {
    const params = useParams()

    const examKey = params.exam as ExamType
    const paragraphId = Number(params.paragraphId)

    // ✅ Validate exam safely
    if (!examKey || !(examKey in examConfig)) {
        return <div className="p-6">Invalid Practice Link</div>
    }

    const exam = examConfig[examKey]

    const paragraphData = paragraphs.find(
        (p) => p.id === paragraphId
    )

    if (!paragraphData) {
        return <div className="p-6">Paragraph Not Found</div>
    }

    const paragraph = paragraphData.text

    const [typedText, setTypedText] = useState("")
    const [time, setTime] = useState(exam.duration)
    const [result, setResult] = useState<any>(null)
    const [liveStats, setLiveStats] = useState<any>(null)
    const [backspaceCount, setBackspaceCount] = useState(0)

    // ✅ Live Calculations
    const minutesElapsed =
        (exam.duration - time) / 60 || 1 / 60

    const grossWPM = liveStats
        ? calculateGrossWPM(liveStats.totalTyped, minutesElapsed)
        : 0

    const accuracy = liveStats
        ? calculateAccuracy(
            liveStats.correctChars,
            liveStats.totalTyped
        )
        : 0

    const progress =
        (typedText.length / paragraph.length) * 100

    // ✅ Finish Test (Final Calculation)
    const finishTest = () => {
        const stats = analyzeTyping(paragraph, typedText)

        const minutesTaken =
            (exam.duration - time) / 60 || 1 / 60

        const gross = calculateGrossWPM(
            stats.totalTyped,
            minutesTaken
        )

        const net = calculateNetWPM(
            gross,
            stats.totalErrors,
            minutesTaken
        )

        const finalAccuracy = calculateAccuracy(
            stats.correctChars,
            stats.totalTyped
        )

        setResult({
            grossWPM: gross,
            netWPM: net,
            accuracy: finalAccuracy,
            backspaceCount,
            originalText: paragraph,
            typedText,
            totalErrors: stats.totalErrors,
            correctChars: stats.correctChars,
            totalTyped: stats.totalTyped,
        })
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto p-6">
            <h1 className="text-2xl font-bold">
                {exam.name} Practice
            </h1>

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
                    <div className="flex gap-6 text-lg font-semibold">
                        <div>WPM: {grossWPM.toFixed(2)}</div>
                        <div>Accuracy: {accuracy.toFixed(2)}%</div>
                        <div>Backspaces: {backspaceCount}</div>
                        <div>Errors: {liveStats?.totalErrors || 0}</div>
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
                        backspaceAllowed={exam.backspaceAllowed}
                    />

                    <button
                        onClick={finishTest}
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Submit
                    </button>
                </>
            )}

            {result && (
                <ResultCard
                    result={result}
                />
            )}
        </div>
    )
}
