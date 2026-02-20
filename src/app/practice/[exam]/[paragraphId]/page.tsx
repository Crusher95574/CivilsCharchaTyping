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

    if (!examKey || !(examKey in examConfig)) {
        return <div className="p-6 text-red-500 font-semibold">Invalid Practice Link</div>
    }

    const exam = examConfig[examKey]
    const paragraphData = paragraphs.find((p) => p.id === paragraphId)

    if (!paragraphData) {
        return <div className="p-6 text-red-500 font-semibold">Paragraph Not Found</div>
    }

    const paragraph = paragraphData.text
    const [typedText, setTypedText] = useState("")
    const [time, setTime] = useState(exam.duration)
    const [result, setResult] = useState<any>(null)
    const [liveStats, setLiveStats] = useState<any>(null)
    const [backspaceCount, setBackspaceCount] = useState(0)

    const minutesElapsed = (exam.duration - time) / 60 || 1 / 60
    const grossWPM = liveStats ? calculateGrossWPM(liveStats.totalTyped, minutesElapsed) : 0
    const accuracy = liveStats ? calculateAccuracy(liveStats.correctChars, liveStats.totalTyped) : 0
    const progress = (typedText.length / paragraph.length) * 100

    const finishTest = () => {
        const stats = analyzeTyping(paragraph, typedText)
        const minutesTaken = (exam.duration - time) / 60 || 1 / 60
        const gross = calculateGrossWPM(stats.totalTyped, minutesTaken)
        const net = calculateNetWPM(gross, stats.totalErrors, minutesTaken)
        const finalAccuracy = calculateAccuracy(stats.correctChars, stats.totalTyped)

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
        <div className="space-y-8 max-w-5xl mx-auto p-6">
            {/* Header with exam logo */}
            <div className="flex items-center gap-4 mb-6">
                {exam.logo ? (
                    <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-blue-500 flex items-center justify-center bg-gray-100">
                        <img
                            src={exam.logo}
                            alt={`${exam.name} Logo`}
                            className="w-16 h-16 object-contain"
                        />
                    </div>
                ) : (
                    <div className="w-20 h-20 rounded-full border-4 border-blue-500 bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-xl">
                        {exam.name[0].toUpperCase()}
                    </div>
                )}

                <h1 className="text-3xl font-bold">{exam.name} Practice</h1>
            </div>


            {!result && (
                <>
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-4">
                        <div
                            className="bg-green-500 h-4 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    {/* Live Stats */}
                    <div className="flex flex-wrap gap-6 text-lg font-medium mt-2">
                        <div className="bg-gray-100 px-4 py-2 rounded shadow">WPM: {grossWPM.toFixed(2)}</div>
                        <div className="bg-gray-100 px-4 py-2 rounded shadow">Accuracy: {accuracy.toFixed(2)}%</div>
                        <div className="bg-gray-100 px-4 py-2 rounded shadow">Backspaces: {backspaceCount}</div>
                        <div className="bg-gray-100 px-4 py-2 rounded shadow">Errors: {liveStats?.totalErrors || 0}</div>
                    </div>

                    {/* Timer */}
                    <Timer
                        time={time}
                        setTime={setTime}
                        onTimeUp={finishTest}
                    />

                    {/* Typing Box */}
                    <TypingBox
                        originalText={paragraph}
                        typedText={typedText}
                        setTypedText={setTypedText}
                        setLiveStats={setLiveStats}
                        backspaceCount={backspaceCount}
                        setBackspaceCount={setBackspaceCount}
                        backspaceAllowed={exam.backspaceAllowed}
                    />

                    {/* Submit Button */}
                    <div className="mt-4">
                        <button
                            onClick={finishTest}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                        >
                            Submit
                        </button>
                    </div>
                </>
            )}

            {result && <ResultCard result={result} />}
        </div>
    )
}
