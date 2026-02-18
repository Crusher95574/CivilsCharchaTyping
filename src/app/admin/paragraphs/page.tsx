export default function ParagraphAdminPage() {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">
                Paragraph Management
            </h1>

            <button className="mb-4 bg-blue-600 text-white px-4 py-2 rounded">
                Add New Paragraph
            </button>

            <div className="bg-white p-4 shadow rounded">
                <p>No paragraphs yet.</p>
            </div>
        </div>
    )
}
