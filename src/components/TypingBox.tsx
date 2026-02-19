"use client"

import { useEffect, useRef } from "react"
import { analyzeTyping } from "@/lib/typingEngine"

interface Props {
    originalText: string
    typedText: string
    setTypedText: (value: string) => void
    setLiveStats: (stats: any) => void
    backspaceCount: number
    setBackspaceCount: React.Dispatch<React.SetStateAction<number>>
    backspaceAllowed?: boolean
}

export default function TypingBox({
    originalText,
    typedText,
    setTypedText,
    setLiveStats,
    backspaceCount,
    setBackspaceCount,
    backspaceAllowed = true,
}: Props) {

    const textareaRef = useRef<HTMLTextAreaElement>(null)

    // Autofocus on mount
    useEffect(() => {
        textareaRef.current?.focus()
    }, [])

    // Live typing analysis
    useEffect(() => {
        const stats = analyzeTyping(originalText, typedText)
        setLiveStats(stats)
    }, [typedText, originalText, setLiveStats])

    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLTextAreaElement>
    ) => {
        // Block backspace if not allowed
        if (!backspaceAllowed && e.key === "Backspace") {
            e.preventDefault()
            return
        }

        if (e.key === "Backspace") {
            setBackspaceCount(prev => prev + 1)
        }

        // Prevent typing beyond paragraph length
        if (
            typedText.length >= originalText.length &&
            e.key !== "Backspace"
        ) {
            e.preventDefault()
        }
    }

    const handlePaste = (
        e: React.ClipboardEvent<HTMLTextAreaElement>
    ) => {
        e.preventDefault()
    }

    const handleChange = (
        e: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        const value = e.target.value

        // Prevent overflow
        if (value.length <= originalText.length) {
            setTypedText(value)
        }
    }

    return (
        <div className="space-y-4">

            {/* Highlighted Paragraph */}
            <div className="p-6 bg-gray-900 text-gray-200 rounded leading-8 text-lg font-mono select-none">
                {originalText.split("").map((char, index) => {
                    let className = ""

                    if (index < typedText.length) {
                        className =
                            typedText[index] === char
                                ? "text-green-400"
                                : "text-red-400"
                    }

                    if (index === typedText.length) {
                        className += " bg-yellow-500 text-black"
                    }

                    return (
                        <span key={index} className={className}>
                            {char}
                        </span>
                    )
                })}
            </div>

            {/* Input Area */}
            <textarea
                ref={textareaRef}
                className="w-full p-4 border rounded text-lg font-mono bg-gray-800 text-white resize-none focus:outline-none focus:ring-2 focus:ring-yellow-500"
                rows={6}
                value={typedText}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
            />
        </div>
    )
}
