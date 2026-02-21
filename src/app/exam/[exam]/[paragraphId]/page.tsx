"use client"

import { useEffect, useState } from "react"
import { examParagraphs } from "@/lib/examParagraphs"
import { useParams, useRouter } from "next/navigation"
import {
    calculateGrossWPM,
    calculateNetWPM,
    calculateAccuracy,
} from "@/lib/calculate"

// ─────────────────────────────────────────────────────────────────────────────
// SCORING ENGINE
// ─────────────────────────────────────────────────────────────────────────────
export type ErrorCategory = "general" | "obc_ews" | "sc_st"

// ── Exam-specific allowed error % per category ────────────────────────────────
// SSC CGL  : General 5% (Steno) / 20% (DEST) | OBC/EWS 25% | SC/ST 30%
// SSC CHSL : General 7%                        | OBC/EWS 10% | SC/ST 10%
// RRB NTPC : All categories 5% (flat, no category split)
const EXAM_ERROR_CONFIG: Record<
    string,
    { label: string; categories: { value: ErrorCategory; label: string; allowed: number }[] }
> = {
    "ssc_cgl": {
        label: "SSC CGL",
        categories: [
            { value: "general", label: "General / UR (20%)", allowed: 20 },
            { value: "obc_ews", label: "OBC / EWS (25%)", allowed: 25 },
            { value: "sc_st", label: "SC / ST (30%)", allowed: 30 },
        ],
    },
    "ssc_chsl": {
        label: "SSC CHSL",
        categories: [
            { value: "general", label: "General / UR (7%)", allowed: 7 },
            { value: "obc_ews", label: "OBC / EWS (10%)", allowed: 10 },
            { value: "sc_st", label: "SC / ST (10%)", allowed: 10 },
        ],
    },
    "rrb_ntpc": {
        label: "RRB NTPC",
        categories: [
            { value: "general", label: "All Categories (5%)", allowed: 5 },
        ],
    },
}

// Fallback for any other exam key
const DEFAULT_EXAM_CONFIG = {
    label: "Exam",
    categories: [
        { value: "general" as ErrorCategory, label: "General (20%)", allowed: 20 },
        { value: "obc_ews" as ErrorCategory, label: "OBC / EWS (25%)", allowed: 25 },
        { value: "sc_st" as ErrorCategory, label: "SC / ST (30%)", allowed: 30 },
    ],
}

export interface WordResult {
    original: string
    typed: string | null
    status:
    | "correct"
    | "substitution"
    | "omission"
    | "addition"
    | "incomplete"
    | "wrong_case"
    | "punctuation_error"
    | "transposition"
    mistakeValue: number
}

export interface ExamResult {
    wordResults: WordResult[]
    fullMistakes: number
    halfMistakes: number
    totalErrors: number
    grossWPM: number
    netWPM: number
    accuracy: number
    totalTypedChars: number
    correctWords: number
    totalOriginalWords: number
    spacingErrors: number
    passed: boolean
    errorPercent: number
    allowedErrorPercent: number
}

function stripPunctuation(word: string): string {
    return word.replace(/[^a-zA-Z0-9]/g, "")
}

function tokenizeWords(text: string): string[] {
    return text.trim().split(/\s+/).filter(Boolean)
}

function countSpacingErrors(original: string, typed: string): number {
    const origSpaces = original.match(/\s+/g) || []
    const typedSpaces = typed.match(/\s+/g) || []
    let errors = 0
    typedSpaces.forEach((sp, i) => {
        const orig = origSpaces[i] || " "
        if (sp.length !== orig.length) errors++
    })
    return errors
}

function isTransposition(
    origWords: string[], typedWords: string[],
    origIdx: number, typedIdx: number
): boolean {
    const a = origWords[origIdx]?.toLowerCase()
    const b = origWords[origIdx + 1]?.toLowerCase()
    const ta = typedWords[typedIdx]?.toLowerCase()
    const tb = typedWords[typedIdx + 1]?.toLowerCase()
    return a !== undefined && b !== undefined && ta === b && tb === a
}

