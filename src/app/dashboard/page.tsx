import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard - Your Typing Progress | Civils Typing",
  description: "View your typing performance statistics, best WPM, accuracy rates, and progress tracking across all practice sessions and exams.",
  robots: {
    index: false,
  },
}

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Dashboard</h1>

            <div className="grid md:grid-cols-3 gap-6">
                <StatCard title="Total Tests" value="12" />
                <StatCard title="Best WPM" value="54" />
                <StatCard title="Average Accuracy" value="92%" />
            </div>

            <div className="bg-white p-6 shadow rounded">
                <h2 className="text-xl font-semibold mb-2">
                    Recent Activity
                </h2>
                <p>No data yet (connect to backend later).</p>
            </div>
        </div>
    )
}

function StatCard({ title, value }: any) {
    return (
        <div className="bg-white p-6 shadow rounded text-center">
            <p className="text-gray-500">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    )
}
