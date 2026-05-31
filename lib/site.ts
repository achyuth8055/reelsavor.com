// Central site configuration. Update SITE_URL to your live domain before deploy.

export const SITE_URL = "https://reelsavor.com";

export const SITE = {
  name: "Reelsavor",
  shortName: "Reelsavor",
  url: SITE_URL,
  tagline: "Free guides and tools for creators to manage videos they own or have permission to use.",
  description:
    "Reelsavor offers free, browser-based tools and clear guides to help creators compress, resize, check, and prepare videos they own or have permission to use. Nothing is uploaded to a server.",
  email: "support@reelsavor.com",
  // Replace with your real verification token from Google Search Console.
  googleSiteVerification: "REPLACE_WITH_GOOGLE_SEARCH_CONSOLE_TOKEN",
  // Replace with your real Google Analytics 4 Measurement ID, e.g. G-XXXXXXXXXX.
  googleAnalyticsId: "G-XXXXXXXXXX",
  // Leave empty until your site is approved. Example: "ca-pub-1234567890123456".
  adsensePublisherId: "",
  twitter: "@reelsavor",
  ogImage: "/og-image.svg",
};

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/tools/", label: "Tools" },
  { href: "/blog/", label: "Blog" },
  { href: "/about/", label: "About" },
  { href: "/contact/", label: "Contact" },
];

export const FOOTER_LINKS = [
  { href: "/about/", label: "About" },
  { href: "/contact/", label: "Contact" },
  { href: "/privacy-policy/", label: "Privacy Policy" },
  { href: "/terms/", label: "Terms of Use" },
  { href: "/dmca/", label: "DMCA" },
  { href: "/disclaimer/", label: "Disclaimer" },
];

export type Tool = {
  slug: string;
  title: string;
  short: string;
  // featured tools appear on the homepage and in the footer; non-featured
  // tools remain accessible only from the /tools index.
  featured: boolean;
};

export const TOOLS: Tool[] = [
  {
    slug: "video-compressor",
    title: "Video Compressor",
    short: "Reduce the file size of a video you own, right in your browser.",
    featured: true,
  },
  {
    slug: "video-resizer",
    title: "Video Resizer",
    short: "Change the dimensions or aspect ratio of your own video.",
    featured: true,
  },
  {
    slug: "video-thumbnail-extractor",
    title: "Video Thumbnail Extractor",
    short: "Grab a still frame from your video and save it as an image.",
    featured: true,
  },
  {
    slug: "video-metadata-checker",
    title: "Video Metadata Checker",
    short: "See resolution, duration, file size, and format of your video.",
    featured: true,
  },
  {
    slug: "direct-mp4-downloader",
    title: "Direct Video File Downloader",
    short:
      "Save a direct video file URL (such as .mp4) you own or have permission to use. Social platform URLs are not supported.",
    featured: false,
  },
];

// Tools shown on the homepage and footer (excludes non-featured tools).
export const FEATURED_TOOLS = TOOLS.filter((t) => t.featured);
