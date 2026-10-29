import type { Metadata } from "next";
import { MotionProvider } from "@/components/site/motion/MotionProvider";
import { SiteFooter } from "@/components/site/sections/SiteFooter";
import { SiteNav } from "@/components/site/sections/SiteNav";
import { getSiteContent } from "@/sanity/getSiteContent";

export async function generateMetadata(): Promise<Metadata> {
  const { seo, profile } = await getSiteContent();
  const images = seo.ogImageUrl ? [seo.ogImageUrl] : undefined;
  return {
    title: { default: seo.title, template: `%s — ${profile.name}` },
    description: seo.description,
    openGraph: {
      title: seo.title,
      description: seo.description,
      type: "website",
      locale: "en_IN",
      siteName: `${profile.name} Portfolio`,
      images,
    },
    twitter: { card: "summary_large_image", title: seo.title, description: seo.description, images },
    robots: { index: true, follow: true },
  };
}

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const { profile, seo, navItems, sections, labels } = await getSiteContent();
  const visibleSections = sections.filter((s) => s.visible).map((s) => s.key);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: profile.name,
      jobTitle: `${profile.title} — ${profile.specialties}`,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Bengaluru",
        addressRegion: "Karnataka",
        addressCountry: "IN",
      },
      email: profile.email,
      telephone: profile.phoneHref.replace(/^tel:/, ""),
      sameAs: [profile.linkedin],
      description: seo.description,
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <a href="#main-content" className="skip-link">
        {labels.skipLink}
      </a>
      <MotionProvider>
        <SiteNav name={profile.name} navItems={navItems} visibleSections={visibleSections} labels={labels} />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter
          name={profile.name}
          title={profile.title}
          location={profile.location}
          email={profile.email}
          linkedin={profile.linkedin}
          linkedinLabel={labels.linkedinLabel}
        />
      </MotionProvider>
    </>
  );
}
