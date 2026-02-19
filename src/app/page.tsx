import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-5xl font-bold text-gray-800 mb-6">
        Government Exam Typing Practice
      </h1>

      <p className="text-xl text-gray-600 max-w-2xl mb-10">
        Prepare for SSC CHSL, CGL & RRB typing tests with real exam pattern.
        Practice Hindi & English typing with detailed speed & accuracy analysis.
      </p>

      <div className="flex flex-wrap gap-6 justify-center">
        <Link href="/practice" className="btn-primary">
          Practice Now
        </Link>

        <Link href="/exam" className="btn-secondary">
          Exam Mode
        </Link>
      </div>
    </div>
  );
}
