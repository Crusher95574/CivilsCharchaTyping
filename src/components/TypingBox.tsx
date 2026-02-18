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

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault()
    }

    return (
        <div className="space-y-4">

            {/* Highlighted Paragraph */}
            <div className="p-6 bg-gray-900 text-gray-200 rounded leading-8 text-lg font-mono">
                {originalText.split("").map((char, index) => {
                    let className = ""

                    if (index < typedText.length) {
                        className =
                            typedText[index] === char
                                ? "text-green-400"
                                : "text-red-400"
                    }

                    if (index === typedText.length) {
                        className += " bg-yellow-600 text-black"
                    }

                    return (
                        <span key={index} className={className}>
                            {char}
                        </span>
                    )
                })}
            </div>

            {/* Input */}
            <textarea
                className="w-full p-4 border rounded text-lg font-mono bg-gray-800 text-white"
                rows={6}
                value={typedText}
                onChange={(e) => setTypedText(e.target.value)}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
            />
        </div>
    )
}
