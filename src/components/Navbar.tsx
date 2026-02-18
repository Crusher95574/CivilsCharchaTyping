"use client";

import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold text-blue-600">
                    CivilsTyping
                </Link>

                <div className="space-x-6 text-gray-700 font-medium">
                    <Link href="/practice" className="hover:text-blue-600">
                        Practice
                    </Link>
                    <Link href="/exam/ssc_chsl" className="hover:text-blue-600">
                        Exam
                    </Link>
                    <Link href="/leaderboard" className="hover:text-blue-600">
                        Leaderboard
                    </Link>
                    <Link href="/dashboard" className="hover:text-blue-600">
                        Dashboard
                    </Link>
                    <Link href="/login" className="hover:text-blue-600">
                        Login
                    </Link>
                </div>
            </div>
        </nav>
    );
}
