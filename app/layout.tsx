import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITE, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE.name}, ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  alternates: { canonical: "/" },
  // Google Search Console verification. Set the real token in lib/site.ts;
  // the placeholder is omitted so we never emit a bogus verification tag.
  ...(SITE.googleSiteVerification &&
  SITE.googleSiteVerification !== "REPLACE_WITH_GOOGLE_SEARCH_CONSOLE_TOKEN"
    ? { verification: { google: SITE.googleSiteVerification } }
    : {}),
  // Google AdSense site verification meta tag.
  ...(SITE.adsensePublisherId
    ? { other: { "google-adsense-account": SITE.adsensePublisherId } }
    : {}),
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: `${SITE.name}, ${SITE.tagline}`,
    description: SITE.description,
    url: SITE_URL,
    images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: SITE.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name}, ${SITE.tagline}`,
    description: SITE.description,
    images: [SITE.ogImage],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE_URL,
    description: SITE.description,
    email: SITE.email,
    founder: { "@type": "Person", name: "Achyuth Kumar" },
  };
  const gaId = SITE.googleAnalyticsId;
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        {/* Google AdSense loader. Loads only when a publisher ID is set in lib/site.ts. */}
        {SITE.adsensePublisherId && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${SITE.adsensePublisherId}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body>
        {/* Google Analytics 4, replace the Measurement ID in lib/site.ts.
            Loads only when a real G- id is present. */}
        {gaId && gaId !== "G-XXXXXXXXXX" && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga4" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}');`}
            </Script>
          </>
        )}
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
