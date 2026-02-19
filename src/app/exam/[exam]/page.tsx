"use client"

import { useParams, useRouter } from "next/navigation"
import { examConfig, ExamType } from "@/lib/examConfig"
import { paragraphs } from "@/lib/paragraphs"

export default function ExamInstructionsPage() {
    const params = useParams()
    const router = useRouter()

    const examKey = params.exam as ExamType

    if (!examKey || !(examKey in examConfig)) {
        return <div className="p-6">Invalid Exam</div>
    }

    const exam = examConfig[examKey]

    const startExam = () => {
        // randomly select paragraph for fairness
        const eligible = paragraphs.filter(
            (p) => p.type === exam.paragraphType
        )

        const randomPara =
            eligible[Math.floor(Math.random() * eligible.length)]

        router.push(`/exam/${examKey}/${randomPara.id}`)
    }

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-6">
            <h1 className="text-2xl font-bold">
                {exam.name} - Exam Instructions
            </h1>

            <div className="border p-6 rounded space-y-3">
                <p><strong>Duration:</strong> {exam.duration / 60} minutes</p>
                <p><strong>Backspace Allowed:</strong> {exam.backspaceAllowed ? "Yes" : "No"}</p>
                <p><strong>Passing WPM:</strong> {exam.passingWpm}</p>
                <p><strong>Passing Accuracy:</strong> {exam.passingAccuracy}%</p>

                <hr />

                <p>• No live statistics will be displayed.</p>
                <p>• Exam will auto-submit when time ends.</p>
                <p>• Do not refresh the page.</p>
            </div>

            <button
                onClick={startExam}
                className="w-full bg-black text-white p-3 rounded"
            >
                Start Exam
            </button>
        </div>
    )
}
