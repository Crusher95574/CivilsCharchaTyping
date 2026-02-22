import "./globals.css"
import Navbar from "@/components/Navbar"
import { Analytics } from '@vercel/analytics/next'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <Navbar />
        <main className="max-w-6xl mx-auto p-6">{children}</main>
        <Analytics />
      </body>
    </html>
  )
}
