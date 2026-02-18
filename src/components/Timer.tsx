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
        <div className="text-lg font-bold">
            Time: {time}s
        </div>
    )
}
