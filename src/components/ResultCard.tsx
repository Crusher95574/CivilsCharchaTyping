export default function ResultCard({ result }: any) {
    return (
        <div className="border p-6 rounded bg-white shadow space-y-2">
            <p>Gross WPM: {result.gross.toFixed(2)}</p>
            <p>Net WPM: {result.net.toFixed(2)}</p>
            <p>Accuracy: {result.accuracy.toFixed(2)}%</p>
            <p>Total Errors: {result.totalErrors}</p>
        </div>
    )
}
