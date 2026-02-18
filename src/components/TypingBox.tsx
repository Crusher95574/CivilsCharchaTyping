"use client"

import { useEffect } from "react"
import { analyzeTyping } from "@/lib/typingEngine"

interface Props {
    originalText: string
    typedText: string
    setTypedText: (value: string) => void
    setLiveStats: (stats: any) => void
    backspaceCount: number
    setBackspaceCount: (value: number) => void
}

export default function TypingBox({
    originalText,
    typedText,
    setTypedText,
    setLiveStats,
    backspaceCount,
    setBackspaceCount,
}: Props) {

    useEffect(() => {
        const stats = analyzeTyping(originalText, typedText)
        setLiveStats(stats)
    }, [typedText])

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Backspace") {
            setBackspaceCount(backspaceCount + 1)
        }
    }

    return (
        <div className="space-y-4">
            {/* Highlighted Paragraph */}
            <div className="p-4 bg-white border rounded leading-7 text-lg">
                {originalText.split("").map((char, index) => {
                    let color = ""

                    if (index < typedText.length) {
                        color =
                            typedText[index] === char
                                ? "text-green-600"
                                : "text-red-600"
                    }

                    return (
                        <span key={index} className={color}>
                            {char}
                        </span>
                    )
                })}
            </div>

            {/* Input Area */}
            <textarea
                className="w-full p-4 border rounded text-lg"
                rows={6}
                value={typedText}
                onChange={(e) => setTypedText(e.target.value)}
                onKeyDown={handleKeyDown}
            />
        </div>
    )
}
