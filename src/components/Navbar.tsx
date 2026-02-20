"use client";

import Link from "next/link";
import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { name: "Practice", href: "/practice" },
        { name: "Exam", href: "/exam" },
        { name: "Dashboard", href: "/dashboard" },
        { name: "Login", href: "/login" },
    ];

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                {/* Logo */}
                <Link
                    href="/"
                    className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500"
                >
                    CivilsTyping
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center space-x-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="relative text-gray-700 font-medium group hover:text-pink-500 transition-colors"
                        >
                            {link.name}
                            <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-pink-500 transition-all group-hover:w-full"></span>
                        </Link>
                    ))}
                    {/* CTA Button */}
                    <Link
                        href="/practice"
                        className="ml-4 px-5 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold shadow-lg hover:scale-105 transition-transform"
                    >
                        Start Practice
                    </Link>
                </div>

                {/* Mobile Hamburger */}
                <div className="md:hidden flex items-center">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="text-gray-700 focus:outline-none"
                    >
                        {isOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white shadow-lg px-6 py-4 space-y-4 text-gray-700 font-medium">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="block py-2 px-4 rounded-lg hover:bg-pink-50 hover:text-pink-500 transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link
                        href="/practice"
                        className="block py-2 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-center font-semibold shadow hover:scale-105 transition-transform"
                        onClick={() => setIsOpen(false)}
                    >
                        Start Practice
                    </Link>
                </div>
            )}
        </nav>
    );
}
