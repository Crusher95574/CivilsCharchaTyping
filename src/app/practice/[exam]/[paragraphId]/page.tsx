"use client"

import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { examConfig, ExamType } from "@/lib/examConfig"
import { paragraphs } from "@/lib/paragraphs"
import { analyzeTyping } from "@/lib/typingEngine"
import {
    calculateGrossWPM,
    calculateNetWPM,
    calculateAccuracy,
} from "@/lib/calculate"
import { useRouter } from "next/navigation"
import ResultCard from "@/components/ResultCard"
import TypingBox from "@/components/TypingBox"

export default function PracticeTypingPage() {
    const params = useParams()
    const router = useRouter()
    const examKey = params.exam as ExamType
    const paragraphId = Number(params.paragraphId)

    if (!examKey || !(examKey in examConfig)) {
        return <div className="p-6 text-red-500 font-semibold">Invalid Practice Link</div>
    }

    const exam = examConfig[examKey]
    const paragraphData = paragraphs.find((p) => p.id === paragraphId && p.type === exam.paragraphType)

    if (!paragraphData) {
        return <div className="p-6 text-red-500 font-semibold">Paragraph Not Found</div>
    }

    const paragraph = paragraphData.text

    const [typedText, setTypedText] = useState("")
    const [timeLeft, setTimeLeft] = useState(exam.duration)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [result, setResult] = useState<any>(null)
    const [liveStats, setLiveStats] = useState<any>(null)
    const [backspaceCount, setBackspaceCount] = useState(0)
    // ── Live stats calculation ─────────────────────────────────────────────────
    const minutesElapsed = (exam.duration - timeLeft) / 60 || 1 / 60
    const grossWPM = liveStats ? calculateGrossWPM(liveStats.totalTyped, minutesElapsed) : 0
    const accuracy = liveStats ? calculateAccuracy(liveStats.correctChars, liveStats.totalTyped) : 0
    const progress = Math.min((typedText.length / paragraph.length) * 100, 100)

    // ── Timer ──────────────────────────────────────────────────────────────────
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

    // ── Submit ─────────────────────────────────────────────────────────────────
    const handleSubmit = () => {
        if (isSubmitted) return
        const stats = analyzeTyping(paragraph, typedText)
        const minutesTaken = (exam.duration - timeLeft) / 60 || 1 / 60
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
        setIsSubmitted(true)
    }

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60)
        const s = seconds % 60
        return `${m}:${s.toString().padStart(2, "0")}`
    }

    // ── RESULT VIEW ────────────────────────────────────────────────────────────
    if (isSubmitted && result) {
        return (
            <div className="min-h-screen bg-gray-100">
                <div className="bg-[#1a1a2e] text-white text-sm px-6 py-2">
                    <span className="font-semibold tracking-wide">{exam.name} — Practice Results</span>
                </div>
                <div className="max-w-4xl mx-auto p-6">
                    <ResultCard result={result} />
                </div>
            </div>
        )
    }

    // ── TYPING VIEW ────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen flex flex-col bg-gray-100">

            {/* ── Top bar ──────────────────────────────────────────────────────── */}
            <div className="bg-[#1a1a2e] text-white text-sm px-6 py-2 flex items-center gap-3">
                {/* Exam logo / initial */}
                {exam.logo ? (
                    <img src={exam.logo} alt={exam.name} className="w-6 h-6 object-contain rounded" />
                ) : (
                    <span className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold">
                        {exam.name[0]}
                    </span>
                )}
                <span className="font-semibold tracking-wide">{exam.name} Practice Test</span>
                <span className="text-gray-400">|</span>
                <span className="text-gray-300">Keyboard Layout: QWERTY</span>
                <span className="text-gray-400">|</span>
                <span className="text-gray-300">Language: English</span>
            </div>

            {/* ── Sub-header: badges + live stats + timer ───────────────────────── */}
            <div className="bg-white border-b px-6 py-3 flex items-center justify-between flex-wrap gap-3">
                {/* Left: group/section badges */}
                <div className="flex items-center gap-3">
                    <span className="bg-[#4caf50] text-white text-xs font-bold px-3 py-1.5 rounded">
                        Practice
                    </span>
                    <span className="text-sm text-gray-500">Mode</span>
                    <span className="bg-[#4caf50] text-white text-xs font-semibold px-3 py-1.5 rounded">
                        {exam.name}
                    </span>
                </div>

                {/* Right: live stats + timer */}
                <div className="flex items-center gap-4 text-sm font-medium text-gray-700 flex-wrap">
                    <div className="bg-gray-100 px-3 py-1.5 rounded shadow-sm">
                        WPM: <span className="font-bold text-blue-600">{grossWPM.toFixed(1)}</span>
                    </div>
                    <div className="bg-gray-100 px-3 py-1.5 rounded shadow-sm">
                        Accuracy: <span className="font-bold text-green-600">{accuracy.toFixed(1)}%</span>
                    </div>
                    <div className="bg-gray-100 px-3 py-1.5 rounded shadow-sm">
                        Errors: <span className="font-bold text-red-500">{liveStats?.totalErrors || 0}</span>
                    </div>
                    {exam.backspaceAllowed && (
                        <div className="bg-gray-100 px-3 py-1.5 rounded shadow-sm">
                            ⌫ <span className="font-bold">{backspaceCount}</span>
                        </div>
                    )}
                    <div className="bg-gray-100 px-3 py-1.5 rounded shadow-sm">
                        Time: <span className={`font-bold ${timeLeft <= 60 ? "text-red-600" : "text-gray-800"}`}>
                            {formatTime(timeLeft)}
                        </span>
                    </div>
                </div>
            </div>

            {/* ── Progress bar ─────────────────────────────────────────────────── */}
            <div className="w-full bg-gray-200 h-1.5">
                <div
                    className="bg-green-500 h-1.5 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* ── Main content ─────────────────────────────────────────────────── */}
            <div className="flex-1 px-6 py-6 flex flex-col gap-5 max-w-4xl mx-auto w-full">

                {/* TypingBox: highlighted paragraph + textarea */}
                <TypingBox
                    originalText={paragraph}
                    typedText={typedText}
                    setTypedText={setTypedText}
                    setLiveStats={setLiveStats}
                    backspaceCount={backspaceCount}
                    setBackspaceCount={setBackspaceCount}
                    backspaceAllowed={exam.backspaceAllowed}
                />
            </div>

            {/* ── Bottom bar: Cancel + Submit ───────────────────────────────────── */}
            <div className="bg-white border-t px-6 py-3 flex justify-end gap-3">
                <button
                    onClick={() => router.back()}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded transition-colors"
                >
                    Cancel
                </button>
                <button
                    onClick={() => {
                        if (confirm("Submit practice test?")) handleSubmit()
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded transition-colors"
                >
                    Submit
                </button>
            </div>
        </div>
    )
}