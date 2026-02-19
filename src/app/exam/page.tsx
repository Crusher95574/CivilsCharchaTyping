"use client"

import Link from "next/link"
import { examConfig, ExamType } from "@/lib/examConfig"

export default function ExamPage() {

    const exams = Object.keys(examConfig) as ExamType[]

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-6">
            <h1 className="text-3xl font-bold">
                Exam Mode
            </h1>

            <p className="text-gray-600">
                This mode simulates the real examination environment.
                Live statistics will not be shown.
            </p>

            <div className="grid grid-cols-2 gap-6">
                {exams.map((key) => {
                    const exam = examConfig[key]

                    return (
                        <Link
                            key={key}
                            href={`/exam/${key}`}
                            className="border p-6 rounded-xl hover:shadow-md transition"
                        >
                            <h2 className="text-xl font-semibold mb-2">
                                {exam.name}
                            </h2>
                            <p>Duration: {exam.duration / 60} mins</p>
                            <p>Required WPM: {exam.passingWpm}</p>
                            <p>Required Accuracy: {exam.passingAccuracy}%</p>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
