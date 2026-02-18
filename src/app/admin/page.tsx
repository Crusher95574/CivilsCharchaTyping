import Link from "next/link"

export default function AdminPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Admin Panel</h1>

            <div className="space-x-4">
                <Link
                    href="/admin/paragraphs"
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Manage Paragraphs
                </Link>

                <Link
                    href="/admin/users"
                    className="bg-green-600 text-white px-4 py-2 rounded"
                >
                    Manage Users
                </Link>
            </div>
        </div>
    )
}
