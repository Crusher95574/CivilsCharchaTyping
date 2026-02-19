"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { examConfig } from "@/lib/examConfig"
import { paragraphs } from "@/lib/paragraphs"

type View = "examList" | "paragraphList" | "overview"

export default function PracticePage() {
  const router = useRouter()

  const [view, setView] = useState<View>("examList")
  const [selectedExamKey, setSelectedExamKey] = useState<string | null>(null)
  const [selectedParagraphId, setSelectedParagraphId] = useState<number | null>(null)

  const selectedExam =
    selectedExamKey ? examConfig[selectedExamKey] : null

  // STEP 3 → Overview Screen
  if (view === "overview" && selectedExam && selectedParagraphId) {
    return (
      <div className="max-w-3xl mx-auto p-6 space-y-4">
        <h1 className="text-2xl font-bold">
          {selectedExam.name}
        </h1>

        <div className="bg-gray-100 p-6 rounded-lg space-y-2">
          <p><strong>Duration:</strong> {selectedExam.duration / 60} minutes</p>
          <p><strong>Backspace Allowed:</strong> {selectedExam.backspaceAllowed ? "Yes" : "No"}</p>
          <p><strong>Passing WPM:</strong> {selectedExam.passingWpm}</p>
          <p><strong>Passing Accuracy:</strong> {selectedExam.passingAccuracy}%</p>
        </div>

        <button
          onClick={() =>
            router.push(
              `/practice/${selectedExamKey}/${selectedParagraphId}`
            )
          }
          className="w-full bg-black text-white p-3 rounded"
        >
          Start Practice
        </button>

        <button
          onClick={() => setView("paragraphList")}
          className="w-full border p-3 rounded"
        >
          Back
        </button>
      </div>
    )
  }

  // STEP 2 → Paragraph List
  if (view === "paragraphList" && selectedExam) {
    const examParagraphs = paragraphs.filter(
      (p) => p.type === selectedExam.paragraphType
    )

    return (
      <div className="max-w-5xl mx-auto p-6">
        <button
          onClick={() => setView("examList")}
          className="mb-4 underline"
        >
          ← Back to Exams
        </button>

        <h1 className="text-2xl font-bold mb-6">
          {selectedExam.name} Paragraphs
        </h1>

        {examParagraphs.map((p) => (
          <div
            key={p.id}
            onClick={() => {
              setSelectedParagraphId(p.id)
              setView("overview")
            }}
            className="border p-4 mb-3 rounded cursor-pointer hover:bg-gray-50"
          >
            {p.text.slice(0, 150)}...
          </div>
        ))}
      </div>
    )
  }

  // STEP 1 → Exam Cards
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        Choose Exam to Practice
      </h1>

      <div className="grid grid-cols-2 gap-6">
        {Object.entries(examConfig).map(([key, exam]) => (
          <div
            key={key}
            onClick={() => {
              setSelectedExamKey(key)
              setView("paragraphList")
            }}
            className="border p-6 rounded-xl cursor-pointer hover:shadow-md transition"
          >
            <h2 className="text-xl font-semibold mb-2">
              {exam.name}
            </h2>
            <p>Duration: {exam.duration / 60} mins</p>
            <p>Passing WPM: {exam.passingWpm}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
