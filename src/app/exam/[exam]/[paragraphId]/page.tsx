"use client"

import { useEffect, useState } from "react"
import { examParagraphs } from "@/lib/examParagraphs"
import { useParams } from "next/navigation"
import { analyzeTyping } from "@/lib/typingEngine"
import {
    calculateGrossWPM,
    calculateNetWPM,
    calculateAccuracy,
} from "@/lib/calculate"

interface Result {
    gross: number
    net: number
    accuracy: number
    totalErrors: number
    passed: boolean
}

export default function ExamTypingPage() {
    const params = useParams()
    const { exam, paragraphId } = params as {
        exam: string
        paragraphId: string
    }

    const paragraph = examParagraphs.find(
        (p) => p.exam === exam && p.id === paragraphId
    )

    if (!paragraph) {
        return <div className="p-6">Exam not found.</div>
    }

    const [timeLeft, setTimeLeft] = useState(paragraph.duration * 60)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [input, setInput] = useState("")
    const [result, setResult] = useState<Result | null>(null)

    // ---------------- Timer (Auto Start) ----------------
    useEffect(() => {
        if (isSubmitted) return

        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval)
                    handleSubmit()
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(interval)
    }, [isSubmitted])

    // ---------------- Updated Calculation (Same as Practice) ----------------
    const calculateResult = (): Result => {
        const stats = analyzeTyping(paragraph.text, input)

        const minutesTaken =
            (paragraph.duration * 60 - timeLeft) / 60 || paragraph.duration

        const gross = calculateGrossWPM(
            stats.totalTyped,
            minutesTaken
        )

        const net = calculateNetWPM(
            gross,
            stats.totalErrors,
            minutesTaken
        )

        const accuracy = calculateAccuracy(
            stats.correctChars,
            stats.totalTyped
        )

        const passed =
            net >= paragraph.passingWpm &&
            accuracy >= paragraph.passingAccuracy

        return {
            gross,
            net,
            accuracy,
            totalErrors: stats.totalErrors,
            passed,
        }
    }

    const handleSubmit = () => {
        if (isSubmitted) return
        const finalResult = calculateResult()
        setResult(finalResult)
        setIsSubmitted(true)
    }

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60)
        const s = seconds % 60
        return `${m}:${s.toString().padStart(2, "0")}`
    }

    // ---------------- UI ----------------
    return (
        <div className="max-w-3xl mx-auto p-6 space-y-6">
            {/* Timer + Early Submit */}
            {!isSubmitted && (
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">
                        Time Left: {formatTime(timeLeft)}
                    </h2>

                    <button
                        onClick={() => {
                            if (confirm("Submit exam early?")) {
                                handleSubmit()
                            }
                        }}
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Submit Exam
                    </button>
                </div>
            )}

            {/* Paragraph */}
            <div className="border p-4 bg-gray-100 rounded">
                {paragraph.text}
            </div>

            {/* Typing Area */}
            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isSubmitted}
                className="w-full border p-3 rounded h-40"
            />

            {/* Result */}
            {isSubmitted && result && (
                <div className="border p-6 rounded shadow bg-white space-y-3">
                    <h2
                        className={`text-2xl font-bold ${result.passed ? "text-green-600" : "text-red-600"
                            }`}
                    >
                        {result.passed ? "PASS" : "FAIL"}
                    </h2>

                    <p>Gross WPM: {result.gross.toFixed(2)}</p>
                    <p>Net WPM: {result.net.toFixed(2)}</p>
                    <p>Accuracy: {result.accuracy.toFixed(2)}%</p>
                    <p>Total Errors: {result.totalErrors}</p>
                </div>
            )}
        </div>
    )
}
