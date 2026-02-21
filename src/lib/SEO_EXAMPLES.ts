/**
 * SEO Implementation Examples
 * 
 * This file contains practical examples of how to implement
 * various SEO features throughout the Civils Typing application
 */

// ============================================
// 1. BREADCRUMB COMPONENT WITH SCHEMA
// ============================================
/*
// Create src/components/Breadcrumb.tsx

import Link from 'next/link'

interface BreadcrumbItem {
  name: string
  path: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `https://civils-typing.com${item.path}`
    }))
  }

  return (
    <>
      <nav className="flex items-center gap-2 text-sm text-gray-600 mb-4">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <span>/</span>
            {index === items.length - 1 ? (
              <span className="text-gray-900 font-medium">{item.name}</span>
            ) : (
              <Link href={item.path} className="hover:text-blue-600">
                {item.name}
              </Link>
            )}
          </div>
        ))}
      </nav>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </>
  )
}
*/

// ============================================
// 2. FAQSection COMPONENT WITH SCHEMA
// ============================================
/*
// Create src/components/FAQSection.tsx

import { useState } from 'react'

interface FAQItem {
  question: string
  answer: string
}

interface FAQSectionProps {
  items: FAQItem[]
  title?: string
}

export function FAQSection({ items, title = "Frequently Asked Questions" }: FAQSectionProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": items.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  }

  return (
    <>
      <section className="space-y-4">
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        {items.map((item, index) => (
          <div key={index} className="border rounded-lg">
            <button
              onClick={() => setActiveIndex(activeIndex === index ? null : index)}
              className="w-full px-4 py-4 text-left font-semibold hover:bg-gray-50"
            >
              {item.question}
            </button>
            {activeIndex === index && (
              <div className="px-4 py-4 bg-gray-50 text-gray-700">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </>
  )
}
*/

// ============================================
// 3. PRODUCT/COURSE SCHEMA
// ============================================
/*
// Add to pages that offer exams/courses

const courseSchema = {
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "SSC CHSL Typing Practice",
  "description": "Complete typing practice course for SSC CHSL exam preparation",
  "provider": {
    "@type": "Organization",
    "name": "Civils Typing",
    "url": "https://civils-typing.com"
  },
  "hasCourseInstance": {
    "@type": "CourseInstance",
    "instructionLanguage": "en",
    "isAccessibleForFree": true
  }
}
*/

// ============================================
// 4. IMAGE OPTIMIZATION
// ============================================
/*
// For all images, use Next.js Image component

import Image from 'next/image'

// Good - optimized
<Image
  src="/typ-img.png"
  alt="Typing Practice Illustration - Learn to type faster"
  width={500}
  height={300}
  priority={false}
  loading="lazy"
/>

// Also add images to sitemap
<image:image>
  <image:loc>https://civils-typing.com/typ-img.png</image:loc>
  <image:title>Typing Practice Illustration</image:title>
</image:image>
*/

// ============================================
// 5. INTERNATIONAL SEO (HREFLANG)
// ============================================
/*
// If you want to support multiple languages, add to layout.tsx metadata:

export const metadata: Metadata = {
  alternates: {
    languages: {
      'en-US': 'https://civils-typing.com',
      'hi-IN': 'https://civils-typing.com/hi',
      'en-IN': 'https://civils-typing.com/en-in',
    },
    canonical: 'https://civils-typing.com',
  },
}
*/

// ============================================
// 6. PAGINATION SEO
// ============================================
/*
// For paginated content, add prev/next links:

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://civils-typing.com/results?page=2',
  },
}

// And in component:
<link rel="prev" href="/results?page=1" />
<link rel="next" href="/results?page=3" />
*/

// ============================================
// 7. EVENT SCHEMA (IF APPLICABLE)
// ============================================
/*
const eventSchema = {
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "Typing Competition",
  "startDate": "2026-03-15T10:00:00",
  "endDate": "2026-03-15T18:00:00",
  "eventStatus": "EventScheduled",
  "eventAttendanceMode": "OnlineEventAttendanceMode",
  "location": {
    "@type": "VirtualLocation",
    "url": "https://civils-typing.com/competition"
  },
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "INR",
    "availability": "InStock"
  }
}
*/

// ============================================
// 8. LOCAL BUSINESS SCHEMA (IF APPLICABLE)
// ============================================
/*
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Civils Typing",
  "image": "https://civils-typing.com/logo.png",
  "description": "Government Exam Typing Practice",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Main St",
    "addressLocality": "Delhi",
    "addressRegion": "DL",
    "postalCode": "110001",
    "addressCountry": "IN"
  },
  "telephone": "+91-XXX-XXX-XXXX",
  "email": "support@civils-typing.com",
  "url": "https://civils-typing.com"
}
*/

// ============================================
// 9. PERFORMANCE OPTIMIZATION
// ============================================
/*
// next.config.ts optimizations:

export default {
  // Compress files
  compress: true,
  
  // Generate ETags
  generateEtags: true,
  
  // PoweredBy header (remove for security)
  poweredByHeader: false,
  
  // Trailing slashes
  trailingSlash: false,
  
  // Production source maps
  productionBrowserSourceMaps: false,
}
*/

// ============================================
// 10. CANONICAL URLs
// ============================================
/*
// All pages now have canonical URLs defined in metadata:

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://civils-typing.com/practice',
  },
}
*/

// ============================================
// 11. RICH SNIPPETS / KNOWLEDGE PANEL
// ============================================
/*
// Contact schema for knowledge panel:
const contactSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Civils Typing",
  "url": "https://civils-typing.com",
  "logo": "https://civils-typing.com/logo.png",
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "Customer Service",
    "telephone": "+91-XXX-XXX-XXXX",
    "email": "support@civils-typing.com"
  },
  "sameAs": [
    "https://www.facebook.com/civilstyping",
    "https://twitter.com/civilstyping",
    "https://www.instagram.com/civilstyping"
  ]
}
*/

// ============================================
// 12. REVIEW/RATING SCHEMA
// ============================================
/*
const reviewSchema = {
  "@context": "https://schema.org",
  "@type": "AggregateRating",
  "ratingValue": "4.8",
  "ratingCount": "1250",
  "reviewCount": "450"
}
*/

// ============================================
// 13. SITE SPEED OPTIMIZATION
// ============================================
/*
// Tips for faster load times:

1. Use Next.js Image component for images
2. Implement lazy loading for below-fold content
3. Code split and dynamic imports
4. Minify CSS/JS
5. Use CDN for static assets
6. Enable compression (next.config.ts)
7. Optimize fonts (use system fonts or font-display: swap)
8. Remove unused dependencies
9. Use React.memo for expensive components
10. Implement service workers for offline support
*/

export default {}
