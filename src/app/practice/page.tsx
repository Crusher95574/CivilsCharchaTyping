"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { examConfig, ExamType } from "@/lib/examConfig"
import { paragraphs } from "@/lib/paragraphs"

type View = "examList" | "paragraphList" | "overview"


export default function PracticePage() {
    const router = useRouter()

    const [view, setView] = useState<View>("examList")
    const [selectedExamKey, setSelectedExamKey] = useState<ExamType | null>(null)
    const [selectedParagraphId, setSelectedParagraphId] = useState<number | null>(null)

    const selectedExam = selectedExamKey ? examConfig[selectedExamKey] : null

    // STEP 3 → Overview Screen
    if (view === "overview" && selectedExam && selectedParagraphId !== null) {
        return (
            <div className="max-w-4xl mx-auto p-6 space-y-6">
                <div className="flex items-center gap-4">
                    {selectedExam.logo ? (
                        <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-blue-500 flex items-center justify-center bg-gray-100">
                            <img
                                src={selectedExam.logo}
                                alt={`${selectedExam.name} Logo`}
                                className="w-16 h-16 object-contain"
                            />
                        </div>
                    ) : (
                        <div className="w-20 h-20 rounded-full border-4 border-blue-500 bg-gray-200 flex items-center justify-center text-gray-400 font-bold">
                                {selectedExam.name[0]}`
                        </div>
                    )}
                    <h1 className="text-3xl font-bold">{selectedExam.name}</h1>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-6 rounded-xl shadow-md">
                    <div className="flex flex-col gap-2">
                        <span className="font-semibold">Duration</span>
                        <span>{selectedExam.duration / 60} minutes</span>
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="font-semibold">Backspace Allowed</span>
                        <span>{selectedExam.backspaceAllowed ? "Yes" : "No"}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="font-semibold">Passing WPM</span>
                        <span>{selectedExam.passingWpm}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="font-semibold">Passing Accuracy</span>
                        <span>{selectedExam.passingAccuracy}%</span>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <button
                        onClick={() =>
                            router.push(
                                `/practice/${selectedExamKey}/${selectedParagraphId}`
                            )
                        }
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg font-semibold transition"
                    >
                        Start Practice
                    </button>

                    <button
                        onClick={() => setView("paragraphList")}
                        className="w-full border border-gray-300 p-4 rounded-lg hover:bg-gray-100 transition"
                    >
                        Back
                    </button>
                </div>
            </div>
        )
    }

    // STEP 2 → Paragraph List
    if (view === "paragraphList" && selectedExam) {
        const examParagraphs = paragraphs.filter(
            (p) => p.type === selectedExam.paragraphType
        )

        return (
            <div className="max-w-5xl mx-auto p-6 space-y-6">
                <button
                    onClick={() => setView("examList")}
                    className="text-blue-600 underline"
                >
                    ← Back to Exams
                </button>

                <h1 className="text-2xl font-bold mb-4">{selectedExam.name} Paragraphs</h1>

                <div className="grid gap-4">
                    {examParagraphs.map((p) => (
                        <div
                            key={p.id}
                            onClick={() => {
                                setSelectedParagraphId(p.id)
                                setView("overview")
                            }}
                            className="p-6 rounded-2xl border hover:shadow-lg cursor-pointer transition bg-white"
                        >
                            {p.text.slice(0, 200)}...
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    // STEP 1 → Full Page Exam Cards
    const examEntries: [ExamType, typeof examConfig[ExamType]][] = Object.entries(examConfig) as [ExamType, typeof examConfig[ExamType]][];

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-4xl font-bold mb-8 text-center">Choose Exam to Practice</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {examEntries.map(([key, exam]) => (
                    <div
                        key={key}
                        onClick={() => {
                            setSelectedExamKey(key)
                            setView("paragraphList")
                        }}
                        className="flex flex-col items-center p-8 rounded-3xl border bg-white shadow-md hover:shadow-xl cursor-pointer transition transform hover:-translate-y-2"
                    >
                        {exam.logo ? (
                            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-500 flex items-center justify-center mb-4 bg-gray-100">
                                <img
                                    src={exam.logo}
                                    alt={`${exam.name} Logo`}
                                    className="w-20 h-20 object-contain"
                                />
                            </div>
                        ) : (
                            <div className="w-24 h-24 rounded-full border-4 border-blue-500 bg-gray-200 flex items-center justify-center text-gray-400 text-2xl font-bold mb-4">
                                {exam.name[0]}
                            </div>
                        )}

                        <h2 className="text-2xl font-semibold mb-2">{exam.name}</h2>
                        <p className="text-gray-600 mb-1">Duration: {exam.duration / 60} mins</p>
                        <p className="text-gray-600">Passing WPM: {exam.passingWpm}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
