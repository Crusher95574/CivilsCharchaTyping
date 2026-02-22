"use client"

import { useEffect, useState } from "react"

interface ResultData {
    originalText: string
    typedText: string
    wpm: number
    accuracy: number
    totalErrors: number
    backspaceCount: number
    duration: number
}

export default function ResultPage() {

    const [data, setData] = useState<ResultData | null>(null)

    useEffect(() => {
        const stored = localStorage.getItem("typingResult")
        if (stored) {
            setData(JSON.parse(stored))
        }
    }, [])

    if (!data) {
        return (
            <div className="p-10 text-center">
                No result found.
            </div>
        )
    }

    const {
        originalText,
        typedText,
        wpm,
        accuracy,
        totalErrors,
        backspaceCount,
        duration,
    } = data

    return (
        <div className="max-w-5xl mx-auto p-8 space-y-8">

            {/* Stats Section */}
            <div className="grid grid-cols-3 gap-6 text-center">

                <div className="bg-gray-900 text-white p-6 rounded">
                    <h2 className="text-xl font-bold">{wpm}</h2>
                    <p>WPM</p>
                </div>

                <div className="bg-gray-900 text-white p-6 rounded">
                    <h2 className="text-xl font-bold">{accuracy}%</h2>
                    <p>Accuracy</p>
                </div>

                <div className="bg-gray-900 text-white p-6 rounded">
                    <h2 className="text-xl font-bold">{totalErrors}</h2>
                    <p>Total Errors</p>
                </div>

                <div className="bg-gray-900 text-white p-6 rounded">
                    <h2 className="text-xl font-bold">{backspaceCount}</h2>
                    <p>Backspaces</p>
                </div>

                <div className="bg-gray-900 text-white p-6 rounded">
                    <h2 className="text-xl font-bold">{duration / 60} min</h2>
                    <p>Duration</p>
                </div>

            </div>

            {/* Paragraph Comparison */}
            <div className="space-y-6">

                <div>
                    <h3 className="text-lg font-bold mb-2">
                        Original Paragraph
                    </h3>

                    <div className="p-6 bg-gray-100 rounded font-mono leading-7">
                        {originalText}
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-bold mb-2">
                        Your Typing (Errors Highlighted)
                    </h3>

                    <div className="p-6 bg-gray-100 rounded font-mono leading-7">
                        {originalText.split("").map((char, index) => {
                            const typedChar = typedText[index]

                            let className = ""

                            if (typedChar == null) {
                                className = "bg-yellow-200"
                            } else if (typedChar === char) {
                                className = "text-green-600"
                            } else {
                                className = "bg-red-300 text-black"
                            }

                            return (
                                <span key={index} className={className}>
                                    {typedChar ?? ""}
                                </span>
                            )
                        })}
                    </div>
                </div>

            </div>
        </div>
    )
}
