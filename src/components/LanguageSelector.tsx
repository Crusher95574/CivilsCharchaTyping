"use client"

interface Props {
    value: string
    onChange: (value: string) => void
}

export default function LanguageSelector({ value, onChange }: Props) {
    const languages = [
        { label: "English", value: "english" },
        { label: "Hindi", value: "hindi" },
    ]

    return (
        <div className="space-y-2">
            <label className="font-semibold">Select Language</label>

            <div className="flex gap-3">
                {languages.map((lang) => (
                    <button
                        key={lang.value}
                        onClick={() => onChange(lang.value)}
                        className={`px-4 py-2 rounded border ${value === lang.value
                                ? "bg-green-600 text-white"
                                : "bg-white"
                            }`}
                    >
                        {lang.label}
                    </button>
                ))}
            </div>
        </div>
    )
}
