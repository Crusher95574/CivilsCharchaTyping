"use client"

interface Props {
    value: string
    onChange: (value: string) => void
}

export default function DifficultySelector({ value, onChange }: Props) {
    const difficulties = ["easy", "medium", "hard"]

    return (
        <div className="space-y-2">
            <label className="font-semibold">Select Difficulty</label>

            <div className="flex gap-3">
                {difficulties.map((level) => (
                    <button
                        key={level}
                        onClick={() => onChange(level)}
                        className={`px-4 py-2 rounded border ${value === level
                                ? "bg-blue-600 text-white"
                                : "bg-white"
                            }`}
                    >
                        {level.toUpperCase()}
                    </button>
                ))}
            </div>
        </div>
    )
}
