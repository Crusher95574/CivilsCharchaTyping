// SEO utilities for structured data and metadata
import type { Metadata } from "next"

export interface SeoPageConfig {
  title: string
  description: string
  keywords?: string[]
  canonicalUrl?: string
  ogImage?: string
  ogType?: string
  author?: string
}

export function generateMetadata(config: SeoPageConfig): Metadata {
  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords,
    authors: config.author ? [{ name: config.author }] : undefined,
    openGraph: {
      title: config.title,
      description: config.description,
      type: (config.ogType as any) || "website",
      url: config.canonicalUrl || "https://civils-typing.com",
      images: config.ogImage ? [{ url: config.ogImage }] : undefined,
    },
    alternates: {
      canonical: config.canonicalUrl,
    },
  }
}

// Structured data generators
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Civils Typing",
    "description": "Government Exam Typing Practice Platform",
    "url": "https://civils-typing.com",
    "logo": "https://civils-typing.com/logo.png",
    "sameAs": [
      "https://twitter.com/civilstyping",
      "https://facebook.com/civilstyping",
      "https://instagram.com/civilstyping"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Support",
      "email": "support@civils-typing.com"
    }
  }
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  }
}

export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }
}

export function generateArticleSchema(config: {
  headline: string
  description: string
  image: string
  datePublished: string
  dateModified: string
  author: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": config.headline,
    "description": config.description,
    "image": config.image,
    "datePublished": config.datePublished,
    "dateModified": config.dateModified,
    "author": {
      "@type": "Person",
      "name": config.author
    }
  }
}
