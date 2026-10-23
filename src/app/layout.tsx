import type { Metadata, Viewport } from "next";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { siteProfile } from "@/lib/portfolio-data";
import "./globals.css";

const pageTitle =
  "ARJUN T.R — Product & Growth Technologist | SEO, Paid Media & AI Automation";
const pageDescription =
  "Digital Marketing & Growth Specialist and Product Technologist in Bengaluru with 3+ years of experience in SEO (+482% impressions), Google & Meta Ads (₹10–15L/mo @ ~3x ROAS), GTM/GA4/Zoho CRM tracking, and No-Code AI Automation.";

export const metadata: Metadata = {
  title: {
    default: pageTitle,
    template: `%s — ${siteProfile.name}`,
  },
  description: pageDescription,
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    type: "website",
    locale: "en_IN",
    siteName: "Arjun T.R Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#171914",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  mainEntity: {
    "@type": "Person",
    name: "Arjun T.R",
    jobTitle: "Digital Marketing & Growth Specialist | Product & Growth Technologist",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bengaluru",
      addressRegion: "Karnataka",
      addressCountry: "IN",
    },
    email: "ajarjuntr@gmail.com",
    telephone: "+91-9620759032",
    sameAs: [
      "https://www.linkedin.com/in/arjun-tr-digital-marketing-seo-ppc",
    ],
    description: pageDescription,
    knowsAbout: [
      "Technical SEO, On-Page & Off-Page SEO, AEO & GEO Ranking",
      "Google Ads (Search, Display, PMax) & Meta Ads (₹10–15L/mo)",
      "Google Tag Manager (GTM), Google Analytics 4 (GA4) & Zoho PageSense",
      "Zoho CRM Workflows & WhatsApp AI Chatbot Automation",
      "No-Code AI Dashboards, Landing Pages & Calculators (Claude Cowork, Codex, GoMarble AI)",
      "WordPress, Sanity CMS & Shopify",
    ],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@500;700;800&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body id="top">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Header />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
