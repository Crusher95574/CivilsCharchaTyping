"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-gray-50">
      {/* Hero Section */}
      <div className="max-w-3xl text-center space-y-6">
        <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 leading-tight">
          Government Exam Typing Practice
        </h1>

        <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">
          Prepare for <span className="font-semibold">SSC CHSL, CGL & RRB</span> typing tests with real exam patterns.
          Practice <span className="font-semibold"> English</span> typing with detailed speed & accuracy analysis.
        </p>

        {/* Optional Illustration */}
        <div className="my-6">
          <img
            src="/typ-img.png"
            alt="Typing Practice Illustration"
            className="w-115 mx-auto"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-6 justify-center mt-4">
          <Link
            href="/practice"
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-lg font-semibold shadow-lg transition transform hover:-translate-y-1"
          >
            Practice Now
          </Link>

          <Link
            href="/exam"
            className="px-8 py-4 bg-white border-2 border-blue-600 hover:bg-blue-50 text-blue-600 rounded-full text-lg font-semibold shadow transition transform hover:-translate-y-1"
          >
            Exam Mode
          </Link>
        </div>
      </div>

      {/* Footer / Additional Info */}
      <div className="mt-16 text-gray-500 text-sm max-w-2xl text-center">
        <p>Free Typing Practice Platform | Track your speed, accuracy, and improve daily.</p>
      </div>
    </div>
  );
}
