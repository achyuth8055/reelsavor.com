import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/Bits";

// This tool has been retired from the public site. The page is kept only so
// existing links don't 404; it is noindex, carries no downloader UI, and is not
// listed in navigation or the sitemap.
export const metadata: Metadata = {
  title: "Tool moved",
  description: "This tool is no longer available. Browse the current Reelsavor creator tools instead.",
  alternates: { canonical: "/tools/" },
  robots: { index: false, follow: true },
};

export const dynamic = "force-static";

export default function Page() {
  return (
    <article className="article">
      <div className="container prose" style={{ paddingTop: 24, paddingBottom: 64 }}>
        <Breadcrumb items={[{ href: "/", label: "Home" }, { href: "/tools/", label: "Tools" }, { label: "Tool moved" }]} />
        <h1>This tool is no longer available</h1>
        <p>
          We&apos;ve streamlined Reelsavor to focus on browser-side creator
          editing tools. Explore the current set of free, client-side tools:
        </p>
        <ul>
          <li><Link href="/tools/video-compressor/">Video Compressor</Link></li>
          <li><Link href="/tools/video-resizer/">Video Resizer</Link></li>
          <li><Link href="/tools/freeform-crop-video/">Freeform Crop Video</Link></li>
          <li><Link href="/tools/screen-recorder/">Screen Recorder</Link></li>
          <li><Link href="/tools/youtube-thumbnail-maker/">YouTube Thumbnail Maker</Link></li>
          <li><Link href="/tools/media-layout-editor/">Media Layout Editor</Link></li>
          <li><Link href="/tools/">See all tools →</Link></li>
        </ul>
      </div>
    </article>
  );
}
