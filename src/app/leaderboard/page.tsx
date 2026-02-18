export default function LeaderboardPage() {
    const mockUsers = [
        { name: "Rahul", wpm: 65 },
        { name: "Anita", wpm: 62 },
        { name: "Vikas", wpm: 60 },
    ]

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">
                Public Leaderboard
            </h1>

            <table className="w-full bg-white shadow rounded">
                <thead>
                    <tr className="border-b">
                        <th className="p-3 text-left">Rank</th>
                        <th className="p-3 text-left">User</th>
                        <th className="p-3 text-left">WPM</th>
                    </tr>
                </thead>
                <tbody>
                    {mockUsers.map((user, index) => (
                        <tr key={index} className="border-b">
                            <td className="p-3">{index + 1}</td>
                            <td className="p-3">{user.name}</td>
                            <td className="p-3">{user.wpm}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