export function analyzeExam(
    original: string, typed: string,
    minutesTaken: number, allowedErrorPercent: number = 20
): ExamResult {
    const origWords = tokenizeWords(original)
    const typedWords = tokenizeWords(typed)
    const totalOriginalWords = origWords.length
    const totalTypedChars = typed.length

    const wordResults: WordResult[] = []
    let fullMistakes = 0
    let halfMistakes = 0
    let correctWords = 0
    let typedIdx = 0

    for (let origIdx = 0; origIdx < origWords.length; origIdx++) {
        const origWord = origWords[origIdx]
        const typedWord = typedWords[typedIdx]

        if (typedWord === undefined) {
            wordResults.push({ original: origWord, typed: null, status: "omission", mistakeValue: 1 })
            fullMistakes++
            continue
        }

        const origLower = origWord.toLowerCase()
        const typedLower = typedWord.toLowerCase()
        const origStripped = stripPunctuation(origWord).toLowerCase()
        const typedStripped = stripPunctuation(typedWord).toLowerCase()

        if (origWord === typedWord) {
            wordResults.push({ original: origWord, typed: typedWord, status: "correct", mistakeValue: 0 })
            correctWords++
            typedIdx++
            continue
        }

        if (isTransposition(origWords, typedWords, origIdx, typedIdx)) {
            wordResults.push({ original: origWord, typed: typedWord, status: "transposition", mistakeValue: 0.5 })
            halfMistakes++
            typedIdx++
            origIdx++
            wordResults.push({ original: origWords[origIdx], typed: typedWords[typedIdx], status: "transposition", mistakeValue: 0 })
            typedIdx++
            continue
        }

        if (origLower === typedLower && origStripped === typedStripped) {
            wordResults.push({ original: origWord, typed: typedWord, status: "wrong_case", mistakeValue: 0.5 })
            halfMistakes++
            typedIdx++
            continue
        }

        if (origStripped === typedStripped && origLower !== typedLower) {
            wordResults.push({ original: origWord, typed: typedWord, status: "punctuation_error", mistakeValue: 0.5 })
            halfMistakes++
            typedIdx++
            continue
        }

        if (origLower.startsWith(typedLower) && typedLower.length < origLower.length) {
            wordResults.push({ original: origWord, typed: typedWord, status: "incomplete", mistakeValue: 1 })
            fullMistakes++
            typedIdx++
            continue
        }

        const nextOrigWord = origWords[origIdx + 1]
        if (nextOrigWord && (
            nextOrigWord === typedWord ||
            nextOrigWord.toLowerCase() === typedLower ||
            stripPunctuation(nextOrigWord).toLowerCase() === typedStripped
        )) {
            wordResults.push({ original: origWord, typed: null, status: "omission", mistakeValue: 1 })
            fullMistakes++
            continue
        }

        const nextTypedWord = typedWords[typedIdx + 1]
        if (nextTypedWord && (
            nextTypedWord === origWord ||
            nextTypedWord.toLowerCase() === origLower ||
            stripPunctuation(nextTypedWord).toLowerCase() === origStripped
        )) {
            wordResults.push({ original: origWord, typed: typedWord, status: "addition", mistakeValue: 1 })
            fullMistakes++
            typedIdx++
            origIdx--
            typedIdx++
            continue
        }

        wordResults.push({ original: origWord, typed: typedWord, status: "substitution", mistakeValue: 1 })
        fullMistakes++
        typedIdx++
    }

    while (typedIdx < typedWords.length) {
        wordResults.push({ original: "", typed: typedWords[typedIdx], status: "addition", mistakeValue: 1 })
        fullMistakes++
        typedIdx++
    }

    const spacingErrors = countSpacingErrors(original, typed)
    halfMistakes += spacingErrors

    const totalErrors = fullMistakes + halfMistakes * 0.5
    const grossWPM = calculateGrossWPM(totalTypedChars, minutesTaken)
    const netWPM = calculateNetWPM(grossWPM, totalErrors, minutesTaken)
    const accuracy = totalOriginalWords > 0 ? (correctWords / totalOriginalWords) * 100 : 0
    const errorPercent = totalOriginalWords > 0 ? (totalErrors / totalOriginalWords) * 100 : 0
    const passed = errorPercent <= allowedErrorPercent

    return {
        wordResults, fullMistakes, halfMistakes, totalErrors,
        grossWPM, netWPM, accuracy, totalTypedChars,
        correctWords, totalOriginalWords, spacingErrors,
        passed, errorPercent, allowedErrorPercent,
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// STATUS LABELS & COLORS
// ─────────────────────────────────────────────────────────────────────────────
const STATUS_LABEL: Record<string, string> = {
    correct: "Correct",
    substitution: "Spelling Error",
    omission: "Word Omitted",
    addition: "Extra Word",
    incomplete: "Incomplete Word",
    wrong_case: "Wrong Capitalization",
    punctuation_error: "Punctuation Error",
    transposition: "Transposition",
}

const STATUS_COLOR: Record<string, string> = {
    correct: "text-green-700 bg-green-50",
    substitution: "text-red-700 bg-red-50",
    omission: "text-orange-700 bg-orange-50",
    addition: "text-purple-700 bg-purple-50",
    incomplete: "text-red-600 bg-red-50",
    wrong_case: "text-yellow-700 bg-yellow-50",
    punctuation_error: "text-yellow-700 bg-yellow-50",
    transposition: "text-blue-700 bg-blue-50",
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function ExamTypingPage() {
    const params = useParams()
    const router = useRouter()
    const { exam, paragraphId } = params as { exam: string; paragraphId: string }

    const paragraph = examParagraphs.find(
        (p) => p.exam === exam && p.id === paragraphId
    )

    if (!paragraph) {
        return <div className="p-6 text-red-600">Exam paragraph not found.</div>
    }

    const [timeLeft, setTimeLeft] = useState(paragraph.duration * 60)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [input, setInput] = useState("")
    const [result, setResult] = useState<ExamResult | null>(null)

    // Resolve exam config from URL param (e.g. "ssc-cgl", "ssc-chsl", "rrb-ntpc")
    const examKey = exam.toLowerCase()
    const examConfig = EXAM_ERROR_CONFIG[examKey] ?? DEFAULT_EXAM_CONFIG
    const [selectedCategoryIdx, setSelectedCategoryIdx] = useState(0)
    const selectedCategory = examConfig.categories[selectedCategoryIdx]

    // ── Timer ──────────────────────────────────────────────────────────────────
    useEffect(() => {
        if (isSubmitted) return
        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval)
                    triggerSubmit()
                    return 0
                }
                return prev - 1
            })
        }, 1000)
        return () => clearInterval(interval)
    }, [isSubmitted])

    const triggerSubmit = () => {
        if (isSubmitted) return
        const minutesTaken = (paragraph.duration * 60 - timeLeft) / 60 || paragraph.duration
        const res = analyzeExam(paragraph.text, input, minutesTaken, selectedCategory.allowed)
        setResult(res)
        setIsSubmitted(true)
    }

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60)
        const s = seconds % 60
        return `${m}:${s.toString().padStart(2, "0")}`
    }

    // ── TYPING UI (matches screenshot) ─────────────────────────────────────────
    if (!isSubmitted) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-100">

                {/* ── Top bar: SSC exam header ─────────────────────────────────── */}
                <div className="bg-[#1a1a2e] text-white text-sm px-6 py-2 flex items-center gap-3">
                    <span className="font-semibold tracking-wide">{exam.toUpperCase()} Typing Test</span>
                    <span className="text-gray-400">|</span>
                    <span className="text-gray-300">Keyboard Layout: QWERTY</span>
                    <span className="text-gray-400">|</span>
                    <span className="text-gray-300">Language: English</span>
                </div>

                {/* ── Sub-header: Group / Section / Timer ──────────────────────── */}
                <div className="bg-white border-b px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {/* Group badge */}
                        <span className="bg-[#4caf50] text-white text-xs font-bold px-3 py-1.5 rounded">
                            Group A
                        </span>
                        <div className="text-sm text-gray-600">
                            Sections
                        </div>
                        <span className="bg-[#4caf50] text-white text-xs font-semibold px-3 py-1.5 rounded">
                            Section A
                        </span>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Category selector — options driven by exam type */}
                        <select
                            value={selectedCategoryIdx}
                            onChange={(e) => setSelectedCategoryIdx(Number(e.target.value))}
                            className="border rounded px-3 py-1.5 text-sm text-gray-700"
                        >
                            {examConfig.categories.map((cat, idx) => (
                                <option key={cat.value} value={idx}>{cat.label}</option>
                            ))}
                        </select>

                        {/* Timer */}
                        <div className="text-base font-semibold text-gray-800">
                            Time Left:&nbsp;
                            <span className={timeLeft <= 60 ? "text-red-600" : "text-gray-900"}>
                                {formatTime(timeLeft)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* ── Main content area ─────────────────────────────────────────── */}
                <div className="flex-1 px-6 py-6 flex flex-col gap-5 max-w-4xl mx-auto w-full">

                    {/* Passage box */}
                    <div
                        className="bg-white border border-gray-300 rounded p-6
                            font-serif text-[1.05rem] leading-8 text-gray-900
                            max-h-72 overflow-y-auto select-none
                            shadow-sm"
                        style={{ textAlign: "justify" }}
                    >
                        {paragraph.text}
                    </div>

                    {/* Typing box */}
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Start typing here to begin the test..."
                        autoFocus
                        className="bg-white border-2 border-blue-400 rounded p-4
                            font-mono text-base text-gray-900 leading-7
                            resize-none h-52 w-full
                            focus:outline-none focus:border-blue-500
                            shadow-sm placeholder:text-gray-400"
                    />
                </div>

                {/* ── Bottom bar: Cancel + Submit ───────────────────────────────── */}
                <div className="bg-white border-t px-6 py-3 flex justify-end gap-3">
                    <button
                        onClick={() => router.back()}
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            if (confirm("Submit exam?")) triggerSubmit()
                        }}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded transition-colors"
                    >
                        Submit
                    </button>
                </div>
            </div>
        )
    }

    // ── RESULT UI ──────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-gray-100">

            {/* Top bar */}
            <div className="bg-[#1a1a2e] text-white text-sm px-6 py-2">
                <span className="font-semibold tracking-wide">{exam.toUpperCase()} Typing Test — Results</span>
            </div>

            <div className="max-w-4xl mx-auto p-6 space-y-6">

                {/* Pass / Fail */}
                {result && (
                    <>
                        <div className={`p-5 rounded-lg border-2 ${result.passed
                            ? "bg-green-50 border-green-400 text-green-800"
                            : "bg-red-50 border-red-400 text-red-800"}`}>
                            <div className="text-2xl font-bold mb-1">
                                {result.passed ? "✅ PASS" : "❌ FAIL"}
                            </div>
                            <p className="text-sm">
                                Error rate: <strong>{result.errorPercent.toFixed(2)}%</strong> —
                                Allowed: <strong>{result.allowedErrorPercent}%</strong> ({selectedCategory.label})
                            </p>
                        </div>

                        {/* Stats grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {[
                                { label: "Gross WPM", value: result.grossWPM.toFixed(2) },
                                { label: "Net WPM", value: result.netWPM.toFixed(2) },
                                { label: "Accuracy", value: `${result.accuracy.toFixed(2)}%` },
                                { label: "Total Error Score", value: result.totalErrors.toFixed(1) },
                                { label: "Full Mistakes", value: result.fullMistakes },
                                { label: "Half Mistakes", value: result.halfMistakes },
                                { label: "Spacing Errors", value: result.spacingErrors },
                                { label: "Correct Words", value: `${result.correctWords} / ${result.totalOriginalWords}` },
                            ].map(({ label, value }) => (
                                <div key={label} className="bg-white border rounded p-3 text-sm shadow-sm">
                                    <div className="text-gray-400 text-xs mb-1">{label}</div>
                                    <div className="font-semibold text-gray-900">{value}</div>
                                </div>
                            ))}
                        </div>

                        {/* Word review table */}
                        <div>
                            <h3 className="font-semibold mb-3 text-gray-800">Word-by-Word Review</h3>
                            <div className="bg-white border rounded overflow-hidden shadow-sm text-sm">
                                <table className="w-full">
                                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase border-b">
                                        <tr>
                                            <th className="text-left p-3 w-8">#</th>
                                            <th className="text-left p-3">Original</th>
                                            <th className="text-left p-3">You Typed</th>
                                            <th className="text-left p-3">Error Type</th>
                                            <th className="text-left p-3">Penalty</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {result.wordResults.map((wr, idx) => (
                                            <tr key={idx} className={`border-t ${wr.status === "correct" ? "" : "bg-red-50/30"}`}>
                                                <td className="p-3 text-gray-400 text-xs">{idx + 1}</td>
                                                <td className="p-3 font-mono text-gray-800">{wr.original || <span className="italic text-gray-400">—</span>}</td>
                                                <td className="p-3 font-mono text-gray-700">{wr.typed ?? <span className="italic text-gray-400">not typed</span>}</td>
                                                <td className="p-3">
                                                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLOR[wr.status]}`}>
                                                        {STATUS_LABEL[wr.status]}
                                                    </span>
                                                </td>
                                                <td className="p-3 font-mono text-xs text-gray-600">
                                                    {wr.mistakeValue === 0 ? "—" : wr.mistakeValue === 0.5 ? "½" : "1"}
                                                </td>
                                            </tr>
                                        ))}
                                        {result.spacingErrors > 0 && (
                                            <tr className="border-t bg-yellow-50/40">
                                                <td className="p-3" colSpan={3}></td>
                                                <td className="p-3 text-xs text-yellow-700">
                                                    {result.spacingErrors} spacing error{result.spacingErrors > 1 ? "s" : ""} (½ each)
                                                </td>
                                                <td className="p-3 font-mono text-xs text-yellow-700">
                                                    +{(result.spacingErrors * 0.5).toFixed(1)}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Error rules legend */}
                        <div className="bg-white border rounded p-4 text-sm shadow-sm">
                            <h4 className="font-semibold mb-3 text-gray-800">Error Rules Applied</h4>
                            <div className="grid sm:grid-cols-2 gap-4 text-gray-700">
                                <div>
                                    <div className="font-medium text-gray-900 text-xs uppercase tracking-wide mb-2">Full Mistakes (1 each)</div>
                                    <div className="space-y-1">
                                        <div>• Omission of a word</div>
                                        <div>• Substitution / spelling error</div>
                                        <div>• Addition of extra word</div>
                                        <div>• Incomplete word</div>
                                    </div>
                                </div>
                                <div>
                                    <div className="font-medium text-gray-900 text-xs uppercase tracking-wide mb-2">Half Mistakes (0.5 each)</div>
                                    <div className="space-y-1">
                                        <div>• Spacing error</div>
                                        <div>• Wrong capitalization</div>
                                        <div>• Punctuation error</div>
                                        <div>• Transposition of words</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}