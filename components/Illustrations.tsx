// Lightweight, original SVG illustrations. No external/stock/copyrighted images.

// Per-tool icon. Rendered inside a gradient tile in the tool hero.
export function ToolIcon({ slug, size = 56 }: { slug: string; size?: number }) {
  const stroke = "#ffffff";
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke,
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (slug) {
    case "video-compressor":
      return (
        <svg {...common}>
          <rect x="3" y="6" width="18" height="12" rx="2" />
          <path d="M8 12h8" />
          <path d="M10 9l-2 3 2 3M14 9l2 3-2 3" />
        </svg>
      );
    case "video-resizer":
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M9 9h6v6H9z" />
          <path d="M21 7l-3 0M21 7l0 3" />
        </svg>
      );
    case "video-thumbnail-extractor":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <circle cx="9" cy="11" r="2" />
          <path d="M3 17l5-4 4 3 3-2 6 5" />
        </svg>
      );
    case "video-metadata-checker":
      return (
        <svg {...common}>
          <rect x="4" y="3" width="16" height="18" rx="2" />
          <path d="M8 8h8M8 12h8M8 16h5" />
        </svg>
      );
    case "freeform-crop-video":
      return (
        <svg {...common}>
          <path d="M6 2v14a2 2 0 0 0 2 2h14" />
          <path d="M2 6h14a2 2 0 0 1 2 2v14" />
        </svg>
      );
    case "direct-mp4-downloader":
      return (
        <svg {...common}>
          <path d="M12 3v12" />
          <path d="M7 11l5 5 5-5" />
          <path d="M5 21h14" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M10 9l5 3-5 3z" />
        </svg>
      );
  }
}

export function ArticleHeroArt({
  label,
  alt,
}: {
  label: string;
  alt: string;
}) {
  return (
    <figure className="hero-figure" role="img" aria-label={alt}>
      <svg viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="ah-bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#eaf1ff" />
            <stop offset="1" stopColor="#e9f9f4" />
          </linearGradient>
          <linearGradient id="ah-accent" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#2f6df6" />
            <stop offset="1" stopColor="#11b894" />
          </linearGradient>
        </defs>
        <rect width="800" height="300" fill="url(#ah-bg)" />
        {/* 16:9 frame */}
        <rect x="60" y="70" width="230" height="130" rx="12" fill="#fff" stroke="#d8e0ee" />
        <circle cx="175" cy="135" r="26" fill="url(#ah-accent)" />
        <path d="M168 123 l20 12 l-20 12 z" fill="#fff" />
        <text x="60" y="225" fontFamily="Arial, sans-serif" fontSize="15" fill="#51607a">16:9</text>
        {/* 1:1 frame */}
        <rect x="330" y="80" width="110" height="110" rx="12" fill="#fff" stroke="#d8e0ee" />
        <text x="330" y="210" fontFamily="Arial, sans-serif" fontSize="15" fill="#51607a">1:1</text>
        {/* 9:16 frame */}
        <rect x="480" y="55" width="90" height="160" rx="12" fill="#fff" stroke="#d8e0ee" />
        <circle cx="525" cy="135" r="20" fill="url(#ah-accent)" />
        <path d="M519 126 l15 9 l-15 9 z" fill="#fff" />
        <text x="480" y="232" fontFamily="Arial, sans-serif" fontSize="15" fill="#51607a">9:16</text>
        {/* label chip */}
        <rect x="610" y="70" width="135" height="34" rx="17" fill="url(#ah-accent)" />
        <text x="677" y="92" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="700" fill="#fff" textAnchor="middle">
          {label.slice(0, 16)}
        </text>
        {/* dots / timeline */}
        <rect x="610" y="135" width="135" height="10" rx="5" fill="#cdd9ee" />
        <rect x="610" y="135" width="80" height="10" rx="5" fill="url(#ah-accent)" />
        <rect x="610" y="160" width="110" height="8" rx="4" fill="#d8e0ee" />
        <rect x="610" y="178" width="90" height="8" rx="4" fill="#d8e0ee" />
      </svg>
    </figure>
  );
}
