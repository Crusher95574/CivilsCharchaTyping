"use client"

interface Result {
    grossWPM: number
    netWPM: number
    accuracy: number
    totalErrors: number
    backspaceCount: number
    originalText: string
    typedText: string
}

interface Props {
    result: Result
}

export default function ResultCard({ result }: Props) {

    if (!result) return null

    const {
        grossWPM,
        netWPM,
        accuracy,
        totalErrors,
        backspaceCount,
        originalText,
        typedText,
    } = result

    return (
        <div className="space-y-8">

            {/* Stats Section */}
            <div className="border p-6 rounded bg-white shadow space-y-2">
                <p><strong>Gross WPM:</strong> {grossWPM.toFixed(2)}</p>
                <p><strong>Net WPM:</strong> {netWPM.toFixed(2)}</p>
                <p><strong>Accuracy:</strong> {accuracy.toFixed(2)}%</p>
                <p><strong>Total Errors:</strong> {totalErrors}</p>
                <p><strong>Backspaces:</strong> {backspaceCount}</p>
            </div>

            {/* Paragraph Comparison */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Typing Review</h2>

                <div className="p-6 bg-gray-100 rounded font-mono leading-7">
                    {originalText.split("").map((char, index) => {
                        const typedChar = typedText[index]

                        let className = ""

                        if (typedChar === undefined) {
                            className = "bg-yellow-200"
                        } else if (typedChar === char) {
                            className = "text-green-600"
                        } else {
                            className = "bg-red-400 text-black"
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
    )
}
