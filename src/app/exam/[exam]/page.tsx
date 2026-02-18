"use client"

import { useParams } from "next/navigation"

export default function ExamPage() {
    const params = useParams()

    return (
        <div>
            <h1 className="text-3xl font-bold">
                {params.exam?.toString().toUpperCase()} Exam Mode
            </h1>

            <p className="mt-4">
                Fixed timer and official pattern will be added in Phase 2.
            </p>
        </div>
    )
}
