"use client"

import Link from "next/link"
import { examConfig, ExamType } from "@/lib/examConfig"

export default function ExamPage() {
    const exams = Object.keys(examConfig) as ExamType[]

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-8">
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-bold">Exam Mode</h1>
                <p className="text-gray-600 max-w-xl mx-auto">
                    This mode simulates the real examination environment. Live statistics will not be shown.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {exams.map((key) => {
                    const exam = examConfig[key]

                    return (
                        <Link
                            key={key}
                            href={`/exam/${key}`}
                            className="flex flex-col items-center p-8 rounded-3xl border bg-white shadow-md hover:shadow-xl cursor-pointer transition transform hover:-translate-y-2"
                        >
                            {/* Exam Logo */}
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

                            {/* Exam Info */}
                            <h2 className="text-2xl font-semibold mb-2">{exam.name}</h2>
                            <p className="text-gray-600 mb-1">Duration: {exam.duration / 60} mins</p>
                            <p className="text-gray-600 mb-1">Required WPM: {exam.passingWpm}</p>
                            <p className="text-gray-600">Required Accuracy: {exam.passingAccuracy}%</p>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
