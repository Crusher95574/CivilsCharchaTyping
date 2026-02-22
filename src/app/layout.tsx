import "./globals.css"
import Navbar from "@/components/Navbar"
import type { Metadata } from "next"
import { Analytics } from '@vercel/analytics/next'

export const metadata: Metadata = {
  title: "Free Civils Typing - Government Exam Practice - SSC, CGL, RRB",
  description: "Free Civils Typing: Master typing skills for SSC CHSL, CGL & RRB exams. Practice with real exam patterns, track speed & accuracy, and improve daily. Free online typing practice platform.",
  keywords: ["free civils typing", "typing practice", "government exams", "SSC typing", "CGL typing", "RRB typing", "speed typing", "typing test"],
  authors: [{ name: "Free Civils Typing" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://free-civils-typing.com",
    title: "Free Civils Typing - Government Exam Practice",
    description: "Master typing skills for government exams with Free Civils Typing. Practice with real exam patterns and track your progress.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Free Civils Typing - Practice Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Civils Typing - Government Exam Typing Practice",
    description: "Free practice typing for SSC, CGL & RRB exams with real exam patterns",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://free-civils-typing.com",
  },
}
import { Analytics } from '@vercel/analytics/next'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#2563eb" />
      </head>
      <body className="bg-gray-50 min-h-screen">
        <Navbar />
        <main className="max-w-6xl mx-auto p-6">{children}</main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Free Civils Typing",
              "description": "Free Government Exam Typing Practice Platform for SSC, CGL, RRB",
              "url": "https://free-civils-typing.com",
              "applicationCategory": "EducationalApplication",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              }
            })
          }}
        />
        <Analytics />
      </body>
    </html>
  )
}
