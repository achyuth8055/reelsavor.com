import type { Faq } from "@/components/Bits";

export type Post = {
  slug: string;
  title: string; // H1
  seoTitle: string; // <title>
  description: string; // meta description
  date: string; // ISO date
  updated?: string;
  category: string;
  readingTime: string;
  intro: string[]; // HTML-allowed paragraphs
  sections: { heading: string; html: string }[];
  faqs: Faq[];
  related: { href: string; label: string }[];
};

export function slugifyHeading(h: string): string {
  return h
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function getPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}

export function allSlugs(): string[] {
  return POSTS.map((p) => p.slug);
}

export function sortedPosts(): Post[] {
  return [...POSTS].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export const POSTS: Post[] = [
  {
    slug: "how-to-save-your-own-instagram-reels",
    title: "How to Save Your Own Instagram Reels",
    seoTitle: "How to Save Your Own Instagram Reels (Step-by-Step)",
    description:
      "A clear, safe guide to saving Instagram Reels you created, using Instagram's built-in tools and your own original video files. No third-party tricks required.",
    date: "2026-01-08",
    category: "Saving & Backups",
    readingTime: "6 min read",
    intro: [
      `If you make Reels, your videos are part of your creative work, and it makes sense to keep your own copies. Whether you want a backup, a version to repost elsewhere, or the original to re-edit later, Instagram gives creators several legitimate ways to save content they published.`,
      `This guide walks through saving Reels <strong>you created and own</strong>, using Instagram's own features and your phone's tools. We will not cover ways to grab other people's videos, because that can break copyright law and Instagram's terms. Everything here is about your own content.`,
    ],
    sections: [
      {
        heading: "Save the original before you post",
        html: `<p>The cleanest copy of any Reel is the file that lived on your phone <em>before</em> you uploaded it. Once a video is processed by any platform, it gets re-compressed, which lowers quality. So the single most useful habit is keeping your source file.</p>
        <ul>
          <li>If you film inside the Instagram camera, tap the <strong>save/download icon</strong> after recording but before publishing, this stores the clip to your camera roll.</li>
          <li>If you film with your phone's normal camera app, the original is already in your gallery. Move it to a backup folder so you do not delete it later.</li>
          <li>If you edit in an app like CapCut or InShot, export a high-quality copy and keep it. That export is your master file.</li>
        </ul>`,
      },
      {
        heading: "Turn on automatic saving of your Reels",
        html: `<p>Instagram can automatically keep a copy of every Reel you share. This is the easiest long-term solution.</p>
        <ol>
          <li>Open your profile and tap the menu (three lines).</li>
          <li>Go to <strong>Settings and privacy</strong>.</li>
          <li>Find your Reels or sharing settings and enable <strong>"Save to camera roll"</strong> (the exact wording moves around between app versions).</li>
        </ol>
        <p>With this on, each Reel you publish lands in your gallery without watermarks you did not add yourself.</p>`,
      },
      {
        heading: "Download a Reel you already posted",
        html: `<p>If a Reel is already live and you forgot to save the source, you can still retrieve your own copy:</p>
        <ol>
          <li>Open the Reel from your own profile.</li>
          <li>Tap the <strong>three-dot menu</strong>.</li>
          <li>Choose <strong>Save</strong> or <strong>Download</strong> if it appears for your account.</li>
        </ol>
        <p>Availability depends on your region and account type, so if you do not see it, use the screen-recording method below as a fallback for your own content.</p>`,
      },
      {
        heading: "Use screen recording for your own clips",
        html: `<p>Both iPhone and Android can record the screen. For a Reel you own, this is a quick way to capture it when no download button is available.</p>
        <ul>
          <li><strong>iPhone:</strong> add Screen Recording to Control Center in Settings, then start it before playing your Reel full screen.</li>
          <li><strong>Android:</strong> swipe down to the quick settings panel and tap <strong>Screen Record</strong>.</li>
        </ul>
        <p>Trim the recording afterward so only the Reel remains. Quality will be lower than your source file, which is why keeping originals matters.</p>`,
      },
      {
        heading: "Organize and back up your saved Reels",
        html: `<p>Once you have copies, protect them. A simple routine:</p>
        <ul>
          <li>Create a cloud folder (Google Photos, iCloud, Drive) named "Reels Masters".</li>
          <li>Drop both the source export and the final Reel into it.</li>
          <li>Use our <a href="/blog/how-to-organize-your-short-form-video-library/">short-form library organization guide</a> to keep file names consistent.</li>
        </ul>
        <p>If you ever need to shrink files for sharing, the <a href="/tools/video-compressor/">Video Compressor</a> reduces size without you having to re-export from scratch.</p>`,
      },
    ],
    faqs: [
      {
        q: "Can I save Instagram Reels I did not create?",
        a: "Only with the creator's permission. Reels are protected by copyright, and saving or reposting someone else's video without consent can violate both the law and Instagram's terms. This guide is only about content you own.",
      },
      {
        q: "Why does my saved Reel look lower quality?",
        a: "Instagram compresses videos when they are uploaded and again when displayed. A copy pulled after posting is a compressed version. The best-quality file is always the original you exported before uploading.",
      },
      {
        q: "Does Instagram add a watermark when I save my own Reel?",
        a: "Reels saved through the in-app download feature may include a small Reels label. To avoid that, keep the original source file from before you posted, which has no platform watermark.",
      },
      {
        q: "Where do saved Reels go on my phone?",
        a: "They are stored in your camera roll or gallery, usually in a Reels or Instagram album. From there you can move them into a backup folder or cloud storage.",
      },
      {
        q: "Can I schedule automatic backups of my Reels?",
        a: "Yes. Turn on cloud photo backup (iCloud, Google Photos) so any Reel saved to your camera roll is copied to the cloud automatically. See our backup guide for a full routine.",
      },
    ],
    related: [
      { href: "/blog/how-to-backup-your-own-social-media-videos/", label: "How to back up your own social media videos" },
      { href: "/blog/how-to-create-a-reel-from-your-own-video/", label: "How to create a Reel from your own video" },
      { href: "/tools/video-compressor/", label: "Video Compressor tool" },
      { href: "/blog/best-video-size-for-instagram-reels/", label: "Best video size for Instagram Reels" },
    ],
  },
  {
    slug: "how-to-download-your-own-tiktok-videos",
    title: "How to Download Your Own TikTok Videos",
    seoTitle: "How to Download Your Own TikTok Videos (Safe Methods)",
    description:
      "Save the TikTok videos you created using TikTok's built-in download options and your own source files. A safe, creator-first guide with no third-party workarounds.",
    date: "2026-01-14",
    category: "Saving & Backups",
    readingTime: "6 min read",
    intro: [
      `Your TikToks are your work, and keeping copies is smart, for backups, for cross-posting, or simply so you do not lose months of content if something happens to your account. TikTok provides built-in ways to download videos you posted.`,
      `This guide covers downloading <strong>your own TikTok videos</strong> through official features and good file habits. It does not cover saving other creators' videos, which requires their permission and may breach copyright and TikTok's terms.`,
    ],
    sections: [
      {
        heading: "Save before you publish",
        html: `<p>As with any platform, the highest-quality copy is the file you had before uploading. TikTok re-encodes uploads, so the version on the app is already compressed.</p>
        <ul>
          <li>Edit and export your video in your editor first, then keep that export.</li>
          <li>When recording inside TikTok, you can still save the assembled clip to your device before posting in many versions of the app.</li>
        </ul>`,
      },
      {
        heading: "Download your posted video from the app",
        html: `<p>To pull a copy of a TikTok you already published:</p>
        <ol>
          <li>Open the video on your profile.</li>
          <li>Tap the <strong>Share</strong> arrow.</li>
          <li>Choose <strong>Save video</strong>.</li>
        </ol>
        <p>This saves the video to your gallery. Note that videos downloaded this way include the TikTok watermark and username, that is expected for the in-app save.</p>`,
      },
      {
        heading: "Use the data download tool for a full archive",
        html: `<p>TikTok lets you request a copy of your data, which can include the videos you posted. This is the most complete way to archive your own library.</p>
        <ol>
          <li>Go to <strong>Settings and privacy</strong>.</li>
          <li>Open <strong>Account</strong> &rarr; <strong>Download your data</strong>.</li>
          <li>Select the file format, request the file, then download it when it is ready (this can take a day or two).</li>
        </ol>`,
      },
      {
        heading: "Keep a clean, watermark-free master",
        html: `<p>The in-app download adds a watermark. If you want a clean version for reposting to your own other channels, the right approach is to keep your <strong>original export</strong> from your editor, not to strip a watermark from someone's video.</p>
        <p>Store that master file in a backup folder. If you need a different shape for another platform, use the <a href="/tools/video-resizer/">Video Resizer</a>, and check final dimensions with the <a href="/tools/video-metadata-checker/">Metadata Checker</a>.</p>`,
      },
      {
        heading: "Build a backup habit",
        html: `<p>Accounts can be lost, and trends fade, but your footage stays useful. A simple monthly routine:</p>
        <ul>
          <li>Request a data archive every few months.</li>
          <li>Save each new video's source export the day you post.</li>
          <li>Mirror everything to cloud storage.</li>
        </ul>
        <p>Our <a href="/blog/how-to-backup-your-own-social-media-videos/">backup guide</a> turns this into a repeatable system.</p>`,
      },
    ],
    faqs: [
      {
        q: "Can I download TikTok videos made by other people?",
        a: "Not without their permission. Other creators' videos are protected by copyright. This guide only covers downloading videos you created and own.",
      },
      {
        q: "How can I keep a clean copy of my own TikTok video?",
        a: "Keep the original export from your video editor before you upload it. That source file is your own clean master. We do not recommend or explain removing watermarks from posted videos.",
      },
      {
        q: "What is the TikTok data download?",
        a: "It is an official feature that lets you request a copy of your account information, which can include your posted videos. It is the most complete way to archive your own content.",
      },
      {
        q: "Why is my downloaded TikTok lower quality?",
        a: "TikTok compresses uploads. Any copy downloaded from the app is a compressed version. Your highest-quality file is the export you made before uploading.",
      },
      {
        q: "Can I save TikTok videos on a computer?",
        a: "Yes. You can request your data archive and download it on a desktop, or save your own posted video via the web app while signed in to your account.",
      },
    ],
    related: [
      { href: "/blog/best-video-format-for-tiktok/", label: "Best video format for TikTok" },
      { href: "/blog/how-to-resize-video-for-tiktok/", label: "How to resize video for TikTok" },
      { href: "/blog/how-to-backup-your-own-social-media-videos/", label: "Backing up your own videos" },
      { href: "/tools/video-resizer/", label: "Video Resizer tool" },
    ],
  },
  {
    slug: "how-to-save-facebook-reels-you-own",
    title: "How to Save Facebook Reels You Own",
    seoTitle: "How to Save Facebook Reels You Own (Step-by-Step)",
    description:
      "Keep copies of the Facebook Reels you created using Facebook's tools, your data archive, and good source-file habits. A safe, permission-first guide.",
    date: "2026-01-20",
    category: "Saving & Backups",
    readingTime: "6 min read",
    intro: [
      `Facebook Reels can reach a wide audience, and if you are publishing them you should keep your own copies. Backups protect you against accidental deletion, account issues, or simply wanting to repurpose a clip months later.`,
      `Below are safe ways to save <strong>Reels you created</strong> on Facebook. We do not cover downloading other people's videos, that needs their permission and can violate copyright and Facebook's terms.`,
    ],
    sections: [
      {
        heading: "Keep your source export first",
        html: `<p>The best copy of your Reel is the file you uploaded, before Facebook compressed it. Always export a master from your editor and store it before posting.</p>
        <ul>
          <li>Export at the highest reasonable quality your editor offers.</li>
          <li>Name the file clearly with a date and topic.</li>
          <li>Save it to a backup folder right away.</li>
        </ul>`,
      },
      {
        heading: "Save a posted Reel from the app",
        html: `<p>To retrieve a Reel you already shared:</p>
        <ol>
          <li>Open the Reel from your profile or Page.</li>
          <li>Tap the <strong>three-dot menu</strong>.</li>
          <li>Look for <strong>Save to device</strong> or <strong>Download</strong>.</li>
        </ol>
        <p>Availability varies by app version and region. If it is missing, use the data-archive method.</p>`,
      },
      {
        heading: "Request your information archive",
        html: `<p>Facebook's <strong>Download Your Information</strong> tool lets you export your content, including videos you posted.</p>
        <ol>
          <li>Open <strong>Settings &amp; privacy</strong> &rarr; <strong>Settings</strong>.</li>
          <li>Find <strong>Your information</strong> or <strong>Download your information</strong>.</li>
          <li>Select your posts/videos, choose a format and quality, then create the file.</li>
          <li>Download it once it is ready.</li>
        </ol>`,
      },
      {
        heading: "Re-use your Reel on other channels",
        html: `<p>Once you have your own master file, you can adapt it for other platforms. A landscape clip might need a vertical crop for Reels elsewhere, the <a href="/tools/video-resizer/">Video Resizer</a> and the <a href="/blog/how-to-convert-video-to-9-16/">9:16 conversion guide</a> handle that.</p>
        <p>To shrink a large file for messaging or email, run it through the <a href="/tools/video-compressor/">Video Compressor</a>.</p>`,
      },
      {
        heading: "Set up ongoing backups",
        html: `<p>Make saving automatic so you never lose a clip:</p>
        <ul>
          <li>Enable cloud photo backup on your phone.</li>
          <li>Export and store every Reel's master on posting day.</li>
          <li>Request a Facebook archive a few times a year.</li>
        </ul>`,
      },
    ],
    faqs: [
      {
        q: "Can I download other people's Facebook Reels?",
        a: "Only with their explicit permission. Reels are protected by copyright. This guide covers only Reels you created and own.",
      },
      {
        q: "What is Download Your Information?",
        a: "It is Facebook's official export tool. It lets you download a copy of your account content, including videos you posted, in your chosen format.",
      },
      {
        q: "Will my saved Reel have a watermark?",
        a: "In-app downloads may include a Reels label. To get a clean copy, keep the original file you exported before uploading.",
      },
      {
        q: "How long does the data archive take?",
        a: "Anywhere from a few minutes to a day or more, depending on how much content you request. Facebook notifies you when the file is ready to download.",
      },
      {
        q: "Can I save a Reel from a Page I manage?",
        a: "Yes, if you have the right permissions on that Page and own or have rights to the content. The same download and archive options generally apply.",
      },
    ],
    related: [
      { href: "/blog/how-to-backup-your-own-social-media-videos/", label: "Backing up your own videos" },
      { href: "/blog/how-to-convert-video-to-9-16/", label: "How to convert video to 9:16" },
      { href: "/tools/video-resizer/", label: "Video Resizer tool" },
      { href: "/tools/video-compressor/", label: "Video Compressor tool" },
    ],
  },
  {
    slug: "how-to-save-x-twitter-videos-you-have-permission-to-use",
    title: "How to Save X (Twitter) Videos You Have Permission to Use",
    seoTitle: "How to Save X (Twitter) Videos You Have Permission to Use",
    description:
      "A permission-first guide to saving videos on X (Twitter): your own posts, clips you have rights to, and how to confirm permission before you save anything.",
    date: "2026-01-27",
    category: "Saving & Backups",
    readingTime: "6 min read",
    intro: [
      `X (formerly Twitter) is full of video, but most of it belongs to someone. The safe, lawful approach is to save only videos <strong>you posted</strong> or videos you have <strong>clear permission</strong> to use. This guide focuses on doing exactly that.`,
      `We will cover how to keep copies of your own posts, how to confirm permission for someone else's clip, and good habits for storing what you save. We will not explain ways to grab protected content without consent.`,
    ],
    sections: [
      {
        heading: "Start with permission",
        html: `<p>Before saving any video that is not yours, get permission in writing. A short message works:</p>
        <blockquote><p>"Hi, may I download and reuse your video [link] for [purpose]? I'll credit you as [handle]."</p></blockquote>
        <p>Keep their reply. Our explainer on <a href="/blog/public-video-vs-copyright-permission/">public videos vs. copyright permission</a> explains why "it is public" does not mean "free to reuse".</p>`,
      },
      {
        heading: "Save your own posted video",
        html: `<p>For a video you posted, the most reliable copy is your original file. If you no longer have it, you can request your account archive:</p>
        <ol>
          <li>Open <strong>Settings</strong> &rarr; <strong>Your account</strong>.</li>
          <li>Choose <strong>Download an archive of your data</strong>.</li>
          <li>Confirm your identity and request the archive; download it when ready.</li>
        </ol>
        <p>The archive includes media from your posts, giving you copies of your own videos.</p>`,
      },
      {
        heading: "Keep originals of clips you create",
        html: `<p>If you film or edit clips before posting them to X, store those exports. They are higher quality than anything re-compressed by the platform, and you will not need to retrieve them later.</p>`,
      },
      {
        heading: "Saving a clip you have rights to",
        html: `<p>If a creator grants permission and sends you the file directly, that is the cleanest path. If they point you to a direct video file you are allowed to use, our <a href="/tools/direct-mp4-downloader/">Direct Video File Downloader</a> can save a direct <code>.mp4</code> link after you confirm you have permission. It does not work on platform page URLs, by design.</p>`,
      },
      {
        heading: "Store and label what you save",
        html: `<p>For anything you save with permission, record who gave it and when. A simple folder structure:</p>
        <ul>
          <li>One folder per source/creator.</li>
          <li>A text note with the permission message and date.</li>
          <li>The video file with a clear name.</li>
        </ul>
        <p>This protects you if questions come up later.</p>`,
      },
    ],
    faqs: [
      {
        q: "Can I save other people's videos I see on X?",
        a: "No. Most videos are protected by copyright. You should only save videos you posted yourself or ones you have explicit permission to use.",
      },
      {
        q: "Is a public video free to reuse?",
        a: "No. Public visibility is not the same as permission. The creator still holds copyright, so you need their consent to download and reuse their video.",
      },
      {
        q: "How do I get a copy of my own X videos?",
        a: "Request a data archive in your account settings, or keep the original files you uploaded. The archive includes media from your own posts.",
      },
      {
        q: "What counts as proof of permission?",
        a: "A written reply from the creator agreeing to your specific use, ideally naming the video and how you will use it. Save that message.",
      },
      {
        q: "Can your tool save any X link?",
        a: "No. The Direct Video File Downloader only accepts direct video file links and rejects social-media page URLs, including X. It is for files you own or have permission to use.",
      },
    ],
    related: [
      { href: "/blog/public-video-vs-copyright-permission/", label: "Public video vs. copyright permission" },
      { href: "/tools/direct-mp4-downloader/", label: "Direct Video File Downloader" },
      { href: "/blog/how-to-backup-your-own-social-media-videos/", label: "Backing up your own videos" },
      { href: "/blog/how-to-prepare-videos-for-upload/", label: "How to prepare videos for upload" },
    ],
  },
  {
    slug: "how-to-compress-video-for-whatsapp",
    title: "How to Compress Video for WhatsApp",
    seoTitle: "How to Compress Video for WhatsApp (Stay Under the Limit)",
    description:
      "WhatsApp limits video size, which can block your clips from sending. Learn how to compress a video you own so it sends fast and still looks good.",
    date: "2026-02-03",
    category: "Compression & Quality",
    readingTime: "6 min read",
    intro: [
      `WhatsApp caps the size of files you can send, so a long or high-resolution clip may refuse to go through, or get crushed into a blurry mess by automatic compression. The fix is to compress the video yourself first, on your terms, so you control the trade-off between size and quality.`,
      `This guide shows how to compress a video <strong>you own</strong> for WhatsApp, what settings matter, and how to use our free in-browser <a href="/tools/video-compressor/">Video Compressor</a> to do it without uploading your file anywhere.`,
    ],
    sections: [
      {
        heading: "Why WhatsApp struggles with big videos",
        html: `<p>WhatsApp is built for quick messaging, so it limits file size for media you share. When your video is over the limit, you either cannot send it or WhatsApp aggressively re-compresses it, which is why forwarded clips often look soft.</p>
        <p>Compressing first means you decide the quality, instead of letting the app degrade it automatically.</p>`,
      },
      {
        heading: "Settings that shrink a video most",
        html: `<p>Three levers control file size:</p>
        <table>
          <thead><tr><th>Setting</th><th>Effect on size</th><th>Good starting point</th></tr></thead>
          <tbody>
            <tr><td>Resolution</td><td>Large</td><td>720p for messaging</td></tr>
            <tr><td>Bitrate</td><td>Large</td><td>1-2 Mbps</td></tr>
            <tr><td>Length</td><td>Direct</td><td>Trim dead air</td></tr>
          </tbody>
        </table>
        <p>Dropping from 1080p to 720p alone often cuts size by roughly half with little visible loss on a phone screen.</p>`,
      },
      {
        heading: "Compress in your browser",
        html: `<p>Using our free tool, no upload required:</p>
        <ol>
          <li>Open the <a href="/tools/video-compressor/">Video Compressor</a>.</li>
          <li>Select the video you own.</li>
          <li>Pick a target quality or resolution.</li>
          <li>Process it and download the smaller file.</li>
        </ol>
        <p>Everything happens locally in your browser, so your video never leaves your device.</p>`,
      },
      {
        heading: "Check the result before sending",
        html: `<p>After compressing, confirm the new size and that it still looks acceptable. Drop the file into the <a href="/tools/video-metadata-checker/">Metadata Checker</a> to see the exact resolution and file size, then play it back to be sure the quality is fine for your audience.</p>`,
      },
      {
        heading: "Other ways to stay under the limit",
        html: `<ul>
          <li><strong>Trim first:</strong> remove the boring intro/outro seconds.</li>
          <li><strong>Split long videos:</strong> send in two parts.</li>
          <li><strong>Share a link:</strong> for very large files, upload to cloud storage and send the link instead.</li>
        </ul>
        <p>For a deeper look at shrinking files generally, see <a href="/blog/how-to-reduce-mp4-file-size/">how to reduce MP4 file size</a>.</p>`,
      },
    ],
    faqs: [
      {
        q: "What is WhatsApp's video size limit?",
        a: "WhatsApp limits the size of media you can send, and the exact cap can change over time and by platform. The safe approach is to compress large videos before sending so they fit comfortably.",
      },
      {
        q: "Will compressing ruin the quality?",
        a: "Not if you choose sensible settings. Dropping to 720p and a moderate bitrate keeps clips looking good on phones while cutting size significantly. You control the trade-off.",
      },
      {
        q: "Does your compressor upload my video?",
        a: "No. The Video Compressor processes your file directly in your browser. Your video is not uploaded to any server.",
      },
      {
        q: "Why does WhatsApp blur my videos?",
        a: "If a file is large, WhatsApp re-compresses it heavily to send it. Compressing yourself first lets you pick a higher-quality result than WhatsApp's automatic squeeze.",
      },
      {
        q: "Can I compress a video on my phone?",
        a: "Yes. Our browser-based compressor works on mobile browsers, so you can shrink a clip without installing an app.",
      },
    ],
    related: [
      { href: "/tools/video-compressor/", label: "Video Compressor tool" },
      { href: "/blog/how-to-reduce-mp4-file-size/", label: "How to reduce MP4 file size" },
      { href: "/blog/how-to-share-videos-without-losing-quality/", label: "Share videos without losing quality" },
      { href: "/tools/video-metadata-checker/", label: "Metadata Checker tool" },
    ],
  },
  {
    slug: "how-to-resize-video-for-instagram-reels",
    title: "How to Resize Video for Instagram Reels",
    seoTitle: "How to Resize Video for Instagram Reels (9:16 Guide)",
    description:
      "Resize your own video to the right 9:16 shape for Instagram Reels so nothing gets cropped or letterboxed. Step-by-step, with a free in-browser resizer.",
    date: "2026-02-10",
    category: "Sizing & Formats",
    readingTime: "6 min read",
    intro: [
      `Instagram Reels are vertical, and if you upload a square or landscape clip it gets awkwardly cropped or padded with bars. Resizing your video to the correct shape before posting keeps your framing intact and your content looking professional.`,
      `This guide explains the right dimensions for Reels and how to resize a video <strong>you own</strong> using our free in-browser <a href="/tools/video-resizer/">Video Resizer</a>, no uploads, no account.`,
    ],
    sections: [
      {
        heading: "The right size for Reels",
        html: `<p>Reels use a <strong>9:16 vertical</strong> aspect ratio. The recommended resolution is <strong>1080 × 1920</strong> pixels.</p>
        <table>
          <thead><tr><th>Property</th><th>Value</th></tr></thead>
          <tbody>
            <tr><td>Aspect ratio</td><td>9:16 (vertical)</td></tr>
            <tr><td>Resolution</td><td>1080 × 1920</td></tr>
            <tr><td>Orientation</td><td>Portrait</td></tr>
          </tbody>
        </table>
        <p>For more detail, see <a href="/blog/best-video-size-for-instagram-reels/">best video size for Instagram Reels</a>.</p>`,
      },
      {
        heading: "Decide: crop or fit",
        html: `<p>When you change a clip's shape you choose between two approaches:</p>
        <ul>
          <li><strong>Crop to fill:</strong> the frame fills the whole 9:16 canvas; edges of a wider video are cut off.</li>
          <li><strong>Fit with padding:</strong> the whole frame stays visible, with bars added above and below.</li>
        </ul>
        <p>For Reels, cropping to fill usually looks best, as long as your subject stays centered.</p>`,
      },
      {
        heading: "Resize step by step",
        html: `<ol>
          <li>Open the <a href="/tools/video-resizer/">Video Resizer</a>.</li>
          <li>Select your video file.</li>
          <li>Choose the <strong>9:16 (1080 × 1920)</strong> preset.</li>
          <li>Pick crop-to-fill or fit-with-padding.</li>
          <li>Process and download the result.</li>
        </ol>`,
      },
      {
        heading: "Frame your subject for vertical",
        html: `<p>Vertical video rewards tight, centered framing. Keep the important action in the middle third so it survives cropping. If you shot horizontally, you may need to re-center on the subject during the resize.</p>`,
      },
      {
        heading: "Verify before posting",
        html: `<p>Run the finished file through the <a href="/tools/video-metadata-checker/">Metadata Checker</a> to confirm it is exactly 1080 × 1920 and a reasonable file size, then preview it. See <a href="/blog/how-to-make-video-fit-instagram/">how to make video fit Instagram</a> for troubleshooting cropping issues.</p>`,
      },
    ],
    faqs: [
      {
        q: "What aspect ratio do Instagram Reels use?",
        a: "Reels are 9:16 vertical, with a recommended resolution of 1080 × 1920 pixels.",
      },
      {
        q: "What happens if I upload a landscape video to Reels?",
        a: "Instagram will crop or pad it to fit the vertical frame, which can cut off important parts or add bars. Resizing first keeps you in control of the framing.",
      },
      {
        q: "Should I crop or add bars?",
        a: "Crop-to-fill usually looks more polished for Reels, as long as your subject stays centered. Fit-with-padding preserves the whole frame but adds bars.",
      },
      {
        q: "Does resizing upload my video anywhere?",
        a: "No. The Video Resizer runs in your browser, so your file stays on your device.",
      },
      {
        q: "Can I resize a video on my phone?",
        a: "Yes. The resizer works in mobile browsers, so you can prepare a Reel directly from your phone.",
      },
    ],
    related: [
      { href: "/tools/video-resizer/", label: "Video Resizer tool" },
      { href: "/blog/best-video-size-for-instagram-reels/", label: "Best video size for Instagram Reels" },
      { href: "/blog/how-to-convert-video-to-9-16/", label: "How to convert video to 9:16" },
      { href: "/blog/how-to-make-video-fit-instagram/", label: "How to make video fit Instagram" },
    ],
  },
  {
    slug: "how-to-resize-video-for-tiktok",
    title: "How to Resize Video for TikTok",
    seoTitle: "How to Resize Video for TikTok (Full-Screen 9:16)",
    description:
      "Make your own video fill the TikTok screen by resizing it to 9:16. A simple, safe guide with a free browser-based resizer and the right dimensions.",
    date: "2026-02-16",
    category: "Sizing & Formats",
    readingTime: "5 min read",
    intro: [
      `TikTok is a full-screen vertical experience. A video that is not shaped for it gets bars or crops, which makes your content look out of place next to native clips. Resizing to the correct 9:16 shape fixes that.`,
      `Here is how to resize a video <strong>you own</strong> for TikTok using the free <a href="/tools/video-resizer/">Video Resizer</a>, plus the exact dimensions to target.`,
    ],
    sections: [
      {
        heading: "TikTok's ideal dimensions",
        html: `<p>TikTok uses <strong>9:16 vertical</strong> at <strong>1080 × 1920</strong> pixels. That fills the screen on most phones without bars.</p>
        <p>See <a href="/blog/best-video-format-for-tiktok/">best video format for TikTok</a> for codec and format details that pair with these dimensions.</p>`,
      },
      {
        heading: "Choose your fit",
        html: `<ul>
          <li><strong>Crop to fill</strong> for an edge-to-edge look.</li>
          <li><strong>Fit with padding</strong> when you must keep the entire frame visible (for example, on-screen text near the edges).</li>
        </ul>`,
      },
      {
        heading: "Resize in your browser",
        html: `<ol>
          <li>Open the <a href="/tools/video-resizer/">Video Resizer</a>.</li>
          <li>Add your file.</li>
          <li>Select the <strong>9:16 (1080 × 1920)</strong> preset.</li>
          <li>Process and download.</li>
        </ol>
        <p>No upload happens, the tool works locally in your browser.</p>`,
      },
      {
        heading: "Leave room for the interface",
        html: `<p>TikTok overlays buttons and captions on the right and bottom of the screen. Keep important visuals and text away from those zones so the interface does not cover them. Centering your subject is the safest choice.</p>`,
      },
      {
        heading: "Double-check the output",
        html: `<p>Confirm the result is 1080 × 1920 using the <a href="/tools/video-metadata-checker/">Metadata Checker</a>, then preview it before posting. If you are repurposing the same clip elsewhere, the <a href="/blog/how-to-convert-video-to-9-16/">9:16 conversion guide</a> covers other platforms too.</p>`,
      },
    ],
    faqs: [
      {
        q: "What size should a TikTok video be?",
        a: "9:16 vertical at 1080 × 1920 pixels fills the screen cleanly on most devices.",
      },
      {
        q: "Why does my TikTok have black bars?",
        a: "The video is not 9:16, so TikTok pads it to fit. Resizing to 1080 × 1920 removes the bars.",
      },
      {
        q: "Will resizing reduce quality?",
        a: "Resizing re-encodes the video, so choose a high-quality output. Starting from a good source file keeps the result sharp.",
      },
      {
        q: "Does the resizer upload my file?",
        a: "No. It runs entirely in your browser; your video stays on your device.",
      },
      {
        q: "Can I resize horizontal footage for TikTok?",
        a: "Yes. Crop to the central part of the frame, or fit the whole frame with padding. Keep your subject centered for the best result.",
      },
    ],
    related: [
      { href: "/tools/video-resizer/", label: "Video Resizer tool" },
      { href: "/blog/best-video-format-for-tiktok/", label: "Best video format for TikTok" },
      { href: "/blog/how-to-convert-video-to-9-16/", label: "How to convert video to 9:16" },
      { href: "/blog/video-aspect-ratio-guide/", label: "Video aspect ratio guide" },
    ],
  },
  {
    slug: "how-to-resize-video-for-youtube-shorts",
    title: "How to Resize Video for YouTube Shorts",
    seoTitle: "How to Resize Video for YouTube Shorts (9:16 in Minutes)",
    description:
      "Resize your own video to 9:16 so it qualifies as a YouTube Short and fills the screen. A clear guide with the right dimensions and a free browser resizer.",
    date: "2026-02-23",
    category: "Sizing & Formats",
    readingTime: "5 min read",
    intro: [
      `YouTube Shorts are vertical, short clips that show up in a dedicated feed. To be treated as a Short and to look right, your video should be vertical and within the Shorts length limit. Resizing a clip you own to 9:16 is the key step.`,
      `This guide covers the correct Shorts dimensions and how to resize a video <strong>you own</strong> with the free <a href="/tools/video-resizer/">Video Resizer</a>.`,
    ],
    sections: [
      {
        heading: "Shorts dimensions and length",
        html: `<p>Use <strong>9:16 vertical</strong> at <strong>1080 × 1920</strong>. Shorts also need to stay within the platform's short-form length limit, so keep clips brief.</p>
        <p>For codec and container choices, see <a href="/blog/best-video-format-for-youtube-shorts/">best video format for YouTube Shorts</a>.</p>`,
      },
      {
        heading: "Crop or pad?",
        html: `<p>As with other vertical platforms, you can crop a wider video to fill the frame, or fit it with bars. Cropping looks more native; padding preserves everything. Choose based on where your important visuals sit.</p>`,
      },
      {
        heading: "Resize step by step",
        html: `<ol>
          <li>Open the <a href="/tools/video-resizer/">Video Resizer</a>.</li>
          <li>Select your file.</li>
          <li>Pick the <strong>9:16 (1080 × 1920)</strong> preset.</li>
          <li>Process and download.</li>
        </ol>`,
      },
      {
        heading: "Mind the title and UI overlays",
        html: `<p>Shorts show a title, channel name, and buttons over the video. Keep your key content centered and away from the very bottom and right edge so overlays do not hide it.</p>`,
      },
      {
        heading: "Confirm and upload",
        html: `<p>Verify the output is 1080 × 1920 with the <a href="/tools/video-metadata-checker/">Metadata Checker</a>, then upload. Our <a href="/blog/how-to-prepare-videos-for-upload/">upload preparation guide</a> covers final checks before publishing.</p>`,
      },
    ],
    faqs: [
      {
        q: "What size is a YouTube Short?",
        a: "Vertical 9:16 at 1080 × 1920 pixels, kept within the platform's short-form length limit.",
      },
      {
        q: "How does YouTube know a video is a Short?",
        a: "YouTube treats vertical (or square) videos within the short length limit as Shorts. Resizing to 9:16 and keeping it short helps it qualify.",
      },
      {
        q: "Can I turn a long landscape video into a Short?",
        a: "Yes, trim it to a short highlight and resize it to 9:16. Keep your subject centered so cropping does not cut it off.",
      },
      {
        q: "Does the resizer keep my file private?",
        a: "Yes. It runs in your browser and does not upload your video to any server.",
      },
      {
        q: "What resolution is best for Shorts?",
        a: "1080 × 1920 is the recommended resolution. Higher is unnecessary for a phone-first format and only increases file size.",
      },
    ],
    related: [
      { href: "/tools/video-resizer/", label: "Video Resizer tool" },
      { href: "/blog/best-video-format-for-youtube-shorts/", label: "Best video format for YouTube Shorts" },
      { href: "/blog/how-to-convert-video-to-9-16/", label: "How to convert video to 9:16" },
      { href: "/blog/how-to-prepare-videos-for-upload/", label: "How to prepare videos for upload" },
    ],
  },
  {
    slug: "how-to-convert-video-to-9-16",
    title: "How to Convert Video to 9:16",
    seoTitle: "How to Convert Video to 9:16 (Vertical) the Right Way",
    description:
      "Convert a landscape or square video you own into a 9:16 vertical clip for Reels, TikTok, and Shorts. Learn crop vs. pad and use a free browser tool.",
    date: "2026-03-02",
    category: "Sizing & Formats",
    readingTime: "6 min read",
    intro: [
      `Almost every short-form platform, Reels, TikTok, Shorts, wants vertical 9:16 video. If you shot horizontally, you will need to convert. Done well, the result looks like it was filmed for vertical; done poorly, it looks cropped or boxed.`,
      `This guide explains the two conversion methods, when to use each, and how to convert a video <strong>you own</strong> with the free <a href="/tools/video-resizer/">Video Resizer</a>.`,
    ],
    sections: [
      {
        heading: "What 9:16 actually means",
        html: `<p>Aspect ratio describes the shape of the frame: width to height. <strong>9:16</strong> is taller than it is wide, the standard for phone-first video. At 1080 wide, that is 1920 tall (1080 × 1920).</p>
        <p>See the full <a href="/blog/video-aspect-ratio-guide/">aspect ratio guide</a> for how this compares to 16:9, 1:1, and 4:5.</p>`,
      },
      {
        heading: "Method 1: crop to fill",
        html: `<p>Crop-to-fill zooms in so your frame fills the entire vertical canvas, cutting off the left and right edges of a wide video. Best when your subject is centered and the edges are not essential.</p>
        <p><em>Example:</em> a 16:9 interview where the speaker is centered converts cleanly by cropping the empty sides.</p>`,
      },
      {
        heading: "Method 2: fit with padding",
        html: `<p>Fit-with-padding shrinks the whole frame to fit the width, adding bars (or a blurred background) above and below. Best when you cannot lose any part of the frame, slides, gameplay, or text near edges.</p>`,
      },
      {
        heading: "Convert with the resizer",
        html: `<ol>
          <li>Open the <a href="/tools/video-resizer/">Video Resizer</a>.</li>
          <li>Select your file.</li>
          <li>Choose the <strong>9:16</strong> preset and crop or fit.</li>
          <li>Process and download the vertical version.</li>
        </ol>
        <p>The conversion happens in your browser; nothing is uploaded.</p>`,
      },
      {
        heading: "Avoid quality loss",
        html: `<p>Converting re-encodes the video, so start from the best source you have and export at high quality. Then confirm dimensions in the <a href="/tools/video-metadata-checker/">Metadata Checker</a>. If you also need a smaller file, compress afterward with the <a href="/tools/video-compressor/">Video Compressor</a>.</p>`,
      },
    ],
    faqs: [
      {
        q: "What is 9:16 in pixels?",
        a: "At full HD it is 1080 × 1920. Any width-to-height ratio of 9 to 16 is 9:16, but 1080 × 1920 is the common standard.",
      },
      {
        q: "Should I crop or pad when converting?",
        a: "Crop-to-fill looks more native and fills the screen, but cuts the edges. Fit-with-padding keeps the whole frame but adds bars. Choose based on whether edge content is essential.",
      },
      {
        q: "Can I convert any video to 9:16?",
        a: "Yes, any video you own can be converted. Centered subjects convert best by cropping; busy or edge-heavy frames are safer with padding.",
      },
      {
        q: "Does converting reduce quality?",
        a: "Re-encoding always carries some loss. Starting from a high-quality source and exporting at high quality keeps the result sharp.",
      },
      {
        q: "Is the conversion private?",
        a: "Yes. The Video Resizer processes your file locally in the browser without uploading it.",
      },
    ],
    related: [
      { href: "/tools/video-resizer/", label: "Video Resizer tool" },
      { href: "/blog/video-aspect-ratio-guide/", label: "Video aspect ratio guide" },
      { href: "/blog/how-to-resize-video-for-instagram-reels/", label: "Resize for Instagram Reels" },
      { href: "/blog/how-to-resize-video-for-tiktok/", label: "Resize for TikTok" },
    ],
  },
  {
    slug: "how-to-extract-thumbnail-from-video",
    title: "How to Extract a Thumbnail From a Video",
    seoTitle: "How to Extract a Thumbnail From a Video (Free, In-Browser)",
    description:
      "Grab a still frame from a video you own and save it as an image for thumbnails or previews. A simple guide using a free browser-based extractor.",
    date: "2026-03-09",
    category: "Workflow",
    readingTime: "5 min read",
    intro: [
      `A strong thumbnail can make the difference between a video that gets watched and one that gets scrolled past. Often the best thumbnail is already inside your video, a single great frame. Extracting it as an image is quick and free.`,
      `This guide shows how to pull a still frame from a video <strong>you own</strong> using the free <a href="/tools/video-thumbnail-extractor/">Video Thumbnail Extractor</a>, and how to choose a frame that performs.`,
    ],
    sections: [
      {
        heading: "Why extract from the video itself",
        html: `<p>Using a frame from your own footage guarantees the thumbnail matches the content, no mismatch between promise and payoff. It is also instant and free, with no separate photo shoot needed.</p>`,
      },
      {
        heading: "Pick a frame that grabs attention",
        html: `<ul>
          <li>Look for a clear, well-lit moment with a face or a strong focal point.</li>
          <li>Avoid motion-blurred frames, pause on a still beat.</li>
          <li>Leave space if you plan to add text later.</li>
        </ul>`,
      },
      {
        heading: "Extract the thumbnail",
        html: `<ol>
          <li>Open the <a href="/tools/video-thumbnail-extractor/">Thumbnail Extractor</a>.</li>
          <li>Select your video.</li>
          <li>Scrub to the exact moment you want.</li>
          <li>Capture the frame and download it as a PNG or JPEG.</li>
        </ol>
        <p>The tool runs in your browser, so your video stays on your device.</p>`,
      },
      {
        heading: "Match the thumbnail to the platform",
        html: `<p>Different platforms display thumbnails at different shapes. A 16:9 thumbnail suits YouTube; vertical platforms show a cropped vertical preview. Capture a frame that still reads well when cropped, and check dimensions with the <a href="/tools/video-metadata-checker/">Metadata Checker</a>.</p>`,
      },
      {
        heading: "Polish if needed",
        html: `<p>Once you have the still, you can add text or adjust brightness in any image editor. Keep text large and high-contrast so it is legible at small sizes in a busy feed.</p>`,
      },
    ],
    faqs: [
      {
        q: "What image format should a thumbnail be?",
        a: "PNG keeps maximum quality and is great for graphics or text overlays; JPEG produces a smaller file for photographic frames. Both work for most platforms.",
      },
      {
        q: "Can I extract a frame on my phone?",
        a: "Yes. The Thumbnail Extractor works in mobile browsers, so you can capture a frame directly from your phone.",
      },
      {
        q: "Does extracting a frame upload my video?",
        a: "No. The tool reads the video locally in your browser and never uploads it.",
      },
      {
        q: "What resolution will the thumbnail be?",
        a: "It matches the video's frame resolution, for a 1080p video, the captured frame is 1920 × 1080 (or 1080 × 1920 if vertical).",
      },
      {
        q: "Can I use any video to make a thumbnail?",
        a: "Use videos you own or have permission to use. Extracting frames from someone else's video for your own use can raise copyright issues.",
      },
    ],
    related: [
      { href: "/tools/video-thumbnail-extractor/", label: "Thumbnail Extractor tool" },
      { href: "/tools/video-metadata-checker/", label: "Metadata Checker tool" },
      { href: "/blog/how-to-prepare-videos-for-upload/", label: "How to prepare videos for upload" },
      { href: "/blog/how-to-check-video-resolution-and-size/", label: "Check video resolution and size" },
    ],
  },
  {
    slug: "best-video-size-for-instagram-reels",
    title: "Best Video Size for Instagram Reels",
    seoTitle: "Best Video Size for Instagram Reels (Dimensions & Specs)",
    description:
      "The recommended resolution, aspect ratio, and length for Instagram Reels, plus tips to keep your own videos sharp and full-screen.",
    date: "2026-03-16",
    category: "Sizing & Formats",
    readingTime: "5 min read",
    intro: [
      `Getting the size right is the easiest way to make your Reels look professional. The wrong dimensions lead to cropping, bars, or soft footage. This guide lays out the recommended specs for Instagram Reels and how to hit them with your own videos.`,
      `Use these numbers as your target whenever you create or resize a Reel you own.`,
    ],
    sections: [
      {
        heading: "Recommended Reels specs",
        html: `<table>
          <thead><tr><th>Property</th><th>Recommended</th></tr></thead>
          <tbody>
            <tr><td>Aspect ratio</td><td>9:16 (vertical)</td></tr>
            <tr><td>Resolution</td><td>1080 × 1920</td></tr>
            <tr><td>Frame rate</td><td>30 fps (60 fps for fast motion)</td></tr>
            <tr><td>Format</td><td>MP4 (H.264 video, AAC audio)</td></tr>
          </tbody>
        </table>`,
      },
      {
        heading: "Why 1080 × 1920?",
        html: `<p>That resolution matches the 9:16 shape at full HD, which most phones display crisply. Going higher rarely helps because Instagram re-compresses uploads, and going lower makes footage look soft. 1080 × 1920 is the sweet spot.</p>`,
      },
      {
        heading: "Keep important content centered",
        html: `<p>Instagram overlays captions, the audio label, and buttons near the edges. Keep your subject and any text in the central area so nothing important is covered. Leaving a safe margin top and bottom helps.</p>`,
      },
      {
        heading: "Hit the specs with your own footage",
        html: `<p>If your clip is not 1080 × 1920, resize it with the <a href="/tools/video-resizer/">Video Resizer</a>, then confirm the result with the <a href="/tools/video-metadata-checker/">Metadata Checker</a>. To learn the resize workflow, read <a href="/blog/how-to-resize-video-for-instagram-reels/">how to resize video for Instagram Reels</a>.</p>`,
      },
      {
        heading: "Protect quality on upload",
        html: `<p>Upload on a strong connection, keep your file under a sensible size, and avoid re-compressing the same clip repeatedly. For why uploads sometimes look worse, see <a href="/blog/why-your-video-loses-quality-after-upload/">why your video loses quality after upload</a>.</p>`,
      },
    ],
    faqs: [
      {
        q: "What is the best resolution for Instagram Reels?",
        a: "1080 × 1920 pixels, which is full HD in a 9:16 vertical shape.",
      },
      {
        q: "What aspect ratio do Reels use?",
        a: "9:16 vertical. Square or landscape videos get cropped or padded to fit.",
      },
      {
        q: "What frame rate is best?",
        a: "30 fps works for most content. Use 60 fps for fast action or smooth motion.",
      },
      {
        q: "What file format should I upload?",
        a: "MP4 with H.264 video and AAC audio is the most compatible choice for Reels.",
      },
      {
        q: "How long can a Reel be?",
        a: "Reels support a range of lengths, and the maximum changes over time. Keep clips tight and engaging regardless of the cap.",
      },
    ],
    related: [
      { href: "/blog/how-to-resize-video-for-instagram-reels/", label: "How to resize video for Instagram Reels" },
      { href: "/tools/video-resizer/", label: "Video Resizer tool" },
      { href: "/blog/video-aspect-ratio-guide/", label: "Video aspect ratio guide" },
      { href: "/blog/why-your-video-loses-quality-after-upload/", label: "Why video loses quality after upload" },
    ],
  },
  {
    slug: "best-video-format-for-tiktok",
    title: "Best Video Format for TikTok",
    seoTitle: "Best Video Format for TikTok (MP4, Resolution & Codec)",
    description:
      "The ideal format, codec, resolution, and frame rate for TikTok uploads, so your own videos look sharp and upload smoothly.",
    date: "2026-03-23",
    category: "Sizing & Formats",
    readingTime: "5 min read",
    intro: [
      `TikTok accepts several formats, but a few choices consistently give the best quality and the smoothest uploads. Getting the format right means fewer surprises and sharper video in the feed.`,
      `Here are the recommended format settings for TikTok and how to make sure your own videos meet them.`,
    ],
    sections: [
      {
        heading: "Recommended TikTok format",
        html: `<table>
          <thead><tr><th>Property</th><th>Recommended</th></tr></thead>
          <tbody>
            <tr><td>Container</td><td>MP4</td></tr>
            <tr><td>Video codec</td><td>H.264</td></tr>
            <tr><td>Audio codec</td><td>AAC</td></tr>
            <tr><td>Resolution</td><td>1080 × 1920 (9:16)</td></tr>
            <tr><td>Frame rate</td><td>30 fps (60 fps for motion)</td></tr>
          </tbody>
        </table>`,
      },
      {
        heading: "Why MP4 + H.264",
        html: `<p>MP4 with H.264 is the most widely supported combination across phones and platforms. It balances quality and file size well, uploads reliably, and is what TikTok handles best. MOV files also work but tend to be larger, see <a href="/blog/mp4-vs-mov-for-social-media/">MP4 vs. MOV for social media</a>.</p>`,
      },
      {
        heading: "Resolution and frame rate",
        html: `<p>Stick to 1080 × 1920 for full-screen vertical. Use 30 fps for talking, tutorials, and most content; 60 fps suits fast movement like sports or gaming. Higher resolutions add size without visible benefit on phones.</p>`,
      },
      {
        heading: "Convert your file if needed",
        html: `<p>If your video is a different format or shape, fix it before uploading. Use the <a href="/tools/video-resizer/">Video Resizer</a> for dimensions and the <a href="/tools/video-compressor/">Video Compressor</a> to manage size, then confirm everything with the <a href="/tools/video-metadata-checker/">Metadata Checker</a>.</p>`,
      },
      {
        heading: "Upload tips",
        html: `<p>Upload over a stable connection and avoid sending an already-compressed clip through multiple apps first, since each pass lowers quality. Read <a href="/blog/how-to-prepare-videos-for-upload/">how to prepare videos for upload</a> for a full checklist.</p>`,
      },
    ],
    faqs: [
      {
        q: "What format does TikTok prefer?",
        a: "MP4 with H.264 video and AAC audio is the most reliable and widely supported choice.",
      },
      {
        q: "What resolution is best for TikTok?",
        a: "1080 × 1920 (9:16 vertical) fills the screen and looks sharp on phones.",
      },
      {
        q: "Should I upload 30 or 60 fps?",
        a: "30 fps is fine for most content. Use 60 fps for fast motion where smoothness matters.",
      },
      {
        q: "Can I upload a MOV file to TikTok?",
        a: "Usually yes, but MOV files are often larger. Converting to MP4/H.264 keeps quality while reducing size.",
      },
      {
        q: "Why does my TikTok look blurry after uploading?",
        a: "TikTok compresses uploads. Starting from a high-quality 1080 × 1920 MP4 and a strong connection minimizes the loss.",
      },
    ],
    related: [
      { href: "/blog/mp4-vs-mov-for-social-media/", label: "MP4 vs. MOV for social media" },
      { href: "/blog/how-to-resize-video-for-tiktok/", label: "How to resize video for TikTok" },
      { href: "/tools/video-compressor/", label: "Video Compressor tool" },
      { href: "/blog/how-to-prepare-videos-for-upload/", label: "How to prepare videos for upload" },
    ],
  },
  {
    slug: "best-video-format-for-youtube-shorts",
    title: "Best Video Format for YouTube Shorts",
    seoTitle: "Best Video Format for YouTube Shorts (Specs & Codec)",
    description:
      "The recommended container, codec, resolution, and frame rate for YouTube Shorts so your own clips look their best in the Shorts feed.",
    date: "2026-03-30",
    category: "Sizing & Formats",
    readingTime: "5 min read",
    intro: [
      `YouTube Shorts share the same vertical, short-form DNA as Reels and TikTok, but YouTube's pipeline rewards clean, high-quality source files. Picking the right format helps your Short look crisp after YouTube processes it.`,
      `Here are the recommended format settings and how to prepare your own clips to match.`,
    ],
    sections: [
      {
        heading: "Recommended Shorts format",
        html: `<table>
          <thead><tr><th>Property</th><th>Recommended</th></tr></thead>
          <tbody>
            <tr><td>Container</td><td>MP4</td></tr>
            <tr><td>Video codec</td><td>H.264</td></tr>
            <tr><td>Audio codec</td><td>AAC</td></tr>
            <tr><td>Resolution</td><td>1080 × 1920 (9:16)</td></tr>
            <tr><td>Frame rate</td><td>30 or 60 fps</td></tr>
          </tbody>
        </table>`,
      },
      {
        heading: "Quality in, quality out",
        html: `<p>YouTube re-encodes every upload. The higher the quality of your source, within reason, the better the processed Short looks. A clean 1080 × 1920 H.264 file is the practical sweet spot.</p>`,
      },
      {
        heading: "Keep it vertical and short",
        html: `<p>To be treated as a Short, the video should be vertical (or square) and within the short-form length limit. Resize horizontal footage with the <a href="/tools/video-resizer/">Video Resizer</a> first.</p>`,
      },
      {
        heading: "Match the format with your tools",
        html: `<p>Confirm your file is MP4/H.264 at 1080 × 1920 using the <a href="/tools/video-metadata-checker/">Metadata Checker</a>. If the file is too large, compress it with the <a href="/tools/video-compressor/">Video Compressor</a> before uploading.</p>`,
      },
      {
        heading: "Audio matters too",
        html: `<p>Shorts are often watched with sound. Keep audio in AAC at a clear level, and avoid clipping. Good audio keeps viewers watching as much as good video.</p>`,
      },
    ],
    faqs: [
      {
        q: "What format is best for YouTube Shorts?",
        a: "MP4 with H.264 video and AAC audio at 1080 × 1920 vertical.",
      },
      {
        q: "What resolution should a Short be?",
        a: "1080 × 1920 (9:16). Higher resolutions are unnecessary for a phone-first format.",
      },
      {
        q: "30 fps or 60 fps for Shorts?",
        a: "Both work. Use 60 fps for fast motion and 30 fps for talking-head or tutorial content.",
      },
      {
        q: "Does YouTube reduce quality on Shorts?",
        a: "YouTube re-encodes uploads, so some compression is unavoidable. A high-quality source file gives the best processed result.",
      },
      {
        q: "How do I make sure my video counts as a Short?",
        a: "Keep it vertical or square and within the short-form length limit. Resizing to 9:16 and trimming to a short highlight helps it qualify.",
      },
    ],
    related: [
      { href: "/blog/how-to-resize-video-for-youtube-shorts/", label: "Resize video for YouTube Shorts" },
      { href: "/tools/video-metadata-checker/", label: "Metadata Checker tool" },
      { href: "/blog/mp4-vs-mov-for-social-media/", label: "MP4 vs. MOV for social media" },
      { href: "/blog/how-to-prepare-videos-for-upload/", label: "How to prepare videos for upload" },
    ],
  },
  {
    slug: "how-to-reduce-mp4-file-size",
    title: "How to Reduce MP4 File Size",
    seoTitle: "How to Reduce MP4 File Size (Without Wrecking Quality)",
    description:
      "Practical ways to shrink an MP4 you own, resolution, bitrate, trimming, using a free in-browser compressor. Keep quality while cutting size.",
    date: "2026-04-06",
    category: "Compression & Quality",
    readingTime: "6 min read",
    intro: [
      `A large MP4 can be hard to email, slow to upload, and impossible to send on chat apps. The good news: most videos can be made dramatically smaller with only a small, often invisible, drop in quality, if you adjust the right settings.`,
      `This guide explains what makes an MP4 big and how to reduce the size of a file <strong>you own</strong> using the free in-browser <a href="/tools/video-compressor/">Video Compressor</a>.`,
    ],
    sections: [
      {
        heading: "What makes an MP4 large",
        html: `<p>Three factors dominate file size:</p>
        <ul>
          <li><strong>Resolution</strong>: more pixels means more data (4K is roughly four times the pixels of 1080p).</li>
          <li><strong>Bitrate</strong>: how much data is used per second; higher bitrate means bigger files.</li>
          <li><strong>Length</strong>: longer videos are simply bigger.</li>
        </ul>`,
      },
      {
        heading: "Lower the resolution",
        html: `<p>If you do not need 4K or even 1080p, stepping down is the single biggest win. For phone viewing, 720p is often indistinguishable from 1080p and far smaller. The <a href="/tools/video-resizer/">Video Resizer</a> can change resolution if you also need a new shape.</p>`,
      },
      {
        heading: "Reduce the bitrate",
        html: `<p>Lowering bitrate is the most direct way to shrink a file at the same resolution. Drop it until you notice quality loss, then step back up slightly. Our compressor lets you choose a quality target so you do not have to guess raw numbers.</p>`,
      },
      {
        heading: "Trim what you do not need",
        html: `<p>Cutting the dead space at the start and end, or removing slow sections, reduces both length and size. Shorter, tighter videos also tend to perform better.</p>`,
      },
      {
        heading: "Compress in your browser",
        html: `<ol>
          <li>Open the <a href="/tools/video-compressor/">Video Compressor</a>.</li>
          <li>Select your MP4.</li>
          <li>Choose a quality or resolution target.</li>
          <li>Process and download the smaller file.</li>
        </ol>
        <p>Then verify the new size in the <a href="/tools/video-metadata-checker/">Metadata Checker</a>. For messaging-specific tips, see <a href="/blog/how-to-compress-video-for-whatsapp/">how to compress video for WhatsApp</a>.</p>`,
      },
    ],
    faqs: [
      {
        q: "How can I make an MP4 smaller without losing quality?",
        a: "Lower the resolution to what you actually need, reduce the bitrate until just before quality drops, and trim unused footage. Together these shrink files with minimal visible loss.",
      },
      {
        q: "Does lowering resolution always reduce size?",
        a: "Yes, fewer pixels means less data. Going from 1080p to 720p typically cuts size substantially while still looking good on phones.",
      },
      {
        q: "What bitrate should I use?",
        a: "It depends on resolution and content. Rather than guessing numbers, use a quality target in the compressor and compare the result to the original.",
      },
      {
        q: "Will the compressor upload my video?",
        a: "No. It processes the file in your browser, so your video stays on your device.",
      },
      {
        q: "Can I compress a video more than once?",
        a: "You can, but each pass loses some quality. It is better to compress once from your best source than to repeatedly re-compress.",
      },
    ],
    related: [
      { href: "/tools/video-compressor/", label: "Video Compressor tool" },
      { href: "/blog/how-to-compress-video-for-whatsapp/", label: "Compress video for WhatsApp" },
      { href: "/blog/how-to-share-videos-without-losing-quality/", label: "Share videos without losing quality" },
      { href: "/tools/video-metadata-checker/", label: "Metadata Checker tool" },
    ],
  },
  {
    slug: "how-to-make-video-fit-instagram",
    title: "How to Make a Video Fit Instagram",
    seoTitle: "How to Make a Video Fit Instagram (Feed, Reels & Stories)",
    description:
      "Stop Instagram from cropping your video. Learn the right sizes for feed, Reels, and Stories and how to resize your own clips to fit each one.",
    date: "2026-04-13",
    category: "Sizing & Formats",
    readingTime: "6 min read",
    intro: [
      `Instagram has several video placements, feed, Reels, Stories, and each expects a different shape. Upload the wrong one and your video gets cropped or boxed in with bars. Making your video fit means matching the placement before you post.`,
      `This guide maps the right sizes for each Instagram surface and shows how to resize a video <strong>you own</strong> to fit, using the free <a href="/tools/video-resizer/">Video Resizer</a>.`,
    ],
    sections: [
      {
        heading: "Instagram's video shapes",
        html: `<table>
          <thead><tr><th>Placement</th><th>Aspect ratio</th><th>Resolution</th></tr></thead>
          <tbody>
            <tr><td>Reels</td><td>9:16</td><td>1080 × 1920</td></tr>
            <tr><td>Stories</td><td>9:16</td><td>1080 × 1920</td></tr>
            <tr><td>Feed (vertical)</td><td>4:5</td><td>1080 × 1350</td></tr>
            <tr><td>Feed (square)</td><td>1:1</td><td>1080 × 1080</td></tr>
          </tbody>
        </table>`,
      },
      {
        heading: "Why your video gets cropped",
        html: `<p>If a clip does not match the placement's aspect ratio, Instagram trims it to fit (or adds bars). A 16:9 landscape video in a 4:5 feed slot loses its sides. Resizing to the target ratio first stops the surprise crop.</p>`,
      },
      {
        heading: "Resize to fit a placement",
        html: `<ol>
          <li>Decide where the video will go (Reels, Stories, or feed).</li>
          <li>Open the <a href="/tools/video-resizer/">Video Resizer</a> and select your file.</li>
          <li>Pick the matching preset (9:16, 4:5, or 1:1).</li>
          <li>Choose crop-to-fill or fit-with-padding.</li>
          <li>Process and download.</li>
        </ol>`,
      },
      {
        heading: "Keep your subject safe",
        html: `<p>Whatever ratio you choose, keep the important content centered so it survives any cropping. For vertical placements, also keep text away from the very top and bottom where the interface sits.</p>`,
      },
      {
        heading: "Confirm before posting",
        html: `<p>Check the output dimensions with the <a href="/tools/video-metadata-checker/">Metadata Checker</a>. For Reels specifically, see <a href="/blog/how-to-resize-video-for-instagram-reels/">how to resize video for Instagram Reels</a>.</p>`,
      },
    ],
    faqs: [
      {
        q: "What aspect ratio does Instagram feed use?",
        a: "Vertical feed videos use 4:5 (1080 × 1350); square uses 1:1 (1080 × 1080). Reels and Stories use 9:16 (1080 × 1920).",
      },
      {
        q: "Why is Instagram cropping my video?",
        a: "Because the video's shape does not match the placement. Resizing to the correct aspect ratio before posting prevents cropping.",
      },
      {
        q: "Can I fit a landscape video without cropping?",
        a: "Yes, choose fit-with-padding so the whole frame stays visible with bars added. Crop-to-fill looks cleaner but trims the edges.",
      },
      {
        q: "What size is best for Instagram Stories?",
        a: "9:16 vertical at 1080 × 1920, the same as Reels.",
      },
      {
        q: "Does resizing keep my video private?",
        a: "Yes. The Video Resizer runs in your browser and does not upload your file.",
      },
    ],
    related: [
      { href: "/tools/video-resizer/", label: "Video Resizer tool" },
      { href: "/blog/how-to-resize-video-for-instagram-reels/", label: "Resize video for Instagram Reels" },
      { href: "/blog/video-aspect-ratio-guide/", label: "Video aspect ratio guide" },
      { href: "/blog/best-video-size-for-instagram-reels/", label: "Best video size for Instagram Reels" },
    ],
  },
  {
    slug: "how-to-create-a-reel-from-your-own-video",
    title: "How to Create a Reel From Your Own Video",
    seoTitle: "How to Create a Reel From Your Own Video (Start to Finish)",
    description:
      "Turn footage you own into a polished Instagram Reel: trim, resize to 9:16, add a thumbnail, and prepare the file. A complete creator workflow.",
    date: "2026-04-20",
    category: "Workflow",
    readingTime: "6 min read",
    intro: [
      `You do not need fancy gear to make a strong Reel, you need a good clip and a clean workflow. If you already have footage you own, turning it into a Reel is mostly about shaping, trimming, and preparing it well.`,
      `This guide walks through the full process using free in-browser tools, all on videos <strong>you own</strong>.`,
    ],
    sections: [
      {
        heading: "Start with a clip worth posting",
        html: `<p>Pick footage with a clear hook in the first second or two. Reels live or die on the opening moment, so lead with the most interesting part rather than a slow intro.</p>`,
      },
      {
        heading: "Trim to the essentials",
        html: `<p>Cut everything that does not move the clip forward. A tight 15-30 second Reel usually outperforms a rambling one. Trim in any editor, then export a high-quality master to keep.</p>`,
      },
      {
        heading: "Resize to 9:16",
        html: `<p>Reels are vertical. Use the <a href="/tools/video-resizer/">Video Resizer</a> to convert your clip to 1080 × 1920, choosing crop-to-fill for a full-screen look. See <a href="/blog/how-to-convert-video-to-9-16/">how to convert video to 9:16</a> if you are starting from landscape footage.</p>`,
      },
      {
        heading: "Pick a thumbnail",
        html: `<p>Grab a strong still from the clip with the <a href="/tools/video-thumbnail-extractor/">Thumbnail Extractor</a> to use as a cover image. A clear, bright frame helps your Reel stand out on your profile grid.</p>`,
      },
      {
        heading: "Prepare and check the file",
        html: `<p>Compress if the file is large using the <a href="/tools/video-compressor/">Video Compressor</a>, then confirm dimensions and size in the <a href="/tools/video-metadata-checker/">Metadata Checker</a>. Finally, follow <a href="/blog/how-to-prepare-videos-for-upload/">how to prepare videos for upload</a> before posting.</p>`,
      },
    ],
    faqs: [
      {
        q: "How long should a Reel be?",
        a: "A tight 15-30 seconds works well for most content. Lead with your strongest moment to hook viewers immediately.",
      },
      {
        q: "What size should the Reel be?",
        a: "9:16 vertical at 1080 × 1920. Resize landscape or square footage before posting.",
      },
      {
        q: "Do I need editing software?",
        a: "Basic trimming can be done in your phone's gallery or a free editor, and our browser tools handle resizing, thumbnails, compression, and checking.",
      },
      {
        q: "Can I make a Reel from old footage?",
        a: "Yes, as long as you own it or have permission. Trim a highlight, resize to 9:16, and you have a Reel.",
      },
      {
        q: "How do I keep the quality high?",
        a: "Start from the best source file, resize and compress only once, and upload on a strong connection.",
      },
    ],
    related: [
      { href: "/tools/video-resizer/", label: "Video Resizer tool" },
      { href: "/tools/video-thumbnail-extractor/", label: "Thumbnail Extractor tool" },
      { href: "/blog/how-to-convert-video-to-9-16/", label: "How to convert video to 9:16" },
      { href: "/blog/how-to-prepare-videos-for-upload/", label: "How to prepare videos for upload" },
    ],
  },
  {
    slug: "how-to-backup-your-own-social-media-videos",
    title: "How to Back Up Your Own Social Media Videos",
    seoTitle: "How to Back Up Your Own Social Media Videos (Simple System)",
    description:
      "Build a reliable backup routine for the videos you create on Instagram, TikTok, Facebook, and more, using official archives and cloud storage.",
    date: "2026-04-27",
    category: "Saving & Backups",
    readingTime: "6 min read",
    intro: [
      `Creators pour real effort into their videos, yet many keep their only copies inside apps they do not control. Accounts can be locked, content removed, or phones lost. A simple backup system protects months of work.`,
      `This guide builds a repeatable routine for backing up videos <strong>you created</strong>, using official tools and cloud storage, no third-party scraping involved.`,
    ],
    sections: [
      {
        heading: "Save source files on posting day",
        html: `<p>The best backup is the original export. Make it a habit: every time you post, drop the master file into a dedicated folder. These pre-upload files are higher quality than anything you can pull back from a platform.</p>`,
      },
      {
        heading: "Use each platform's official archive",
        html: `<p>Major platforms let you download your own content:</p>
        <ul>
          <li><strong>TikTok:</strong> Download your data in settings.</li>
          <li><strong>Facebook/Instagram:</strong> Download Your Information.</li>
          <li><strong>X:</strong> Download an archive of your data.</li>
        </ul>
        <p>See the platform-specific guides for <a href="/blog/how-to-download-your-own-tiktok-videos/">TikTok</a>, <a href="/blog/how-to-save-facebook-reels-you-own/">Facebook</a>, and <a href="/blog/how-to-save-your-own-instagram-reels/">Instagram</a>.</p>`,
      },
      {
        heading: "Mirror to the cloud automatically",
        html: `<p>Turn on automatic photo/video backup (iCloud, Google Photos, OneDrive) so anything saved to your camera roll is copied to the cloud without thinking about it. Keep a second copy on a computer or external drive for true redundancy.</p>`,
      },
      {
        heading: "Organize so you can find things",
        html: `<p>A folder per platform, then per month, with clear file names, makes your archive usable. Our <a href="/blog/how-to-organize-your-short-form-video-library/">library organization guide</a> covers a naming system that scales.</p>`,
      },
      {
        heading: "Keep file sizes manageable",
        html: `<p>Archives grow fast. For older clips you only need as records, you can compress copies with the <a href="/tools/video-compressor/">Video Compressor</a> to save space, while keeping masters of your best work at full quality.</p>`,
      },
    ],
    faqs: [
      {
        q: "What is the best way to back up my videos?",
        a: "Keep source exports on posting day, request official data archives periodically, and mirror everything to cloud storage plus one local copy.",
      },
      {
        q: "Can I download my own videos from each platform?",
        a: "Yes. TikTok, Facebook, Instagram, and X all offer official data-download tools that include your posted media.",
      },
      {
        q: "How often should I back up?",
        a: "Save source files every time you post, and request platform archives every few months as a safety net.",
      },
      {
        q: "Do I need both cloud and local backups?",
        a: "Ideally yes. Two copies in different places protect against losing one. This is sometimes called the 3-2-1 backup approach.",
      },
      {
        q: "How do I save space on old backups?",
        a: "Compress archival copies of older clips while keeping full-quality masters of your most important videos.",
      },
    ],
    related: [
      { href: "/blog/how-to-download-your-own-tiktok-videos/", label: "Download your own TikTok videos" },
      { href: "/blog/how-to-save-your-own-instagram-reels/", label: "Save your own Instagram Reels" },
      { href: "/blog/how-to-organize-your-short-form-video-library/", label: "Organize your video library" },
      { href: "/tools/video-compressor/", label: "Video Compressor tool" },
    ],
  },
  {
    slug: "public-video-vs-copyright-permission",
    title: "Public Video vs. Copyright Permission: What You Can Actually Reuse",
    seoTitle: "Public Video vs. Copyright Permission (What You Can Reuse)",
    description:
      "A video being public does not make it free to reuse. Understand copyright, permission, fair use limits, and how to ask for rights the right way.",
    date: "2026-05-04",
    category: "Copyright & Safety",
    readingTime: "7 min read",
    intro: [
      `One of the most common, and most expensive, misunderstandings online is that "public" means "free to use." It does not. A video posted publicly is still owned by its creator, and reusing it without permission can lead to takedowns, strikes, or legal trouble.`,
      `This guide explains the difference between something being visible and being free to reuse, and how to get permission properly. It is educational, not legal advice.`,
    ],
    sections: [
      {
        heading: "Public visibility is not a license",
        html: `<p>When someone posts a video, copyright is automatic, they own it the moment it is created. Making it public lets people watch it on the platform; it does not grant you the right to download, copy, edit, or repost it. Those are separate permissions the owner controls.</p>`,
      },
      {
        heading: "What copyright actually protects",
        html: `<p>Copyright covers the creative work itself: the footage, edit, music, and audio. Reusing any of it, even a few seconds, generally needs permission unless a specific exception applies. Platform terms of service add another layer of rules on top of copyright law.</p>`,
      },
      {
        heading: "Fair use and similar exceptions are narrow",
        html: `<p>Some regions allow limited use for commentary, criticism, news, or education ("fair use" in the US, "fair dealing" elsewhere). These are fact-specific, often misunderstood, and not a blanket permission. Relying on them without understanding the limits is risky. When in doubt, ask for permission.</p>`,
      },
      {
        heading: "How to get permission the right way",
        html: `<p>A short, clear request protects everyone:</p>
        <blockquote><p>"Hi [name], I'd like to use your video [link] for [specific purpose, where it will appear]. Could I have your permission, and how would you like to be credited?"</p></blockquote>
        <p>Save their written reply. Keep a record of what was approved and when.</p>`,
      },
      {
        heading: "Stick to what you own or are allowed to use",
        html: `<p>The safest approach is to build with your own footage or properly licensed material. Our tools and guides are designed for exactly that, videos you own or have permission to use. See <a href="/blog/how-to-save-x-twitter-videos-you-have-permission-to-use/">saving videos you have permission to use</a> for a practical example.</p>`,
      },
    ],
    faqs: [
      {
        q: "If a video is public, can I download and reuse it?",
        a: "No. Public visibility lets you watch it; it does not grant rights to download, edit, or repost. The creator still holds copyright, so you need permission.",
      },
      {
        q: "Does crediting the creator make it legal?",
        a: "Not by itself. Credit is good practice, but it does not replace permission. You still need the owner's consent to reuse their work.",
      },
      {
        q: "What about fair use?",
        a: "Fair use and similar doctrines are narrow, region-specific exceptions for purposes like commentary or education. They are fact-dependent and easy to misjudge, so do not treat them as blanket permission.",
      },
      {
        q: "How do I get permission to use someone's video?",
        a: "Message the creator with the specific video, your intended use, and where it will appear. Ask how they want to be credited, and save their written reply.",
      },
      {
        q: "Is this legal advice?",
        a: "No. This is general educational information. For decisions with legal or financial stakes, consult a qualified attorney in your region.",
      },
    ],
    related: [
      { href: "/blog/how-to-save-x-twitter-videos-you-have-permission-to-use/", label: "Saving videos you have permission to use" },
      { href: "/dmca/", label: "DMCA & copyright takedowns" },
      { href: "/disclaimer/", label: "Disclaimer" },
      { href: "/terms/", label: "Terms of Use" },
    ],
  },
  {
    slug: "how-to-share-videos-without-losing-quality",
    title: "How to Share Videos Without Losing Quality",
    seoTitle: "How to Share Videos Without Losing Quality (Practical Tips)",
    description:
      "Messaging apps and email crush video quality. Learn how to share clips you own at full quality using links, the right files, and smart compression.",
    date: "2026-05-11",
    category: "Compression & Quality",
    readingTime: "6 min read",
    intro: [
      `Ever sent a crisp video to a friend, only for it to arrive blurry? That is because most messaging apps and email services aggressively compress attachments. The fix is to control how the file travels, so quality survives the trip.`,
      `This guide covers practical ways to share videos <strong>you own</strong> while keeping them sharp.`,
    ],
    sections: [
      {
        heading: "Why sharing degrades video",
        html: `<p>Chat apps and email are optimized for speed and small files, so they re-compress videos automatically. Each re-compression throws away detail. Send the same clip through two apps and the loss stacks up.</p>`,
      },
      {
        heading: "Share a link instead of a file",
        html: `<p>The most reliable way to preserve quality is to upload your video to cloud storage (Drive, iCloud, Dropbox) and share a <strong>link</strong>. The recipient downloads the exact file you uploaded, with no app re-compression in between.</p>`,
      },
      {
        heading: "Use the right file before sharing",
        html: `<p>If you must send a file directly, start from a properly sized, single-compressed version. Use the <a href="/tools/video-compressor/">Video Compressor</a> once to reach a size the app accepts, rather than letting the app squeeze a huge file unpredictably. See <a href="/blog/how-to-compress-video-for-whatsapp/">compressing for WhatsApp</a>.</p>`,
      },
      {
        heading: "Look for a quality or document option",
        html: `<p>Some apps offer an "HD" toggle or a "send as document/file" option that skips re-compression. Where available, these preserve far more quality than the default media share.</p>`,
      },
      {
        heading: "Confirm what the recipient gets",
        html: `<p>Before sending something important, test it: share to yourself or a second device and check the result. Use the <a href="/tools/video-metadata-checker/">Metadata Checker</a> to compare resolution and size against the original.</p>`,
      },
    ],
    faqs: [
      {
        q: "Why do my videos look worse after I send them?",
        a: "Messaging apps and email re-compress attachments to save bandwidth, which removes detail. Sharing a cloud link avoids this.",
      },
      {
        q: "What is the best way to share a video at full quality?",
        a: "Upload it to cloud storage and share a download link. The recipient gets the exact file with no app re-compression.",
      },
      {
        q: "Does the 'HD' option help?",
        a: "Yes, where available it reduces how much the app compresses your video. Sending as a file or document can preserve even more quality.",
      },
      {
        q: "Should I compress before sharing?",
        a: "If you must send the file directly, compress once to a size the app accepts. That gives a better result than letting the app squeeze a large file automatically.",
      },
      {
        q: "Does compressing always lose quality?",
        a: "Some loss is inevitable, but compressing once with good settings is far better than multiple automatic re-compressions through apps.",
      },
    ],
    related: [
      { href: "/tools/video-compressor/", label: "Video Compressor tool" },
      { href: "/blog/how-to-compress-video-for-whatsapp/", label: "Compress video for WhatsApp" },
      { href: "/blog/how-to-reduce-mp4-file-size/", label: "How to reduce MP4 file size" },
      { href: "/blog/why-your-video-loses-quality-after-upload/", label: "Why video loses quality after upload" },
    ],
  },
  {
    slug: "how-to-check-video-resolution-and-size",
    title: "How to Check Video Resolution and File Size",
    seoTitle: "How to Check Video Resolution and File Size (Quick Guide)",
    description:
      "Find out a video's exact resolution, duration, format, and file size in seconds, on desktop, phone, or with a free in-browser metadata checker.",
    date: "2026-05-18",
    category: "Workflow",
    readingTime: "5 min read",
    intro: [
      `Before you upload, compress, or resize, it helps to know exactly what you are working with: the video's resolution, length, format, and file size. These numbers tell you whether a clip meets a platform's specs or needs adjusting.`,
      `This guide shows fast ways to check a video <strong>you own</strong>, including a free in-browser <a href="/tools/video-metadata-checker/">Metadata Checker</a>.`,
    ],
    sections: [
      {
        heading: "What the numbers mean",
        html: `<ul>
          <li><strong>Resolution</strong>: pixel dimensions (e.g., 1080 × 1920); decides sharpness and shape.</li>
          <li><strong>Duration</strong>: length in seconds; matters for platform limits.</li>
          <li><strong>File size</strong>: storage in MB/GB; matters for sending and uploading.</li>
          <li><strong>Format</strong>: container and codec (e.g., MP4 / H.264); decides compatibility.</li>
        </ul>`,
      },
      {
        heading: "Check on a computer",
        html: `<p>On Windows, right-click the file &rarr; <strong>Properties</strong> &rarr; <strong>Details</strong>. On macOS, select the file and press <strong>Command + I</strong>, or open it in QuickTime and view its inspector. Both show resolution, duration, and size.</p>`,
      },
      {
        heading: "Check on a phone",
        html: `<p>Most gallery apps show basic info (date, size, sometimes resolution) in a details or info panel. For full details without installing anything, use the browser tool below.</p>`,
      },
      {
        heading: "Use the in-browser checker",
        html: `<ol>
          <li>Open the <a href="/tools/video-metadata-checker/">Metadata Checker</a>.</li>
          <li>Select your video.</li>
          <li>Instantly see resolution, aspect ratio, duration, file size, and type.</li>
        </ol>
        <p>It reads the file locally in your browser, nothing is uploaded.</p>`,
      },
      {
        heading: "Use the numbers to plan",
        html: `<p>Compare what you see to your target platform's specs. If the resolution is wrong, resize with the <a href="/tools/video-resizer/">Video Resizer</a>; if the file is too big, shrink it with the <a href="/tools/video-compressor/">Video Compressor</a>.</p>`,
      },
    ],
    faqs: [
      {
        q: "How do I find a video's resolution?",
        a: "Check the file's properties/info on your computer, or use the in-browser Metadata Checker, which shows resolution instantly.",
      },
      {
        q: "How can I see a video's file size on my phone?",
        a: "Most gallery apps show size in a details panel. The browser-based Metadata Checker shows size and resolution without installing anything.",
      },
      {
        q: "What does 1080 × 1920 mean?",
        a: "It is the resolution in pixels, 1080 wide by 1920 tall, a vertical 9:16 frame used for Reels, TikTok, and Shorts.",
      },
      {
        q: "Does the checker upload my video?",
        a: "No. It reads metadata locally in your browser, so your file stays on your device.",
      },
      {
        q: "Why should I check before uploading?",
        a: "Knowing the resolution, size, and format lets you confirm a clip meets platform specs and avoid surprise cropping or rejected uploads.",
      },
    ],
    related: [
      { href: "/tools/video-metadata-checker/", label: "Metadata Checker tool" },
      { href: "/tools/video-resizer/", label: "Video Resizer tool" },
      { href: "/tools/video-compressor/", label: "Video Compressor tool" },
      { href: "/blog/video-aspect-ratio-guide/", label: "Video aspect ratio guide" },
    ],
  },
  {
    slug: "mp4-vs-mov-for-social-media",
    title: "MP4 vs. MOV for Social Media: Which Should You Use?",
    seoTitle: "MP4 vs. MOV for Social Media (Which to Choose)",
    description:
      "MP4 and MOV both hold video, but they behave differently when uploading to social platforms. Learn the practical differences and when to use each.",
    date: "2026-05-21",
    category: "Sizing & Formats",
    readingTime: "6 min read",
    intro: [
      `If you have ever exported a video and faced a choice between MP4 and MOV, you are not alone. Both are common, both can look identical, yet they behave differently when you upload to social platforms. Knowing the difference saves time and avoids failed uploads.`,
      `This guide compares MP4 and MOV in plain language and recommends what to use for social media.`,
    ],
    sections: [
      {
        heading: "What they actually are",
        html: `<p>MP4 and MOV are <strong>containers</strong>: wrappers that hold video, audio, and other data. The actual compression comes from the <strong>codec</strong> inside (often H.264). So an MP4 and a MOV can carry the same H.264 video and look the same; the wrapper differs.</p>`,
      },
      {
        heading: "Key practical differences",
        html: `<table>
          <thead><tr><th>Aspect</th><th>MP4</th><th>MOV</th></tr></thead>
          <tbody>
            <tr><td>Compatibility</td><td>Universal</td><td>Great on Apple, good elsewhere</td></tr>
            <tr><td>File size</td><td>Often smaller</td><td>Often larger</td></tr>
            <tr><td>Origin</td><td>Cross-platform standard</td><td>Apple QuickTime</td></tr>
            <tr><td>Best for</td><td>Uploading & sharing</td><td>Editing on Apple devices</td></tr>
          </tbody>
        </table>`,
      },
      {
        heading: "Which to use for social media",
        html: `<p>For uploading to Instagram, TikTok, YouTube, and others, <strong>MP4 with H.264</strong> is the safest, most compatible choice. It uploads reliably and is usually smaller. MOV is excellent while editing on a Mac or iPhone, but converting the final export to MP4 avoids compatibility surprises.</p>`,
      },
      {
        heading: "Converting MOV to MP4",
        html: `<p>If you have a MOV and need MP4, re-export from your editor as MP4/H.264, or use the <a href="/tools/video-compressor/">Video Compressor</a> / <a href="/tools/video-resizer/">Video Resizer</a> which output widely compatible files. Confirm the final container with the <a href="/tools/video-metadata-checker/">Metadata Checker</a>.</p>`,
      },
      {
        heading: "Bottom line",
        html: `<p>Edit in whatever format your tools prefer, but deliver MP4/H.264 for upload and sharing. It is the closest thing to a universal video format and is what platforms handle best. See <a href="/blog/best-video-format-for-tiktok/">best video format for TikTok</a> for matching specs.</p>`,
      },
    ],
    faqs: [
      {
        q: "Is MP4 or MOV better for Instagram and TikTok?",
        a: "MP4 with H.264 is the safer choice for uploading. It is more universally compatible and usually smaller than MOV.",
      },
      {
        q: "Do MP4 and MOV differ in quality?",
        a: "Not inherently. Both are containers; quality depends on the codec and settings inside. The same H.264 video in either container looks the same.",
      },
      {
        q: "Why are my MOV files so large?",
        a: "MOV files, especially from Apple devices, often use higher bitrates or less aggressive compression. Converting to MP4/H.264 typically reduces size.",
      },
      {
        q: "How do I convert MOV to MP4?",
        a: "Re-export as MP4/H.264 from your editor, or run it through our compressor/resizer, which output compatible files. Verify the result with the Metadata Checker.",
      },
      {
        q: "Can social platforms accept MOV?",
        a: "Usually yes, but MP4 is more reliable across every platform and device. When in doubt, upload MP4.",
      },
    ],
    related: [
      { href: "/blog/best-video-format-for-tiktok/", label: "Best video format for TikTok" },
      { href: "/blog/best-video-format-for-youtube-shorts/", label: "Best video format for YouTube Shorts" },
      { href: "/tools/video-compressor/", label: "Video Compressor tool" },
      { href: "/tools/video-metadata-checker/", label: "Metadata Checker tool" },
    ],
  },
  {
    slug: "how-to-prepare-videos-for-upload",
    title: "How to Prepare Videos for Upload",
    seoTitle: "How to Prepare Videos for Upload (Pre-Post Checklist)",
    description:
      "A pre-upload checklist for creators: correct aspect ratio, resolution, format, file size, audio, and a thumbnail, so your video looks its best.",
    date: "2026-05-24",
    category: "Workflow",
    readingTime: "6 min read",
    intro: [
      `The minutes before you hit upload decide a lot about how your video performs. A clip that is the right shape, format, and size, with clean audio and a strong cover, looks professional and avoids platform headaches.`,
      `This is a practical pre-upload checklist for videos <strong>you own</strong>, using free in-browser tools.`,
    ],
    sections: [
      {
        heading: "1. Match the aspect ratio",
        html: `<p>Confirm the shape fits the placement: 9:16 for Reels, TikTok, Shorts, and Stories; 4:5 or 1:1 for feed; 16:9 for standard YouTube. Resize with the <a href="/tools/video-resizer/">Video Resizer</a> if needed. See the <a href="/blog/video-aspect-ratio-guide/">aspect ratio guide</a>.</p>`,
      },
      {
        heading: "2. Set the right resolution",
        html: `<p>1080 × 1920 covers most vertical formats. Avoid uploading unnecessarily huge resolutions, platforms re-compress anyway, and large files upload slowly.</p>`,
      },
      {
        heading: "3. Use a compatible format",
        html: `<p>Export MP4 with H.264 video and AAC audio. It is the most reliable across platforms. If you have a MOV, see <a href="/blog/mp4-vs-mov-for-social-media/">MP4 vs. MOV</a>.</p>`,
      },
      {
        heading: "4. Check file size and audio",
        html: `<p>Make sure the file is within the platform's limits, compress with the <a href="/tools/video-compressor/">Video Compressor</a> if it is too big. Listen back for clipping or low volume, since many viewers watch with sound.</p>`,
      },
      {
        heading: "5. Prepare a thumbnail and verify",
        html: `<p>Grab a strong cover frame with the <a href="/tools/video-thumbnail-extractor/">Thumbnail Extractor</a>, then do a final check in the <a href="/tools/video-metadata-checker/">Metadata Checker</a> to confirm resolution, format, and size before uploading.</p>`,
      },
    ],
    faqs: [
      {
        q: "What should I check before uploading a video?",
        a: "Aspect ratio, resolution, format, file size, audio quality, and a thumbnail. Matching these to the platform avoids cropping, slow uploads, and rejected files.",
      },
      {
        q: "What format should I upload?",
        a: "MP4 with H.264 video and AAC audio is the most compatible across platforms.",
      },
      {
        q: "What resolution should I use?",
        a: "1080 × 1920 for vertical formats. Higher resolutions add size without visible benefit since platforms re-compress uploads.",
      },
      {
        q: "Should I compress before uploading?",
        a: "If the file exceeds the platform's limit, compress once to a sensible size. Otherwise, a clean high-quality file is fine.",
      },
      {
        q: "Do I need a custom thumbnail?",
        a: "It helps. A clear, bright cover frame improves click-through. You can extract one directly from your video.",
      },
    ],
    related: [
      { href: "/blog/video-aspect-ratio-guide/", label: "Video aspect ratio guide" },
      { href: "/tools/video-resizer/", label: "Video Resizer tool" },
      { href: "/tools/video-compressor/", label: "Video Compressor tool" },
      { href: "/tools/video-thumbnail-extractor/", label: "Thumbnail Extractor tool" },
    ],
  },
  {
    slug: "video-aspect-ratio-guide",
    title: "Video Aspect Ratio Guide: 9:16, 16:9, 1:1 and 4:5",
    seoTitle: "Video Aspect Ratio Guide (9:16, 16:9, 1:1, 4:5)",
    description:
      "Understand video aspect ratios and which to use for each platform. A clear reference for 9:16, 16:9, 1:1, and 4:5 with pixel dimensions.",
    date: "2026-05-26",
    category: "Sizing & Formats",
    readingTime: "6 min read",
    intro: [
      `Aspect ratio is the shape of your video, the relationship between its width and height. Choosing the right one for each platform is one of the simplest ways to make content look intentional instead of accidental.`,
      `This reference explains the common ratios, where each fits, and the pixel dimensions to target.`,
    ],
    sections: [
      {
        heading: "How aspect ratio works",
        html: `<p>An aspect ratio like 16:9 means for every 16 units of width there are 9 of height. It describes shape, not size, so 1280 × 720 and 1920 × 1080 are both 16:9. Match the ratio to the placement and the platform will not crop or pad your video.</p>`,
      },
      {
        heading: "The four ratios you actually need",
        html: `<table>
          <thead><tr><th>Ratio</th><th>Shape</th><th>Common resolution</th><th>Best for</th></tr></thead>
          <tbody>
            <tr><td>9:16</td><td>Tall vertical</td><td>1080 × 1920</td><td>Reels, TikTok, Shorts, Stories</td></tr>
            <tr><td>16:9</td><td>Wide landscape</td><td>1920 × 1080</td><td>Standard YouTube, TVs</td></tr>
            <tr><td>1:1</td><td>Square</td><td>1080 × 1080</td><td>Feed posts</td></tr>
            <tr><td>4:5</td><td>Vertical portrait</td><td>1080 × 1350</td><td>Instagram/Facebook feed</td></tr>
          </tbody>
        </table>`,
      },
      {
        heading: "Vertical vs. horizontal",
        html: `<p>Phones are held vertically, so 9:16 fills the screen for short-form. Horizontal 16:9 still rules long-form and desktop viewing. Square (1:1) and 4:5 are feed-friendly compromises that take up more vertical space than 16:9 without going fully vertical.</p>`,
      },
      {
        heading: "Changing aspect ratio safely",
        html: `<p>To move between ratios, you crop or pad. Cropping fills the new shape but trims edges; padding keeps everything but adds bars. The <a href="/tools/video-resizer/">Video Resizer</a> handles both, and <a href="/blog/how-to-convert-video-to-9-16/">converting to 9:16</a> is the most common case.</p>`,
      },
      {
        heading: "Quick decision guide",
        html: `<ul>
          <li>Short-form vertical content &rarr; <strong>9:16</strong>.</li>
          <li>Long-form or desktop &rarr; <strong>16:9</strong>.</li>
          <li>Feed posts that need presence &rarr; <strong>4:5</strong> or <strong>1:1</strong>.</li>
        </ul>`,
      },
    ],
    faqs: [
      {
        q: "What does aspect ratio mean?",
        a: "It is the ratio of a video's width to its height, its shape. 16:9 is wide, 9:16 is tall. It describes proportions, not pixel count.",
      },
      {
        q: "Which aspect ratio is best for short-form video?",
        a: "9:16 vertical (1080 × 1920) for Reels, TikTok, Shorts, and Stories.",
      },
      {
        q: "What is the difference between 4:5 and 9:16?",
        a: "4:5 (1080 × 1350) is a moderate portrait shape for feed posts; 9:16 (1080 × 1920) is fully vertical and fills the phone screen for short-form.",
      },
      {
        q: "How do I change a video's aspect ratio?",
        a: "Crop to fill the new shape or pad with bars to keep the whole frame. The Video Resizer does both.",
      },
      {
        q: "Does changing aspect ratio reduce quality?",
        a: "Re-encoding carries some loss. Start from a high-quality source and export at high quality to keep it sharp.",
      },
    ],
    related: [
      { href: "/tools/video-resizer/", label: "Video Resizer tool" },
      { href: "/blog/how-to-convert-video-to-9-16/", label: "How to convert video to 9:16" },
      { href: "/blog/how-to-make-video-fit-instagram/", label: "How to make video fit Instagram" },
      { href: "/blog/how-to-prepare-videos-for-upload/", label: "How to prepare videos for upload" },
    ],
  },
  {
    slug: "why-your-video-loses-quality-after-upload",
    title: "Why Your Video Loses Quality After Upload",
    seoTitle: "Why Your Video Loses Quality After Upload (And How to Fix It)",
    description:
      "Platforms re-compress every upload, which can make your video look soft. Learn why it happens and how to upload your own clips for the best quality.",
    date: "2026-05-27",
    category: "Compression & Quality",
    readingTime: "6 min read",
    intro: [
      `You export a crisp video, upload it, and it comes back looking softer than before. This is one of the most common creator frustrations, and it is almost always caused by platform re-compression, not anything you did wrong.`,
      `This guide explains why quality drops on upload and what you can actually control to minimize it.`,
    ],
    sections: [
      {
        heading: "Platforms re-compress everything",
        html: `<p>To serve videos quickly to millions of viewers, platforms re-encode every upload into their own formats and bitrates. That process discards data to shrink the file, which softens detail. You cannot turn it off, but you can give it the best possible starting point.</p>`,
      },
      {
        heading: "Compression stacks up",
        html: `<p>Quality loss compounds. If you export, send through a chat app, then upload, the video is compressed multiple times and each pass removes more detail. Minimizing the number of compressions matters as much as any single setting.</p>`,
      },
      {
        heading: "What you can control",
        html: `<ul>
          <li><strong>Start high quality:</strong> upload a clean 1080 × 1920 H.264 file, not an already-compressed copy.</li>
          <li><strong>Match the specs:</strong> correct resolution and aspect ratio avoid extra re-scaling.</li>
          <li><strong>Avoid double compression:</strong> do not route the file through messaging apps before uploading.</li>
          <li><strong>Use a strong connection:</strong> some apps lower quality on weak networks.</li>
        </ul>`,
      },
      {
        heading: "Right-size before uploading",
        html: `<p>Uploading a massively oversized file does not help, the platform compresses it down anyway. A correctly sized file gives the encoder cleaner input. Use the <a href="/tools/video-resizer/">Video Resizer</a> for dimensions and the <a href="/tools/video-compressor/">Video Compressor</a> to reach a sensible size in one pass.</p>`,
      },
      {
        heading: "Verify your source first",
        html: `<p>Before blaming the upload, confirm your source is actually high quality with the <a href="/tools/video-metadata-checker/">Metadata Checker</a>. If the source is already low-resolution or heavily compressed, the upload will only look worse. See <a href="/blog/how-to-share-videos-without-losing-quality/">sharing without losing quality</a> for related tips.</p>`,
      },
    ],
    faqs: [
      {
        q: "Why does my video look blurry after uploading?",
        a: "Platforms re-compress every upload to serve it efficiently, which softens detail. Starting from a high-quality, correctly sized file minimizes the loss.",
      },
      {
        q: "Can I stop platforms from compressing my video?",
        a: "No. Re-compression is built into how platforms deliver video. You can only control the quality of what you upload.",
      },
      {
        q: "Does uploading a bigger file keep more quality?",
        a: "Not really. An oversized file still gets compressed down. A correctly sized, high-quality file gives the encoder cleaner input.",
      },
      {
        q: "Why does sending a video through chat first make it worse?",
        a: "Each app re-compresses the file. Routing a video through messaging before uploading stacks multiple compressions, increasing quality loss.",
      },
      {
        q: "What resolution should I upload for best results?",
        a: "1080 × 1920 for vertical formats, in MP4/H.264. It is the practical sweet spot platforms handle well.",
      },
    ],
    related: [
      { href: "/blog/how-to-share-videos-without-losing-quality/", label: "Share videos without losing quality" },
      { href: "/tools/video-compressor/", label: "Video Compressor tool" },
      { href: "/blog/how-to-prepare-videos-for-upload/", label: "How to prepare videos for upload" },
      { href: "/tools/video-metadata-checker/", label: "Metadata Checker tool" },
    ],
  },
  {
    slug: "how-to-organize-your-short-form-video-library",
    title: "How to Organize Your Short-Form Video Library",
    seoTitle: "How to Organize Your Short-Form Video Library (System)",
    description:
      "A simple folder and naming system to keep your Reels, TikToks, and Shorts organized, findable, and backed up. Built for busy creators.",
    date: "2026-05-28",
    category: "Workflow",
    readingTime: "6 min read",
    intro: [
      `If you post regularly, your video files multiply fast, raw clips, edits, exports, thumbnails. Without a system, finding last month's best-performing Reel becomes a scavenger hunt. A little structure saves hours and protects your work.`,
      `This guide lays out a simple, scalable way to organize videos <strong>you own</strong>.`,
    ],
    sections: [
      {
        heading: "Use a consistent folder structure",
        html: `<p>A reliable structure is folder-by-year, then month, then project:</p>
        <pre>Videos/
  2026/
    05-May/
      reel-coffee-tips/
        raw/
        export/
        thumbnail/</pre>
        <p>Separating raw, export, and thumbnail keeps masters safe and easy to find.</p>`,
      },
      {
        heading: "Name files so you can search them",
        html: `<p>Use clear, consistent names: <code>2026-05-12_coffee-tips_final_9x16.mp4</code>. Include the date, topic, version, and shape. Avoid spaces and special characters so files behave across devices and clouds.</p>`,
      },
      {
        heading: "Keep masters separate from posted copies",
        html: `<p>Store your high-quality export as the master. Keep any platform-downloaded copies (with watermarks) in a separate "posted" folder so you never confuse them with your clean source.</p>`,
      },
      {
        heading: "Back it up automatically",
        html: `<p>Pair your structure with cloud sync so the whole library is protected. See <a href="/blog/how-to-backup-your-own-social-media-videos/">how to back up your own social media videos</a> for a full routine.</p>`,
      },
      {
        heading: "Trim the fat regularly",
        html: `<p>Every few months, delete throwaway raws you will never use and compress older archival exports with the <a href="/tools/video-compressor/">Video Compressor</a> to reclaim space, while keeping full-quality masters of your best work. Use the <a href="/tools/video-metadata-checker/">Metadata Checker</a> to spot oversized files.</p>`,
      },
    ],
    faqs: [
      {
        q: "How should I organize my video files?",
        a: "Use a year/month/project folder structure, separate raw footage from exports and thumbnails, and name files consistently with date, topic, version, and aspect ratio.",
      },
      {
        q: "What is a good file naming convention?",
        a: "Something like 2026-05-12_topic_final_9x16.mp4, date first for sorting, then topic, version, and shape, with no spaces or special characters.",
      },
      {
        q: "Should I keep raw footage?",
        a: "Keep raws for projects you may revisit, but prune throwaway clips periodically. Always keep the final master export of anything you posted.",
      },
      {
        q: "How do I stop my library from filling up storage?",
        a: "Delete unused raws, compress older archival exports, and keep full-quality masters only for your best work. Cloud storage with tiered plans also helps.",
      },
      {
        q: "How does organizing help with backups?",
        a: "A clear structure makes it easy to sync everything to the cloud and to find any file later, so your backup is actually usable when you need it.",
      },
    ],
    related: [
      { href: "/blog/how-to-backup-your-own-social-media-videos/", label: "Back up your own social media videos" },
      { href: "/tools/video-compressor/", label: "Video Compressor tool" },
      { href: "/tools/video-metadata-checker/", label: "Metadata Checker tool" },
      { href: "/blog/how-to-prepare-videos-for-upload/", label: "How to prepare videos for upload" },
    ],
  },
/* POSTS_END */
];
