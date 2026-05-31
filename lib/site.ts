// Central site configuration. Update SITE_URL to your live domain before deploy.

export const SITE_URL = "https://reelsavor.com";

export const SITE = {
  name: "Reelsavor",
  shortName: "Reelsavor",
  url: SITE_URL,
  tagline: "Free guides and tools for creators to manage videos they own or have permission to use.",
  description:
    "Reelsavor offers free, browser-based tools and clear guides to help creators compress, resize, check, and prepare videos they own or have permission to use. Nothing is uploaded to a server.",
  email: "achyuthkumar64@gmail.com",
  // Replace with your real verification token from Google Search Console.
  googleSiteVerification: "REPLACE_WITH_GOOGLE_SEARCH_CONSOLE_TOKEN",
  // Replace with your real Google Analytics 4 Measurement ID, e.g. G-XXXXXXXXXX.
  googleAnalyticsId: "G-XXXXXXXXXX",
  // Google AdSense publisher ID (site approved).
  adsensePublisherId: "ca-pub-8069357472142495",
  twitter: "@reelsavor",
  ogImage: "/og-image.svg",
};

// Named author / editor for E-E-A-T (real person, real contact).
export const AUTHOR = {
  name: "Achyuth Kumar",
  role: "Founder & Editor, Reelsavor",
  email: "achyuthkumar64@gmail.com",
  initials: "AK",
  bio: "Achyuth Kumar is the founder and editor of Reelsavor. He writes and reviews practical, copyright-conscious guides for video creators, small businesses, and everyday users who want to prepare, resize, compress, crop, and manage videos they own or have permission to use.",
  expertise: [
    "Video formats & codecs",
    "Aspect ratios",
    "Creator workflows",
    "Compression basics",
    "Cropping workflows",
    "Thumbnail workflows",
    "Responsible content use",
  ],
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
  { href: "/editorial-standards/", label: "Editorial Standards" },
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
    title: "YouTube Thumbnail Downloader",
    short: "Download a YouTube video's thumbnails in any size, or grab a frame from your own video.",
    featured: true,
  },
  {
    slug: "video-metadata-checker",
    title: "Video Metadata Checker",
    short: "See resolution, duration, file size, and format of your video.",
    featured: false,
  },
  {
    slug: "freeform-crop-video",
    title: "Freeform Crop Video",
    short: "Crop a video you own to any area or aspect ratio, right in your browser.",
    featured: true,
  },
  {
    slug: "screen-recorder",
    title: "Screen Recorder",
    short: "Record your screen in the browser and download the clip. Nothing is uploaded.",
    featured: true,
  },
  {
    slug: "youtube-thumbnail-maker",
    title: "YouTube Thumbnail Maker",
    short: "Design a thumbnail from your own image with templates, text, and badges.",
    featured: true,
  },
  {
    slug: "media-layout-editor",
    title: "Media Layout Editor",
    short: "Drop your media into layout templates and export a still layout image.",
    featured: true,
  },
  {
    slug: "youtube-thumbnail-resizer",
    title: "YouTube Thumbnail Resizer",
    short: "Resize your own image to YouTube thumbnail and Shorts cover sizes in your browser.",
    featured: false,
  },
  {
    slug: "extract-audio-from-video",
    title: "Extract Audio from Video",
    short: "Split a video you own into a separate audio file and a silent video, right in your browser.",
    featured: true,
  },
];

// Tools shown on the homepage and footer (excludes non-featured tools).
export const FEATURED_TOOLS = TOOLS.filter((t) => t.featured);
