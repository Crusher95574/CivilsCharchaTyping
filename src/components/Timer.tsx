"use client"
import { useEffect } from "react"

export default function Timer({
    time,
    setTime,
    onTimeUp,
}: any) {
    useEffect(() => {
        if (time <= 0) {
            onTimeUp()
            return
        }

        const interval = setInterval(() => {
            setTime((prev: number) => prev - 1)
        }, 1000)

        return () => clearInterval(interval)
    }, [time])

    return (
        <div className="bg-gray-100 px-4 py-2 rounded shadow">
            Time: {time}s
        </div>
    )
}
