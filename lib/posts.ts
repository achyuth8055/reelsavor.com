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

/**
 * Related posts for a given slug: same category first (excluding the current
 * post), then filled with the most recent posts from other categories. Never
 * includes the current post. Returns up to `limit`.
 */
export function getRelatedPosts(slug: string, limit = 3): Post[] {
  const current = getPost(slug);
  if (!current) return sortedPosts().slice(0, limit);
  const others = sortedPosts().filter((p) => p.slug !== slug);
  const sameCat = others.filter((p) => p.category === current.category);
  const restCat = others.filter((p) => p.category !== current.category);
  return [...sameCat, ...restCat].slice(0, limit);
}

/** Previous (older) and next (newer) post by date for in-article navigation. */
export function getAdjacentPosts(slug: string): {
  prev?: Post;
  next?: Post;
} {
  const ordered = sortedPosts(); // newest first
  const i = ordered.findIndex((p) => p.slug === slug);
  if (i === -1) return {};
  return {
    next: i > 0 ? ordered[i - 1] : undefined, // newer
    prev: i < ordered.length - 1 ? ordered[i + 1] : undefined, // older
  };
}

/** Builds a structural "recap" checklist from the post's section headings. */
export function recapItems(post: Post): string[] {
  return post.sections.map((s) => s.heading).slice(0, 6);
}

export function lastUpdated(post: Post): string {
  return post.updated || post.date;
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
      {
        heading: `Match your export settings to Instagram before you save`,
        html: `<p>The version you keep should also be the version that survives Instagram's processing best. If your master file is set up correctly, the copy that comes back after posting looks much closer to the original. A few settings make the biggest difference:</p><ul><li><strong>Aspect ratio:</strong> export at 9:16 (vertical) so Instagram does not crop or letterbox your Reel.</li><li><strong>Resolution:</strong> 1080 by 1920 is the sweet spot. Higher resolutions get downscaled anyway.</li><li><strong>Frame rate:</strong> keep it at 30fps unless you shot 60fps for slow motion.</li><li><strong>Format:</strong> MP4 with H.264 video and AAC audio is the most reliable combination.</li></ul><p>If you are unsure what your current file is, drop it into the <a href="/tools/video-metadata-checker/">Metadata Checker</a> to confirm the resolution, aspect ratio, and codec before you post. For the full breakdown of dimensions, see <a href="/blog/best-video-size-for-instagram-reels/">best video size for Instagram Reels</a>.</p>`,
      },
      {
        heading: `Common mistakes that cost you your originals`,
        html: `<p>Most lost Reels are not lost to hackers or glitches, they are lost to simple habits. Watch for these:</p><ul><li><strong>Deleting from your camera roll after posting.</strong> People clear space and assume the app still has a copy. The app only has its compressed version.</li><li><strong>Editing destructively.</strong> If you edit the original clip in place and overwrite it, the unedited master is gone. Always export a new file.</li><li><strong>Relying on the in-app save alone.</strong> That copy carries a Reels label and is already compressed. Keep the pre-upload export too.</li><li><strong>Letting auto-save fill your gallery unsorted.</strong> Hundreds of clips with names like VID_0421 are nearly impossible to find later.</li></ul><p>The fix for all four is the same: treat your export as the master, store it the day you post, and never overwrite it.</p>`,
      },
      {
        heading: `Save a draft Reel without publishing it`,
        html: `<p>You do not have to post a Reel to keep it. Instagram lets you save unfinished Reels as drafts, which is useful when you want to capture an edit but are not ready to share it.</p><ol><li>Assemble your Reel in the Instagram editor.</li><li>On the final share screen, tap <strong>Save as draft</strong> instead of <strong>Share</strong>.</li><li>Find it later under the Reels tab on your profile.</li></ol><p>A draft is convenient, but it is not a true backup, it still lives only inside the app. For anything you care about, export the source file from your editor as well so you have a copy that survives even if the draft disappears.</p>`,
      },
      {
        heading: `Quick checklist before you delete anything`,
        html: `<p>Before you remove a Reel from your phone or your profile, run through this short list so you are never caught out:</p><ul><li>Is the original export saved in a backup folder, not just the camera roll?</li><li>Has that folder synced to the cloud (you can see the upload finished)?</li><li>Do you have a clean, watermark-free version if you plan to repost elsewhere?</li><li>Is the file named so you can find it again in six months?</li></ul><p>If you answer yes to all four, it is safe to clear the clip from your device. If not, fix the gap first.</p>`,
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
      {
        q: `Can I save a Reel I posted as a collaboration with another account?`,
        a: `If you co-created the Reel and have rights to it, you can save your own copy the same way. If the footage belongs mainly to the other creator, get their permission before reusing it elsewhere, since collaboration on a post does not automatically transfer copyright.`,
      },
      {
        q: `Does saving my Reel affect its views or performance?`,
        a: `No. Downloading your own Reel to your device, turning on auto-save, or saving it as a draft has no effect on how it performs or who sees it. These actions are completely separate from the post's reach.`,
      },
      {
        q: `What should I do if the original file is much bigger than the posted version?`,
        a: `That is normal and expected. Your master is uncompressed compared to Instagram's display copy, which is why it looks better. If the file is too large to share or store, compress a copy with the Video Compressor and keep the full-quality master untouched as your archive.`,
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
      {
        heading: `Turn off the watermark by saving the right file`,
        html: `<p>The TikTok watermark with your username is added during the in-app save, not baked into your footage. So the way to get a clean copy is not to remove the watermark, it is to never let it get added in the first place. Keep the export from your editor as your watermark-free master.</p><p>If you recorded entirely inside TikTok and have no separate export, your in-app download will include the watermark. That is fine for resharing back to TikTok, but for cross-posting to other channels, plan ahead next time and edit in a separate app so you keep a clean source file. We do not recommend stripping watermarks from posted videos, and reposting other people's watermarked clips as your own is both a copyright problem and against platform rules. The clean-master habit keeps you on the right side of all of that while giving you the best-looking file.</p>`,
      },
      {
        heading: `Save on desktop versus mobile`,
        html: `<p>Where you save from changes what you get. Here is how the main routes compare:</p><table><thead><tr><th>Method</th><th>Watermark</th><th>Quality</th><th>Best for</th></tr></thead><tbody><tr><td>In-app save (mobile)</td><td>Yes</td><td>Compressed</td><td>Quick reshare to TikTok</td></tr><tr><td>Web save (desktop, signed in)</td><td>Yes</td><td>Compressed</td><td>Saving to a computer</td></tr><tr><td>Data archive request</td><td>Varies</td><td>Compressed</td><td>Full library backup</td></tr><tr><td>Your editor export</td><td>No</td><td>Highest</td><td>Cross-posting and re-editing</td></tr></tbody></table><p>For anything you intend to keep long term or reuse, the editor export wins every time.</p>`,
      },
      {
        heading: `Reformat your TikTok for other platforms`,
        html: `<p>A TikTok is 9:16 vertical, which fits Reels and Shorts but not landscape feeds. Once you have your own master file, adapt it instead of refilming:</p><ul><li>For YouTube Shorts or Instagram Reels, the 9:16 file works as is. See <a href="/blog/how-to-resize-video-for-youtube-shorts/">resizing for YouTube Shorts</a>.</li><li>For a square or landscape post, recrop with the <a href="/tools/freeform-crop-video/">Freeform Crop Video</a> tool.</li><li>To change dimensions without re-exporting from your editor, use the <a href="/tools/video-resizer/">Video Resizer</a>.</li></ul><p>Working from one clean master keeps every version looking consistent.</p>`,
      },
      {
        heading: `Troubleshooting a missing or stuck download`,
        html: `<p>If the Save video option is greyed out or missing, a few things are usually behind it:</p><ul><li><strong>The creator disabled downloads.</strong> On your own videos, check your privacy settings and make sure downloads are allowed.</li><li><strong>Sound restrictions.</strong> Videos using certain licensed music may block downloading. Use your own audio if you plan to save and reuse the clip.</li><li><strong>The video is private or still processing.</strong> Wait until it is fully published, then try again.</li><li><strong>App glitch.</strong> Update the app, then request a data archive as a reliable fallback.</li></ul><p>If the download succeeds but the file will not play on your computer, the issue is usually the player rather than the file. TikTok saves standard MP4 with H.264, which nearly every device supports, so try a different player or confirm the file finished downloading completely before assuming it is corrupted.</p>`,
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
      {
        q: `Why can I not save a video that uses popular music?`,
        a: `TikTok sometimes blocks downloads on videos with certain licensed tracks because of music rights, even on your own posts. If you want a clip you can freely save and reuse, use original audio or a sound you have rights to when you create it.`,
      },
      {
        q: `Does the data archive include videos I deleted?`,
        a: `Generally no. The archive reflects the content currently on your account. This is exactly why keeping your own source exports matters: once a video is deleted from TikTok, the app copy is gone, but your master file is not.`,
      },
      {
        q: `Can I change the aspect ratio of my saved TikTok?`,
        a: `Yes. Start from your clean master export, then use the Video Resizer or Freeform Crop tool to produce a square or landscape version for other platforms. Recropping a watermarked in-app download is possible but lower quality.`,
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
      {
        heading: `Personal profile versus Page Reels`,
        html: `<p>Saving works a little differently depending on where you posted. Knowing which you are dealing with saves time:</p><ul><li><strong>Personal profile Reels:</strong> use the three-dot menu on the Reel, or request your information through your account settings.</li><li><strong>Page Reels:</strong> manage these through Meta Business Suite or the Page itself. If you are an admin or editor with content rights, you can download from the Page's content library.</li><li><strong>Crossposted Reels:</strong> if a Reel was shared to both Facebook and Instagram, you only need to save one clean master, the source file is identical.</li></ul><p>In every case, make sure you actually hold the rights to the footage before you reuse it, especially on Pages where multiple people post. On a shared Page, a colleague may have uploaded a clip that came from a client, a stock library, or another creator, and your admin access does not by itself grant you the right to repurpose that footage. When in doubt, confirm where the original came from before you save it for reuse.</p>`,
      },
      {
        heading: `Choosing the right archive format and quality`,
        html: `<p>When you request your information, Facebook asks you to pick options that directly affect your video copies:</p><table><thead><tr><th>Option</th><th>Recommendation</th></tr></thead><tbody><tr><td>Format</td><td>HTML to browse easily, or JSON for raw data and re-import</td></tr><tr><td>Media quality</td><td>High, so your videos come back at the best available resolution</td></tr><tr><td>Date range</td><td>All time for a full backup, or a custom range to keep the file smaller</td></tr></tbody></table><p>Choosing High quality is the single most important setting. A low-quality archive gives you small, soft videos that are not much use for reposting.</p>`,
      },
      {
        heading: `Common problems when saving Facebook Reels`,
        html: `<p>If something goes wrong, it is usually one of these:</p><ul><li><strong>No download button.</strong> Availability depends on app version and region. Fall back to Download Your Information.</li><li><strong>The archive link expired.</strong> Facebook keeps the file available for a limited time. Download it promptly and request a fresh one if you missed the window.</li><li><strong>Videos look low quality.</strong> You likely chose Low or Medium media quality. Re-request with High selected.</li><li><strong>Huge archive file.</strong> Narrow the date range and request in batches rather than all at once.</li><li><strong>Download stalls on mobile data.</strong> Archives can be large, so finish the download on Wi-Fi to avoid timeouts and unexpected data charges.</li></ul><p>If none of these apply and the option is still missing, give it a day. Facebook rolls features out gradually, and a download button that is absent in one app version often reappears after an update.</p>`,
      },
      {
        heading: `Keep Facebook from over-compressing future uploads`,
        html: `<p>Backing up is half the battle. The other half is uploading clean files so the version Facebook shows looks good from the start. Before you post your next Reel:</p><ul><li>Export at 1080 by 1920, 9:16, in MP4 with H.264.</li><li>Keep the bitrate reasonably high so detail survives Facebook's re-encode.</li><li>Confirm the file with the <a href="/tools/video-metadata-checker/">Metadata Checker</a> before uploading.</li></ul><p>For more on why uploads lose quality and how to limit it, see <a href="/blog/why-your-video-loses-quality-after-upload/">why your video loses quality after upload</a>.</p>`,
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
      {
        q: `Can I download a Reel from a Page I only help manage?`,
        a: `Yes, if your role on the Page gives you access and you have rights to the content. Admins and editors can usually download Page Reels through Meta Business Suite. Confirm you actually hold the rights to the footage before reusing it elsewhere.`,
      },
      {
        q: `Why is my Facebook archive video lower quality than I expected?`,
        a: `You most likely left media quality set to Low or Medium when you created the archive. Request a new download and choose High quality. The best copy overall is still the original export you saved before uploading.`,
      },
      {
        q: `Do I need to save a Reel separately on Facebook and Instagram if I crossposted it?`,
        a: `No. The underlying file is the same, so one clean master export covers both. Keep that single source file and adapt it per platform with a resizing tool if the aspect ratio needs to change.`,
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
        html: `<p>If a creator grants permission and sends you the file directly, that is the cleanest path, ask them to share the original export rather than a link. Keep their written permission with the file. Once you have your own copy, you can prepare it for re-use with browser-side tools like the <a href="/tools/video-resizer/">Video Resizer</a> or <a href="/tools/freeform-crop-video/">Freeform Crop Video</a>.</p>`,
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
      {
        heading: `What permission should actually cover`,
        html: `<p>A quick yes is better than nothing, but vague permission can cause problems later. When you ask a creator, try to confirm four things so everyone is clear:</p><ul><li><strong>Scope:</strong> which exact video, identified by link.</li><li><strong>Use:</strong> where and how you will use it (for example, a YouTube video, a paid ad, an internal training clip).</li><li><strong>Credit:</strong> how they want to be credited, if at all.</li><li><strong>Duration:</strong> whether the permission is one-time or ongoing.</li></ul><p>Permission for a personal repost is not the same as permission for a commercial ad. If your use changes later, ask again. Our explainer on <a href="/blog/public-video-vs-copyright-permission/">public video vs. copyright permission</a> covers why this matters legally.</p>`,
      },
      {
        heading: `Verify you are talking to the real rights holder`,
        html: `<p>Permission only counts if it comes from the person who actually owns the video. On X, reposted and quoted clips travel fast, so the account sharing a video is often not the one that made it. Before you rely on a yes:</p><ul><li>Trace the clip back to the original poster, not a reposter.</li><li>Check whether the video itself credits a different creator or brand.</li><li>Be cautious with clips from TV, films, sports, or music, those rights usually sit with a company, not the account that posted them.</li></ul><p>If you cannot confirm who owns it, the safe choice is not to use it. A useful test: would you be comfortable explaining to the original creator exactly how and where you used their video? If the answer is no, or you are not even sure who that creator is, treat the clip as off limits until you have tracked down the right person and gotten a clear yes.</p>`,
      },
      {
        heading: `Prepare a permitted clip for your own project`,
        html: `<p>Once you have the original file and written permission, you can adapt it for wherever it is going. Keep your edits non-destructive by working on a copy:</p><ul><li>Crop or reframe for a new aspect ratio with the <a href="/tools/freeform-crop-video/">Freeform Crop Video</a> tool.</li><li>Resize for a specific platform using the <a href="/tools/video-resizer/">Video Resizer</a>.</li><li>Pull just the audio, if that is all you were cleared to use, with the <a href="/tools/extract-audio-from-video/">Extract Audio</a> tool.</li></ul><p>Keep the untouched original alongside your edits so you always have the source the creator approved.</p>`,
      },
      {
        heading: `Build a simple permissions log`,
        html: `<p>If you reuse other people's clips even occasionally, a lightweight log saves you from scrambling later. A single spreadsheet with these columns is enough:</p><table><thead><tr><th>Column</th><th>What to record</th></tr></thead><tbody><tr><td>Video</td><td>Link and a short description</td></tr><tr><td>Creator</td><td>Handle and real name if known</td></tr><tr><td>Permission</td><td>Date granted and where the message is saved</td></tr><tr><td>Scope</td><td>Approved use and any credit required</td></tr></tbody></table><p>This is the same discipline a publisher or agency would expect, and it protects you if a question ever comes up.</p>`,
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
        q: "Does Reelsavor download videos from X?",
        a: "No. Reelsavor does not download videos from X or any platform. Our tools work on files you already have, videos you posted, or clips a creator shared with you directly and gave you permission to use.",
      },
      {
        q: `Does permission from a reposter count?`,
        a: `No. Only the original rights holder can grant permission. Someone who reposted or quoted a clip usually does not own it, so their yes carries no legal weight. Trace the video back to its creator before relying on any approval.`,
      },
      {
        q: `Can I use a clip from a movie, sports broadcast, or music video if the account says yes?`,
        a: `Almost never. Those rights belong to studios, leagues, or labels, not the account that posted the clip. An individual account cannot grant permission for content they do not own, so treat that material as off limits unless you have a license from the actual rights holder.`,
      },
      {
        q: `I only have permission to use the audio. Can I do that?`,
        a: `If the creator clearly granted rights to the audio specifically, yes. Use the Extract Audio tool on the file they shared with you, keep their written permission on record, and do not reuse the video portion unless that was also approved.`,
      },
    ],
    related: [
      { href: "/blog/public-video-vs-copyright-permission/", label: "Public video vs. copyright permission" },
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
      {
        heading: `Estimate the file size you need before you start`,
        html: `<p>A little math saves a lot of trial and error. File size is roughly bitrate multiplied by length, so you can predict whether a clip will fit. As a rough guide:</p><table><thead><tr><th>Length</th><th>Bitrate</th><th>Approx. size</th></tr></thead><tbody><tr><td>30 seconds</td><td>2 Mbps</td><td>About 7 to 8 MB</td></tr><tr><td>1 minute</td><td>2 Mbps</td><td>About 15 MB</td></tr><tr><td>2 minutes</td><td>1.5 Mbps</td><td>About 22 MB</td></tr></tbody></table><p>If your target is to stay well under the messaging limit, work backwards: pick a bitrate, multiply by your clip length, and lower the bitrate or trim the clip until the estimate fits comfortably.</p>`,
      },
      {
        heading: `Compress once, never twice`,
        html: `<p>The most common quality killer is double compression: you shrink a file, then WhatsApp shrinks it again on top of that. Each pass throws away detail permanently. To avoid it:</p><ul><li>Start from your original, highest-quality file, not a clip someone already forwarded to you.</li><li>Compress one time to a size WhatsApp will accept without re-squeezing.</li><li>Send it as a <strong>document</strong> rather than as media when you need WhatsApp to leave your file untouched.</li></ul><p>Sending as a document preserves your exact file, but it will not autoplay inline and large files may still be blocked. For routine clips, a single well-targeted compression is usually the better balance.</p>`,
      },
      {
        heading: `Compress audio and frame rate too, not just resolution`,
        html: `<p>Most people only touch resolution, but two other settings quietly add weight:</p><ul><li><strong>Audio bitrate:</strong> for talking-head or casual clips, 96 to 128 kbps AAC sounds fine and is smaller than a 320 kbps track.</li><li><strong>Frame rate:</strong> if you shot at 60fps but the clip has no fast motion, dropping to 30fps roughly halves the frames the encoder has to store.</li></ul><p>If your clip is mostly someone talking, you can trim the audio bitrate and frame rate first and leave the resolution alone, keeping the picture sharp where it matters most. For a music or action clip, do the opposite and protect the video bitrate.</p><p>Combined with a 720p resolution, these two tweaks can shave off several more megabytes without a visible difference on a phone screen. For the general principles, see <a href="/blog/how-to-reduce-mp4-file-size/">how to reduce MP4 file size</a>.</p>`,
      },
      {
        heading: `Quality checklist before you hit send`,
        html: `<p>Run through this before sharing so your recipient gets a clean clip the first time:</p><ul><li>Is the file comfortably under the size limit, with a little margin?</li><li>Does the text or any captions still read clearly at 720p?</li><li>Is the audio in sync and free of harsh artifacts?</li><li>Did you keep the original full-quality file so you can re-export later if needed?</li></ul><p>Verify the final numbers in the <a href="/tools/video-metadata-checker/">Metadata Checker</a>, then send.</p>`,
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
      {
        q: `Should I send my video as a document to keep its quality?`,
        a: `Sending as a document tells WhatsApp not to re-compress the file, which preserves quality. The trade-off is that it will not preview or autoplay inline, and very large files may still be rejected. For most clips, a single well-chosen compression to a sending-friendly size is the simpler choice.`,
      },
      {
        q: `Why is my video still too big after compressing?`,
        a: `Usually the clip is simply too long for the bitrate you chose, or you only lowered resolution while leaving a high bitrate and frame rate. Trim dead air, drop to 720p, set the bitrate to 1 to 2 Mbps, and reduce 60fps footage to 30fps if there is no fast motion.`,
      },
      {
        q: `Does lowering the frame rate hurt quality?`,
        a: `Only if your video has fast motion that benefits from 60fps, like sports or gaming. For talking, tutorials, or static scenes, 30fps looks the same to viewers and meaningfully reduces file size, so it is a safe saving for most WhatsApp clips.`,
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
      {
        heading: `When to use 4:5 instead of 9:16`,
        html: `<p>Not every Reel-style clip has to be a strict 9:16. Instagram also accepts a <strong>4:5 portrait</strong> shape (for example, 1080 × 1350), which is taller than square but shorter than full-screen vertical. The trade-off is simple: 9:16 fills the entire screen in the Reels player, while 4:5 shows the whole frame with a little space above and below and tends to look better when the same clip is also shared to your main feed grid. If your clip lives only in Reels, choose 9:16 at 1080 × 1920. If you want one file that looks acceptable both in Reels and in the feed, 4:5 is a reasonable compromise. You can produce either shape in the <a href="/tools/video-resizer/">Video Resizer</a> by picking the matching preset before you process.</p>`,
      },
      {
        heading: `Common resizing mistakes to avoid`,
        html: `<p>A few small errors account for most disappointing Reels:</p><ul><li><strong>Upscaling a small clip.</strong> Resizing a 720-wide video to 1080 × 1920 stretches pixels and looks soft. Start from the highest-resolution source you have.</li><li><strong>Cropping off captions.</strong> If you burned subtitles near the bottom of a landscape clip, crop-to-fill can slice them off. Reposition the text or switch to fit-with-padding.</li><li><strong>Forgetting orientation metadata.</strong> Some phone clips are recorded landscape but flagged to display vertical. After resizing, confirm the real pixel dimensions rather than trusting the preview.</li><li><strong>Resizing then compressing too hard.</strong> If you also need a smaller file, compress gently with the <a href="/tools/video-compressor/">Video Compressor</a> so the footage stays sharp.</li></ul>`,
      },
      {
        heading: `Repurpose one clip across platforms`,
        html: `<p>The good news about getting a Reel to 1080 × 1920 is that the same file is already correct for TikTok and YouTube Shorts, which share the 9:16 standard. Resize once, then post the same vertical master to each platform, adjusting only the caption and any on-screen text positioning for each app's interface. If your starting point is landscape footage rather than a vertical clip, work through the dedicated <a href="/blog/how-to-convert-video-to-9-16/">9:16 conversion guide</a> first, then treat the result as your reusable master. This keeps your framing consistent and saves you from re-exporting the same video three different ways.</p>`,
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
      {
        q: `Can I resize a Reel without re-recording it?`,
        a: `Yes. Resizing only changes the shape and dimensions of an existing file, so you can take a clip you already shot and reframe it to 9:16 without filming again. Just keep your subject centered so cropping does not cut it off.`,
      },
      {
        q: `What frame rate should a Reel be after resizing?`,
        a: `Resizing does not change the frame rate, and you do not need to. 30 fps is standard, and 60 fps suits fast motion. The key is that the dimensions end up at 1080 by 1920.`,
      },
      {
        q: `My resized Reel still looks soft. Why?`,
        a: `The most common cause is upscaling from a low-resolution source. If the original clip was smaller than 1080 wide, resizing it to 1080 by 1920 stretches the pixels. Start from the highest-quality source file you have for a sharp result.`,
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
      {
        heading: `Plan around the safe zones`,
        html: `<p>TikTok stacks interface elements on top of your video: the caption and username sit along the bottom left, and the like, comment, share, and profile buttons run up the right edge. Sounds and effect labels appear near the top. Before you resize, picture those overlays as a frame around your usable space. Keep titles, logos, and the main subject inside the central column, roughly the middle 60 percent of the width and away from the bottom third. If your footage has text baked in near an edge, either reframe it during the resize or choose fit-with-padding so nothing important slides under a button. A quick way to check is to take a screenshot of any TikTok and note where the buttons land, then mentally overlay that on your clip.</p>`,
      },
      {
        heading: `Trim before you resize`,
        html: `<p>TikTok favors clips that get to the point quickly, so it is worth trimming to the strongest moment before you reshape the file. Trimming first also means you are not re-encoding seconds you will never use, which keeps processing faster and the output smaller. A good order of operations is: trim to the highlight, resize to 9:16, then verify. If the trimmed, resized file is still larger than you want for a quick mobile upload, run it through the <a href="/tools/video-compressor/">Video Compressor</a> as a final step. Keeping the clip tight and correctly shaped gives it the best chance of looking native in the feed.</p>`,
      },
      {
        heading: `Troubleshooting bars and stretching`,
        html: `<p>Two problems show up most often after posting to TikTok. <strong>Black bars</strong> mean the file is not truly 9:16, so the app pads it; the fix is to resize to exactly 1080 × 1920 rather than relying on TikTok's in-app crop. <strong>Stretched or squashed</strong> footage means the aspect ratio was forced rather than cropped, distorting faces and circles. Always resize by cropping or padding, never by stretching to fill. If you are unsure which happened, check the actual output with the <a href="/tools/video-metadata-checker/">Metadata Checker</a>: a clean file reads 1080 wide by 1920 tall with a 9:16 ratio. If the numbers are right but it still looks off in the app, the issue is framing, not dimensions.</p>`,
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
      {
        q: `Does TikTok have a maximum resolution?`,
        a: `1080 by 1920 is the practical target for vertical clips. Uploading a much larger file does not improve how it looks because TikTok re-compresses uploads, and it only makes the file slower to send.`,
      },
      {
        q: `Should I add the on-screen text before or after resizing?`,
        a: `Add or reposition text after you know the final 9:16 frame, so you can place it inside the safe zone away from TikTok's buttons. Adding text to a landscape clip first risks it getting cropped during the resize.`,
      },
      {
        q: `Can I post the same resized file to TikTok and Reels?`,
        a: `Yes. Both use 9:16 at 1080 by 1920, so one vertical master works on both. Just double-check that text stays clear of each app's interface, since the button positions differ slightly.`,
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
      {
        heading: `Square and tall: what still counts as a Short`,
        html: `<p>YouTube treats a video as a Short when it is vertical or square and falls within the short-form length limit. That means a strict 9:16 is ideal, but a 1:1 square or a 4:5 portrait clip can also qualify and will still appear in the Shorts feed. For the most full-screen, native look, stick with 9:16 at 1080 × 1920. Reserve square or 4:5 for cases where you are reusing a clip that was originally framed that way and you do not want to crop it further. Whatever shape you choose, the deciding factor for Shorts eligibility is that the video is not landscape and stays short, so resizing a wide clip to a vertical shape is the single most important step.</p>`,
      },
      {
        heading: `From a long video to a Short, step by step`,
        html: `<p>Repurposing a longer landscape upload into a Short is one of the most common workflows:</p><ol><li>Identify a self-contained highlight that makes sense without the full context.</li><li>Trim that section out so you are only working with the part you will publish.</li><li>Resize the trimmed clip to 9:16 (1080 × 1920) using the <a href="/tools/video-resizer/">Video Resizer</a>, choosing crop-to-fill for a centered subject.</li><li>Reframe if needed so the action stays in the middle of the vertical canvas.</li><li>Add a punchy on-screen hook in the first second to stop the scroll.</li></ol><p>If you plan to do this regularly, keeping a tidy folder of source clips helps; the <a href="/blog/how-to-organize-your-short-form-video-library/">short-form library guide</a> covers a simple system.</p>`,
      },
      {
        heading: `Quality checklist before you publish`,
        html: `<p>Run through these checks so your Short looks its best in a feed dominated by sharp, full-screen clips:</p><ul><li>Dimensions are exactly 1080 × 1920, confirmed in the <a href="/tools/video-metadata-checker/">Metadata Checker</a>.</li><li>The subject is centered and clear of the title, channel name, and right-side buttons.</li><li>The clip starts on a strong frame, since the first moment doubles as the preview.</li><li>The file is MP4 with H.264 video for broad compatibility.</li><li>Audio is present and at a sensible level, since many Shorts rely on sound or music.</li></ul>`,
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
      {
        q: `Is 1080 by 1920 enough, or should I upload 4K for Shorts?`,
        a: `1080 by 1920 is the recommended size and is plenty for a phone-first format. A 4K vertical file is far larger and gets re-compressed on upload, so the extra resolution rarely makes a visible difference on Shorts.`,
      },
      {
        q: `Does resizing affect whether my video qualifies as a Short?`,
        a: `Indirectly, yes. Shorts must be vertical or square and within the length limit. Resizing a landscape clip to 9:16 is what makes it vertical, which is the key requirement, but you also need to keep it short.`,
      },
      {
        q: `Can I keep a horizontal version for regular YouTube and a vertical one for Shorts?`,
        a: `Yes. Keep your original landscape file as the master for standard uploads, then resize a trimmed copy to 9:16 for the Short. Working from a copy means your full-length video stays untouched.`,
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
      {
        heading: `The blurred-background fill option`,
        html: `<p>There is a middle ground between hard cropping and plain black bars: a <strong>blurred background fill</strong>. Instead of leaving empty bars above and below a fitted landscape clip, you place a zoomed, blurred copy of the same footage behind it to fill the 9:16 canvas. This keeps every part of the original frame visible while avoiding the dead-space look of solid bars, which is why it is popular for highlight clips, sports, and talking-head footage where edge content matters. It is not always the right call: for crisp on-screen text or fine detail, a clean crop usually reads better, and a blurred fill can look busy if the footage is already cluttered. Treat it as a tool for the specific case where you must keep the whole frame but still want a full, polished canvas.</p>`,
      },
      {
        heading: `Reframing horizontal footage so it survives the crop`,
        html: `<p>The biggest challenge in 9:16 conversion is that horizontal footage spreads action across a wide frame, and a vertical crop only keeps a narrow column. If your subject drifts left and right, a fixed center crop will cut them off. Before converting, watch the clip and ask whether the important action stays roughly centered for its whole duration. If it does, crop-to-fill works cleanly. If the subject moves, you have two practical options: choose fit-with-padding to keep everyone in frame, or convert the clip in shorter segments where the subject is centered in each. Planning for vertical at the filming stage helps most of all, but when you are working with footage you already shot, picking the right crop region is what separates a natural-looking vertical clip from an obviously cropped one.</p>`,
      },
      {
        heading: `Verify and reuse your vertical master`,
        html: `<p>Once you have a 9:16 file you are happy with, treat it as a reusable master rather than converting the same source again for each platform. Confirm it reads 1080 × 1920 in the <a href="/tools/video-metadata-checker/">Metadata Checker</a>, then post it to Reels, TikTok, and Shorts, which all share this shape. The platform-specific guides cover the interface quirks of each app: see <a href="/blog/how-to-resize-video-for-instagram-reels/">resizing for Instagram Reels</a> and <a href="/blog/how-to-resize-video-for-tiktok/">resizing for TikTok</a> for where overlays land. Converting once and reusing keeps your framing consistent everywhere and avoids stacking up multiple re-encodes, each of which costs a little quality.</p>`,
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
      {
        q: `What is the difference between a blurred fill and padding?`,
        a: `Padding adds solid bars, usually black, above and below a fitted clip. A blurred fill uses a zoomed, blurred copy of the footage in that space instead, so the whole frame stays visible without the dead look of plain bars.`,
      },
      {
        q: `Can I convert a vertical phone video that is already close to 9:16?`,
        a: `Yes, and it is the easiest case. Many phone videos are 9:16 or very close, so converting mostly means confirming the dimensions and trimming bars if any crept in. Check the result reads 1080 by 1920.`,
      },
      {
        q: `Why does my converted clip look zoomed in?`,
        a: `Crop-to-fill zooms in to fill the taller frame, which crops the sides of a wide video and can feel tight. If that is too aggressive, switch to fit-with-padding or a blurred fill to keep the full frame.`,
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
      {
        heading: `Set the right size for each platform`,
        html: `<p>Where you will use the thumbnail decides its ideal shape. For a standard YouTube video thumbnail, target a <strong>16:9</strong> image at 1280 × 720 or larger. For vertical platforms, the preview is cropped from the video itself, so the frame you pick matters more than a separate upload. The table below summarizes common targets:</p><table><thead><tr><th>Use</th><th>Shape</th><th>Suggested size</th></tr></thead><tbody><tr><td>YouTube video</td><td>16:9</td><td>1280 × 720</td></tr><tr><td>Reels / TikTok / Shorts preview</td><td>9:16</td><td>1080 × 1920</td></tr><tr><td>Square feed post</td><td>1:1</td><td>1080 × 1080</td></tr></tbody></table><p>Extract from a source at or above these resolutions so the still is not soft, and confirm the captured frame's dimensions in the <a href="/tools/video-metadata-checker/">Metadata Checker</a>.</p>`,
      },
      {
        heading: `PNG or JPEG: choosing the right format`,
        html: `<p>The two common still formats suit different jobs. <strong>PNG</strong> is lossless, so it keeps crisp edges and is the better choice when you will add text overlays or sharp graphics, or when you want to re-edit the image without compounding compression. <strong>JPEG</strong> uses lossy compression that produces a much smaller file for photographic frames, which is handy when upload size matters or you are storing many thumbnails. A practical workflow is to extract as PNG while you design the thumbnail, add your text and adjustments, then export a final JPEG for upload. For a purely photographic still with no overlay, capturing straight to JPEG is fine and saves a step.</p>`,
      },
      {
        heading: `Build a clickable thumbnail from a still`,
        html: `<p>A raw frame is a strong starting point, but a few finishing touches make it click-worthy. Crop tightly on the most expressive moment so it reads at a small size. Add a short, large, high-contrast headline rather than a full sentence, and keep it clear of the corners where durations and platform badges appear. If your subject is dark, lift the brightness and add a subtle outline behind text so it stays legible over busy footage. For YouTube specifically, you can assemble these elements with the <a href="/tools/youtube-thumbnail-maker/">YouTube Thumbnail Maker</a>. Whatever you create, only use frames from videos you filmed or have explicit permission to use, the same rule that applies to every Reelsavor tool.</p>`,
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
      {
        q: `How do I get a sharp thumbnail from a blurry moment?`,
        a: `You cannot add detail that was never captured, so the fix is to scrub to a still beat instead of a moment of fast motion. Pausing between movements, or on a held expression, gives you a crisp frame to export.`,
      },
      {
        q: `Can I extract several frames and pick the best one?`,
        a: `Yes. Scrub to each candidate moment and capture it, then compare the saved images side by side. Grabbing a few options and choosing afterward usually beats trying to nail the perfect frame on the first try.`,
      },
      {
        q: `What size should a YouTube thumbnail be?`,
        a: `Aim for a 16:9 image at 1280 by 720 or larger. Extract from a 1080p or higher source so the still stays sharp when YouTube displays it at full size and in search results.`,
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
      {
        heading: `Common sizing mistakes that ruin a Reel`,
        html: `<p>Most Reel problems come down to a handful of avoidable mistakes. The first is exporting at the wrong aspect ratio, usually 16:9 or 1:1, then letting Instagram crop it for you. The second is filming horizontally and rotating later, which leaves you fighting black bars. The third is upscaling a low-resolution clip to 1080 × 1920, which only stretches soft pixels and looks worse than the original. A fourth common trap is burning in captions or logos right at the edges where Instagram's interface covers them. Plan the 9:16 frame before you shoot, keep the camera vertical, and start from the highest-quality source you have rather than enlarging a small file.</p>`,
      },
      {
        heading: `Pre-upload quality checklist`,
        html: `<p>Run through this short list before you post a Reel you own:</p><ul><li>Aspect ratio is exactly 9:16 (no bars, no stretch).</li><li>Resolution reads 1080 × 1920 in the <a href="/tools/video-metadata-checker/">Metadata Checker</a>.</li><li>Frame rate is 30 fps, or 60 fps if the footage has fast motion.</li><li>Container is MP4 with H.264 video and AAC audio.</li><li>Captions and key subjects sit inside the central safe zone.</li><li>The file is a sensible size, not a bloated multi-gigabyte export.</li></ul><p>If any item fails, fix it before uploading. It is far easier to correct a clip on your computer than to delete and repost after it looks wrong in the feed.</p>`,
      },
      {
        heading: `Bitrate and audio settings that hold up after upload`,
        html: `<p>Resolution gets the attention, but bitrate decides how clean your Reel looks once Instagram re-compresses it. For 1080 × 1920 footage, exporting at roughly 8 to 12 Mbps for 30 fps content gives Instagram plenty of detail to work with. Going much higher mostly inflates the file without a visible payoff, while going too low leaves blocky artifacts in motion-heavy shots. For audio, AAC at 128 to 256 kbps is clear and compatible. If your Reel relies on music or voice, that audio bitrate matters as much as the video, since muddy sound makes a clip feel cheap even when the picture is sharp.</p>`,
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
      {
        q: `Should I export my Reel larger than 1080 × 1920 for safety?`,
        a: `No. Instagram caps and re-compresses uploads, so a 4K vertical export gives no visible benefit on phones and just creates a heavier file. Export at 1080 × 1920 from a high-quality source instead.`,
      },
      {
        q: `My Reel has black bars on the sides. How do I fix it?`,
        a: `Bars mean the clip is not truly 9:16, often a landscape or square video padded to fit. Resize it to 1080 × 1920 using crop-to-fill so the frame is filled edge to edge, then re-check the dimensions before posting.`,
      },
      {
        q: `Does a higher frame rate make my Reel look better?`,
        a: `Only for fast motion. 60 fps smooths action like sports or dance, but for talking, tutorials, or static scenes it adds file size with no real benefit. Stick with 30 fps unless the footage clearly needs it.`,
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
      {
        heading: `Editing format vs. upload format`,
        html: `<p>It helps to separate the format you edit in from the format you upload. While editing, you may work with large MOV, ProRes, or high-bitrate files for maximum quality and flexibility. That is fine on your computer. For the final upload, though, export to MP4 with H.264 and AAC. This delivery format is smaller, uploads faster, and is exactly what TikTok expects, so it survives the platform's processing better. Think of MP4/H.264 as the universal handoff format: edit however you like, but always deliver a clean MP4 to TikTok.</p>`,
      },
      {
        heading: `Troubleshooting failed or low-quality uploads`,
        html: `<p>If TikTok rejects your file or it looks soft after posting, work through these checks. A file that will not upload is usually too large, an unusual codec like HEVC from certain phones, or a corrupted export, so re-export to standard MP4/H.264 and try again. A clip that looks blurry was likely uploaded on a weak connection, sent through several apps first, or compressed too aggressively before upload. Confirm the source is a clean 1080 × 1920 H.264 file with the <a href="/tools/video-metadata-checker/">Metadata Checker</a>, upload on Wi-Fi, and avoid forwarding the clip through messaging apps that re-compress it on the way.</p>`,
      },
      {
        heading: `Vertical vs. square and why it matters`,
        html: `<p>TikTok is a full-screen vertical experience, so a true 9:16 frame at 1080 × 1920 always looks best. Square (1:1) and landscape (16:9) clips technically play, but they leave large empty zones and feel out of place in the feed, which can hurt watch time. If your only source is horizontal footage you own, resize it to 9:16 with the <a href="/tools/video-resizer/">Video Resizer</a> before posting rather than uploading a small boxed-in clip. Reframe so your subject stays centered in the taller crop.</p>`,
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
      {
        q: `What MP4 bitrate should I export for TikTok?`,
        a: `For 1080 × 1920 at 30 fps, around 8 to 12 Mbps for video gives TikTok enough detail to work with after its own compression. Higher mostly enlarges the file; much lower introduces visible artifacts in motion.`,
      },
      {
        q: `My phone exports HEVC (H.265). Should I convert it for TikTok?`,
        a: `Converting to H.264 MP4 is the safest choice for compatibility and consistent results. HEVC sometimes uploads fine, but H.264 avoids surprises across devices and uploads reliably.`,
      },
      {
        q: `Does TikTok support 4K vertical uploads?`,
        a: `TikTok accepts higher resolutions, but it re-encodes everything and most viewing happens on phones, so 1080 × 1920 is the practical sweet spot. A 4K file just adds size and upload time without a clear visible gain.`,
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
      {
        heading: `How YouTube processing affects your Short`,
        html: `<p>Every Short you upload is re-encoded into several streaming versions so it can play smoothly on any device and connection. This is why your source quality matters so much: YouTube can only work with the detail you give it. A clean, high-bitrate 1080 × 1920 H.264 file gives the encoder room to produce a sharp result, while a small, already-compressed clip leaves it nothing to recover. Processing can also take a few minutes after upload, so if your Short looks soft immediately, wait and re-check before assuming something went wrong. The higher-quality versions often finish processing after the initial low-resolution one.</p>`,
      },
      {
        heading: `Recommended export settings`,
        html: `<p>For a Short you own, these export settings give YouTube a strong source to work from:</p><table><thead><tr><th>Setting</th><th>Suggested value</th></tr></thead><tbody><tr><td>Video bitrate</td><td>10 to 15 Mbps (1080p vertical)</td></tr><tr><td>Audio bitrate</td><td>128 to 256 kbps AAC</td></tr><tr><td>Keyframe interval</td><td>Standard (every 1 to 2 seconds)</td></tr><tr><td>Color</td><td>Standard Rec. 709 / SDR</td></tr></tbody></table><p>You do not need to chase extreme numbers. A clean export at these settings looks excellent once processed, and pairs well with the <a href="/tools/video-compressor/">Video Compressor</a> if the file ends up larger than you want.</p>`,
      },
      {
        heading: `Shorts vs. regular YouTube uploads`,
        html: `<p>The format basics are similar, but the framing differs. A regular YouTube video is usually 16:9 landscape at 1920 × 1080, while a Short is vertical 9:16 at 1080 × 1920 and kept within the short-form length limit. If you want to repurpose a horizontal video you own into a Short, do not just upload it: reframe it to vertical with the <a href="/tools/video-resizer/">Video Resizer</a> so your subject fills the tall frame, and trim it to a tight highlight. Uploading a wide clip into the Shorts shelf leaves it boxed and easy to scroll past.</p>`,
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
      {
        q: `Why does my Short look blurry right after uploading?`,
        a: `YouTube serves a lower-resolution version first while it finishes encoding the higher-quality ones. Wait a few minutes, refresh, and confirm the higher resolution is available before judging the final quality.`,
      },
      {
        q: `What bitrate should I export a Short at?`,
        a: `Around 10 to 15 Mbps for 1080 × 1920 gives YouTube enough detail to produce a clean result after re-encoding. There is no need to go far beyond that for a phone-first vertical format.`,
      },
      {
        q: `Can I reuse my landscape YouTube video as a Short?`,
        a: `You can, but reframe it to 9:16 first so it fills the vertical screen, and trim it to a short highlight. A wide video uploaded as-is will appear small and boxed in the Shorts feed.`,
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
      {
        heading: `Match the file size to where it is going`,
        html: `<p>There is no single correct size; the right target depends on the destination. A clip headed for email or a chat app usually needs to land under that service's attachment limit, often around 25 MB for email and 16 MB for some messaging apps. A video for a website should load fast, so smaller is better. A Reel or Short can be larger because the platform re-compresses it anyway. Decide the destination first, then compress toward that ceiling. For chat-specific limits and tactics, see <a href="/blog/how-to-compress-video-for-whatsapp/">how to compress video for WhatsApp</a>, and for keeping quality intact when sharing, <a href="/blog/how-to-share-videos-without-losing-quality/">how to share videos without losing quality</a>.</p>`,
      },
      {
        heading: `Quiet wins: frame rate, audio, and unused tracks`,
        html: `<p>Beyond resolution and bitrate, a few overlooked settings shrink files with almost no visible cost. Dropping a 60 fps clip to 30 fps roughly halves the frame data when the footage does not need smoothness. Lowering audio bitrate from a high value to 128 kbps AAC saves space and stays clear for speech and most music. Removing extra audio tracks, subtitle tracks, or metadata you do not need also trims the file. These are great first moves when you want a smaller file but want to keep the picture resolution exactly where it is.</p>`,
      },
      {
        heading: `Troubleshooting: my file is still too big`,
        html: `<p>If a clip stays stubbornly large after compressing, check these in order. First, length: a long video at any reasonable bitrate is simply big, so trim hard or split it into parts. Second, resolution: if you compressed at 1080p but only need phone viewing, step down to 720p for a major reduction. Third, double compression: re-compressing an already-compressed file gives diminishing returns and degrades quality, so always start from your best original. Finally, confirm the result in the <a href="/tools/video-metadata-checker/">Metadata Checker</a> so you know the real size and resolution rather than guessing.</p>`,
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
      {
        q: `Does dropping frame rate reduce file size?`,
        a: `Yes. Halving frame rate from 60 fps to 30 fps cuts a large share of the per-second data. For talking-head or static footage that does not need extra smoothness, it shrinks the file with no visible downside.`,
      },
      {
        q: `Is it better to lower resolution or bitrate first?`,
        a: `If you do not need the full resolution for where the video is going, lower resolution first, since it is the biggest single saving. If you need to keep the resolution, reduce bitrate until just before quality visibly drops.`,
      },
      {
        q: `Why is my video still huge after compressing it?`,
        a: `Usually because it is long, still at a high resolution, or being re-compressed from an already-compressed copy. Trim the length, step down resolution if phone viewing is the goal, and always compress from the original source for the best result.`,
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
      {
        heading: `Crop-to-fill vs. fit-with-padding: which to choose`,
        html: `<p>When your video does not match a placement's shape, you have two honest options. Crop-to-fill enlarges the footage so it fills the whole frame, trimming the edges that stick out; it looks clean and full-screen but you lose some of the sides or top and bottom. Fit-with-padding keeps the entire original frame and adds bars to fill the gaps; nothing is lost, but the bars can look dated, especially on Reels and Stories. As a rule, use crop-to-fill for vertical placements where full-screen matters, and reserve fit-with-padding for when the whole frame is genuinely important, such as text or graphics that would be cut off. Always preview after either choice.</p>`,
      },
      {
        heading: `Repurposing one video across feed, Reels, and Stories`,
        html: `<p>If you want a single video you own to appear in more than one placement, do not upload the same export everywhere. Make a version per shape: 9:16 (1080 × 1920) for Reels and Stories, and 4:5 (1080 × 1350) for the feed where it shows up larger than square. Start from your highest-quality source each time rather than resizing an already-resized copy, which compounds quality loss. The <a href="/tools/video-resizer/">Video Resizer</a> lets you produce each ratio from the same original, and keeping your subject centered means the same footage reframes cleanly into every placement.</p>`,
      },
      {
        heading: `Quick fixes for the most common Instagram fit problems`,
        html: `<p>Three issues come up again and again:</p><ul><li><strong>Top and bottom cut off:</strong> your clip is taller than 9:16, or important content sits in the safe-zone edges. Reframe so subjects stay central.</li><li><strong>Sides chopped on a landscape clip:</strong> a 16:9 video forced into 4:5 or 9:16 loses its width. Either reframe to the target ratio or use padding if the full width matters.</li><li><strong>Stretched or squished faces:</strong> the aspect ratio was changed without proper cropping. Re-export from the original at the correct ratio rather than stretching to fit.</li></ul><p>Confirm the corrected dimensions in the <a href="/tools/video-metadata-checker/">Metadata Checker</a> before you post.</p>`,
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
      {
        q: `Should I use the same video file for feed and Reels?`,
        a: `No. The feed favors 4:5 (1080 × 1350) and Reels use 9:16 (1080 × 1920). Export a separate version for each shape from your original source so neither gets cropped or boxed.`,
      },
      {
        q: `When is fit-with-padding the right choice over cropping?`,
        a: `Choose padding when losing the edges would cut off something important, like on-screen text or a wide graphic. For most full-screen vertical content, crop-to-fill looks cleaner because it avoids visible bars.`,
      },
      {
        q: `Why do faces look stretched after I resize?`,
        a: `That happens when the aspect ratio is changed by stretching rather than cropping. Re-export from the original at the target ratio using a proper crop, so the proportions stay natural.`,
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
      {
        heading: `Plan your Reel before you touch the footage`,
        html: `<p>A few seconds of planning saves a lot of editing. Before you trim, decide three things: the single idea the Reel communicates, the moment that earns the first second of attention, and the action you want viewers to take at the end (follow, comment, save). When those are clear, your edit almost writes itself. Write a one-line caption draft too, because it often reshapes how you cut the clip. If you are working from a longer recording, scrub through it once and note the timestamps of the strongest two or three moments. You will build the Reel around those, dropping everything in between.</p>`,
      },
      {
        heading: `Add captions, hooks, and on-screen text`,
        html: `<p>Most Reels are watched with the sound off at first, so on-screen text does heavy lifting. Add a short hook in the opening frame that tells viewers exactly what they are about to get, for example a question or a bold claim. Burn captions onto the video itself rather than relying only on platform auto-captions, since burned-in text survives reposting and looks consistent everywhere. Keep text inside the safe zone: leave roughly the top 10 percent and bottom 20 percent clear so platform buttons, the caption, and the profile bar do not cover your words. If you are unsure your text sits inside frame after resizing, confirm the final dimensions in the <a href="/tools/video-metadata-checker/">Metadata Checker</a>.</p>`,
      },
      {
        heading: `Common mistakes that flatten a good Reel`,
        html: `<p>A strong clip can still underperform because of small production errors. Watch out for these:</p><ul><li><strong>A slow first second.</strong> If nothing happens immediately, viewers swipe. Trim any countdown, settling, or dead air at the start.</li><li><strong>Exporting more than once at low quality.</strong> Every re-export loses detail. Edit, then export a single high-quality master, and only resize or compress from that.</li><li><strong>Resizing in the wrong order.</strong> Trim and edit first, then resize to 9:16 as the final shaping step, so you never crop important action out of frame.</li><li><strong>Tiny text near the edges.</strong> Words too close to the border get clipped or hidden by the interface on smaller phones.</li></ul><p>If your footage started as landscape, the safest path is to follow <a href="/blog/how-to-convert-video-to-9-16/">how to convert video to 9:16</a> rather than letting the app auto-crop.</p>`,
      },
      {
        heading: `A pre-post quality checklist`,
        html: `<p>Run this quick pass before you publish: the frame is 1080 wide by 1920 tall, the hook lands in the first second, captions are readable and inside the safe zone, audio is clear and not peaking, and the cover frame looks sharp on a small thumbnail. Keep the original master file too, so you can repurpose the same clip later for <a href="/blog/how-to-resize-video-for-tiktok/">TikTok</a> or YouTube Shorts without starting over. A reusable master is the difference between posting once and getting three pieces of content from one shoot.</p>`,
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
      {
        q: `Should I add captions to my Reel?`,
        a: `Yes. Many viewers watch with sound off, so burned-in captions and a clear on-screen hook keep people watching and make your message land even when muted.`,
      },
      {
        q: `In what order should I edit, resize, and compress?`,
        a: `Edit and trim first, then resize to 9:16 as the final shaping step, and compress last only if the file is too large. Doing it in this order avoids cropping out important action and limits quality loss.`,
      },
      {
        q: `Can I reuse the same Reel on TikTok and Shorts?`,
        a: `Yes, if it is your footage. Keep the high-quality master and re-export or lightly adjust it for each platform's length and safe-zone differences rather than reposting a downloaded copy.`,
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
      {
        heading: `Understand the 3-2-1 rule in plain terms`,
        html: `<p>The most trusted backup approach is simple to remember: keep <strong>3</strong> copies of anything you care about, on <strong>2</strong> different types of storage, with <strong>1</strong> copy kept off-site. In practice that might mean the master on your laptop, an automatic copy in the cloud, and a periodic copy on an external drive you keep elsewhere. The point is that no single failure, a dead drive, a lost phone, a locked account, can wipe out your work. Most creators already have two of the three without realizing it, so completing the system is usually less effort than it sounds.</p>`,
      },
      {
        heading: `Verify your backups actually work`,
        html: `<p>An untested backup is a guess. Once a month, open a random file from your cloud or external drive and confirm it plays and looks right. Check that automatic sync is still running, since app updates and storage limits silently pause it more often than people expect. Watch for the most common failure: your cloud plan fills up, new videos stop uploading, and you only find out when you need a file that was never saved. Confirming a restored copy matches the original is easy with the <a href="/tools/video-metadata-checker/">Metadata Checker</a>, which shows resolution and size so you can spot a truncated or downscaled file at a glance.</p>`,
      },
      {
        heading: `What platform archives include and what they leave out`,
        html: `<p>Official data downloads are valuable, but set your expectations. They usually deliver your posted videos at the resolution the platform stored them, which is often lower than your original export, and they may not include drafts, unpublished clips, or the exact captions and edits as posted. They can also take hours or days to be prepared. This is exactly why saving your source files on posting day matters: the archive is your safety net, not your primary copy. Treat the platform download as a recovery option for anything you forgot to save yourself.</p>`,
      },
      {
        heading: `A backup routine you will actually keep`,
        html: `<p>The best system is one that survives a busy week. Build small habits instead of big chores: drop the master into a dated folder the moment you finish editing, let cloud sync run automatically in the background, and set a recurring reminder every quarter to request platform archives and copy recent work to an external drive. Pair the routine with a clear folder structure so the archive stays searchable. Our <a href="/blog/how-to-organize-your-short-form-video-library/">library organization guide</a> covers a naming and folder system that scales as your catalog grows.</p>`,
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
      {
        q: `What is the 3-2-1 backup rule?`,
        a: `Keep three copies of your videos, on two different kinds of storage, with one copy off-site or in the cloud. It means no single failure, like a dead drive or a locked account, can erase your work.`,
      },
      {
        q: `Are platform data downloads as good as my original files?`,
        a: `Usually not. Archives often return your videos at the resolution the platform stored, which can be lower than your export, and may skip drafts or unpublished clips. Save your source files on posting day and treat archives as a backup.`,
      },
      {
        q: `How do I know my backups are actually working?`,
        a: `Test them. Open a random backed-up file each month to confirm it plays, check that automatic sync is still running, and watch that your cloud storage has not filled up and quietly stopped uploading.`,
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
      {
        heading: `Why platform terms add a second layer of rules`,
        html: `<p>Copyright law decides who owns a creative work, but the platform's terms of service decide what you are allowed to do inside the app. These are two separate rulebooks, and you have to satisfy both. Many platforms explicitly prohibit downloading, scraping, or republishing other users' content even when copyright might otherwise look murky to you. That means a video can be perfectly visible, you could technically capture it, and you would still be breaking the rules you agreed to when you signed up. When you reuse content, ask not only "do I have the creator's permission" but also "does the platform allow this kind of reuse."</p>`,
      },
      {
        heading: `Common myths that get creators in trouble`,
        html: `<p>A few beliefs cause most copyright problems. None of them hold up:</p><ul><li><strong>"It was free to download, so it is free to use."</strong> Being able to save a file says nothing about your right to reuse it.</li><li><strong>"I only used a few seconds."</strong> There is no safe number of seconds. Short clips of music or footage can still infringe.</li><li><strong>"I changed it, so it is mine now."</strong> Editing, speeding up, or adding text to someone else's work does not transfer ownership to you.</li><li><strong>"No copyright intended."</strong> A caption disclaimer has no legal effect. Intent does not grant permission.</li></ul><p>If a video clearly is not yours, the dependable answer is to ask the owner or use your own footage instead.</p>`,
      },
      {
        heading: `Music and audio are their own copyright`,
        html: `<p>People often clear the video and forget the sound. A song, a backing track, or even background audio in someone's clip is usually owned separately from the footage, sometimes by multiple rights holders at once. Platforms run automated audio detection that can mute your video, block it in some countries, or redirect revenue to the rights holder, often without warning. The reliable path is to use a platform's licensed in-app audio library, music you have specifically licensed, or sound you recorded yourself. Permission to use someone's footage does not automatically cover the music inside it.</p>`,
      },
      {
        heading: `Keep a simple permission record`,
        html: `<p>If you do get the green light to reuse a video, document it so you can prove it later. Save the creator's written reply, note the exact video or link it covers, record the date and the specific use they approved, and keep how they asked to be credited. A short folder or note per project is enough. Should a dispute or takedown ever arise, that record is what protects you. For a worked example of requesting and saving permission, see <a href="/blog/how-to-save-x-twitter-videos-you-have-permission-to-use/">saving videos you have permission to use</a>.</p>`,
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
      {
        q: `I downloaded a video easily, does that mean I can use it?`,
        a: `No. Being able to save a file says nothing about your right to reuse it. The creator still holds copyright, and the platform's terms may forbid downloading or reposting regardless.`,
      },
      {
        q: `Do I need separate permission for the music in a video?`,
        a: `Usually yes. Music and audio are typically owned separately from the footage, often by multiple rights holders. Permission to use someone's video does not cover the song inside it, so use licensed or original audio.`,
      },
      {
        q: `Does writing 'no copyright intended' protect me?`,
        a: `No. That phrase has no legal effect and does not grant permission. The only reliable protections are owning the content, having a license, or getting the owner's documented consent.`,
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
      {
        heading: `Match the file size to the channel's limits`,
        html: `<p>Different channels accept very different sizes, and knowing the ceiling lets you compress smartly instead of letting an app guess. As a rough guide, standard email attachments top out around 25 MB, WhatsApp limits media to roughly a couple of hundred MB depending on version, and cloud links have effectively no size cap. When your file is well under the limit, send it directly. When it is over, decide deliberately: compress once to fit, or skip the limit entirely with a link. For messaging apps specifically, <a href="/blog/how-to-compress-video-for-whatsapp/">compressing for WhatsApp</a> walks through target sizes that keep clips sharp.</p>`,
      },
      {
        heading: `Why one good compression beats five automatic ones`,
        html: `<p>Quality loss is cumulative. When you send a video through a chat app, then it gets forwarded, then someone re-sends it, each hop re-compresses an already-compressed file and the picture degrades a little more every time. This is called generation loss, and it is why a clip that has bounced around looks soft and blocky. The fix is to compress intentionally once with sensible settings, using a tool like the <a href="/tools/video-compressor/">Video Compressor</a>, then share that file or, better, a link to it. Starting from your highest-quality master each time, rather than re-sharing an already-shrunk copy, keeps every recipient close to the original.</p>`,
      },
      {
        heading: `Platform-specific tips for sharing`,
        html: `<p>A few channel-specific moves preserve a lot of detail:</p><ul><li><strong>WhatsApp and Telegram:</strong> use "send as document" or "send as file" instead of the media button to skip aggressive re-compression.</li><li><strong>iMessage:</strong> turn off Low Quality Image Mode in settings so videos send closer to full quality.</li><li><strong>Email:</strong> for anything over the attachment limit, attach a cloud link rather than the file.</li><li><strong>Cloud links:</strong> share a direct download link, not a preview-only view, so the recipient gets the actual file and not a re-encoded stream.</li></ul>`,
      },
      {
        heading: `When sending a link is the better default`,
        html: `<p>If quality matters at all, make the link your first choice rather than the fallback. Cloud links bypass app re-compression entirely, work for files of any size, let you update the file without resending, and give the recipient the exact bytes you uploaded. Direct file sharing is fine for quick, casual clips where a little softness does not matter, but for portfolio pieces, client deliverables, or anything you might reuse later, upload once and send the link. If you want to confirm the recipient received the resolution you intended, compare the downloaded copy against your original in the <a href="/tools/video-metadata-checker/">Metadata Checker</a>.</p>`,
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
      {
        q: `What size video can I attach to an email?`,
        a: `Most email services cap attachments around 25 MB. For anything larger, upload to cloud storage and send a download link instead of attaching the file.`,
      },
      {
        q: `What is generation loss?`,
        a: `It is the cumulative quality loss that happens when an already-compressed video is re-compressed again with each forward or re-send. Always share from your original master, and ideally share a link, to avoid stacking up the loss.`,
      },
      {
        q: `How do I send a video as a file instead of media?`,
        a: `In apps like WhatsApp and Telegram, use the document or file attachment option rather than the photo and video button. That skips much of the automatic re-compression and preserves more detail.`,
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
      {
        heading: `Understand bitrate and frame rate too`,
        html: `<p>Resolution and file size tell most of the story, but two more numbers explain why a video looks the way it does. <strong>Bitrate</strong> is how much data is used per second, measured in Mbps; a higher bitrate generally means more detail and a larger file. <strong>Frame rate</strong> is how many frames play per second (commonly 24, 30, or 60 fps); it controls how smooth motion looks. Two clips at the same 1080 by 1920 resolution can differ wildly in quality if one has a much lower bitrate. When a video looks soft despite a high resolution, a low bitrate is usually the reason. The <a href="/tools/video-metadata-checker/">Metadata Checker</a> surfaces these details so you are not guessing.</p>`,
      },
      {
        heading: `Quick aspect ratio math`,
        html: `<p>Aspect ratio is just width divided by height, and you can read it straight off the resolution. Here are the ratios you will meet most:</p><table><thead><tr><th>Resolution</th><th>Aspect ratio</th><th>Typical use</th></tr></thead><tbody><tr><td>1080 x 1920</td><td>9:16</td><td>Reels, TikTok, Shorts</td></tr><tr><td>1080 x 1080</td><td>1:1</td><td>Square feed posts</td></tr><tr><td>1920 x 1080</td><td>16:9</td><td>YouTube, landscape video</td></tr><tr><td>1080 x 1350</td><td>4:5</td><td>Portrait feed posts</td></tr></tbody></table><p>If the ratio does not match your target, see the <a href="/blog/video-aspect-ratio-guide/">aspect ratio guide</a> before resizing.</p>`,
      },
      {
        heading: `Troubleshooting confusing or wrong numbers`,
        html: `<p>A few readings surprise people. If your phone shows a landscape clip as 1920 by 1080 but it plays vertically, the file carries a rotation flag that some property panels ignore; the in-browser checker reads the displayed orientation. If the file size seems huge for a short clip, the bitrate or frame rate is likely high, common with screen recordings and slow-motion. If two tools report slightly different durations, rounding and variable frame rate are usually the cause. When numbers disagree, trust the tool that reads the actual file rather than a cached thumbnail or a system preview.</p>`,
      },
      {
        heading: `Turn the numbers into the right next step`,
        html: `<p>Checking is only useful if it changes what you do next. Use this quick map: wrong shape or dimensions, resize with the <a href="/tools/video-resizer/">Video Resizer</a>; file too large for the channel, shrink it with the <a href="/tools/video-compressor/">Video Compressor</a>; clip too long for a platform limit, trim before exporting; format incompatible, re-export to MP4 with H.264. Running this check before every upload takes seconds and prevents the two most common failures: a platform cropping your video unexpectedly, or an upload getting rejected outright.</p>`,
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
      {
        q: `What is bitrate and why does it matter?`,
        a: `Bitrate is how much data a video uses per second, measured in Mbps. A higher bitrate usually means more detail and a larger file. A clip can look soft even at high resolution if its bitrate is low.`,
      },
      {
        q: `How do I work out a video's aspect ratio?`,
        a: `Divide the width by the height. For example, 1080 by 1920 is 9:16 (vertical), 1080 by 1080 is 1:1 (square), and 1920 by 1080 is 16:9 (landscape).`,
      },
      {
        q: `Why does my vertical video show as 1920 by 1080?`,
        a: `The file likely carries a rotation flag that some property panels ignore, so it lists the raw frame size. A tool that reads the displayed orientation, like the in-browser Metadata Checker, will show how it actually plays.`,
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
      {
        heading: `Common upload problems and how to fix them`,
        html: `<p>Most MOV upload failures trace back to one of a few causes. Knowing them saves a lot of guessing.</p><ul><li><strong>ProRes inside a MOV:</strong> Mac editors often export MOV files wrapped around Apple ProRes, an editing codec, not a delivery codec. The file can be huge and some uploaders reject it. Re-export as MP4 with H.264 instead.</li><li><strong>HEVC compatibility:</strong> newer iPhones record in HEVC (H.265), which a few platforms and older devices struggle with. If a clip plays for you but not for others, convert it to H.264.</li><li><strong>Oversized files timing out:</strong> a large MOV can stall on a weak connection. Bringing the size down with the <a href="/tools/video-compressor/">Video Compressor</a> usually clears this.</li></ul><p>When something refuses to upload, the quickest fix is almost always a clean MP4 export with H.264 video and AAC audio.</p>`,
      },
      {
        heading: `How to tell what is inside your file`,
        html: `<p>Because the container name does not reveal the codec, two files with the same extension can behave very differently. Before you upload, it helps to know what you actually have. Run the clip through the <a href="/tools/video-metadata-checker/">Metadata Checker</a> to see the container, video codec, audio codec, resolution, and file size in one place. If it reports H.264 video and AAC audio in an MP4 wrapper, you are in the safest possible state. If it shows ProRes or HEVC, plan to convert before posting anything important.</p>`,
      },
      {
        heading: `A simple workflow that avoids surprises`,
        html: `<p>You do not have to choose one format for everything. Use each where it is strongest:</p><ol><li>Record and edit in whatever your camera or editor prefers, MOV included.</li><li>Keep the high quality MOV or ProRes file as your master if you may re-edit later.</li><li>Export a final MP4 with H.264 for every upload and share.</li><li>Verify the export, then post.</li></ol><p>This keeps your editing flexible while making sure the version that reaches viewers is the one platforms handle most reliably. For platform specific targets, see <a href="/blog/best-video-format-for-youtube-shorts/">best video format for YouTube Shorts</a>.</p>`,
      },
      {
        heading: `Audio and metadata differences to watch`,
        html: `<p>The picture is only half the story. MP4 pairs naturally with AAC audio, which every platform expects, while a MOV exported from some editors may carry uncompressed PCM audio that bloats the file and occasionally trips up uploaders. Converting to MP4 with AAC fixes this in one step. Containers also store metadata differently: rotation flags, creation dates, and color information can survive a MOV export but get dropped or reinterpreted when a file moves between apps. A common symptom is a clip that looks upright on your phone but appears sideways after upload, caused by a rotation flag the platform ignored. If you hit this, re-export so the video is baked in at the correct orientation rather than relying on a flag, and confirm the result before posting.</p>`,
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
      {
        q: `My MOV uploads but looks worse than the MP4. Why?`,
        a: `If the MOV uses a high bitrate editing codec, the platform has to compress it harder on its end, which can soften the result. Exporting a properly sized MP4/H.264 yourself gives the platform cleaner input to work from.`,
      },
      {
        q: `Should I keep my MOV master files?`,
        a: `Yes, if you may re-edit later. Editing codecs like ProRes preserve more quality for further work. Just deliver an MP4 copy for uploading and sharing.`,
      },
      {
        q: `Does converting MOV to MP4 lose quality?`,
        a: `Re-encoding always carries some loss, but exporting at a high bitrate keeps it minimal and visually hard to notice. The compatibility gain is usually worth it for anything you post.`,
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
      {
        heading: `Common mistakes that hurt uploads`,
        html: `<p>A few avoidable habits cause most upload disappointments:</p><ul><li><strong>Re-exporting an already-compressed clip:</strong> every extra pass softens detail. Always go back to your clean master, not a downloaded or shared copy.</li><li><strong>Letting the platform crop for you:</strong> if the shape is wrong, the app may zoom in and cut off heads or captions. Resize first.</li><li><strong>Burning captions into the unsafe zone:</strong> text near the very bottom or top can sit behind platform buttons and the username. Keep important text in the central area.</li><li><strong>Ignoring audio levels:</strong> a clip that is too quiet gets skipped. Aim for clear, consistent loudness.</li></ul>`,
      },
      {
        heading: `Mind the safe zones for text and faces`,
        html: `<p>Short-form apps overlay your video with interface elements: the caption and handle along the bottom left, and the like, comment, and share buttons down the right side. Anything important you place in those areas can be hidden. Keep faces, key action, and on-screen text within the central column and away from the bottom 15 percent or so of the frame. Previewing in the app before publishing, or simply visualizing those overlays, catches problems early. If you need to recompose the frame, the <a href="/tools/freeform-crop-video/">Freeform Crop tool</a> lets you shift the important content into a safer position.</p>`,
      },
      {
        heading: `A final pre-publish checklist`,
        html: `<p>Run through this in order right before you post:</p><ol><li>Aspect ratio matches the placement.</li><li>Resolution is 1080 wide on the short side, not larger than needed.</li><li>Format is MP4 with H.264 video and AAC audio.</li><li>File size is under the platform limit.</li><li>Audio is clear and at a consistent level.</li><li>Captions and faces sit inside the safe zone.</li><li>A strong cover frame is ready.</li><li>Metadata is verified one last time.</li></ol><p>For why this matters even after a clean export, see <a href="/blog/why-your-video-loses-quality-after-upload/">why your video loses quality after upload</a>.</p>`,
      },
      {
        heading: `Platform-specific quirks to plan for`,
        html: `<p>The general checklist gets you most of the way, but each platform has its own habits worth knowing. Instagram favors a 4:5 portrait in the main feed and full 9:16 for Reels and Stories, so a single square clip will not look ideal everywhere. TikTok leans fully vertical and rewards clips that hook in the first second, since the caption and buttons crowd the lower right. YouTube Shorts also wants 9:16 but sits inside an app that still serves landscape video, so keep your Short clearly vertical to avoid being padded. WhatsApp and other messaging apps compress hard, so if you are sharing rather than publishing, expect a softer result and send the smallest acceptable file. Knowing these tendencies before you export means fewer surprises after you post, and less re-uploading to fix something you could have set correctly the first time.</p>`,
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
      {
        q: `Why does my video get cropped when I upload it?`,
        a: `The clip's shape does not match the placement, so the app crops or zooms to fit. Resize to the correct aspect ratio before uploading so you control exactly what stays in frame.`,
      },
      {
        q: `Where should I place captions so they are not hidden?`,
        a: `Keep on-screen text in the central area of the frame, away from the bottom 15 percent and the right edge, where the platform places the caption, handle, and action buttons.`,
      },
      {
        q: `Is it better to upload over Wi-Fi or mobile data?`,
        a: `A strong, stable connection is what matters most. Some apps reduce upload quality on weak networks, so a solid Wi-Fi or strong data signal helps your file arrive intact.`,
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
      {
        heading: `Crop or pad: choosing the right approach`,
        html: `<p>When a video does not match your target ratio, you have two honest options. <strong>Cropping</strong> fills the new shape completely by trimming the edges, which keeps the screen full but can cut off important content. <strong>Padding</strong> keeps the entire original frame and adds bars to fill the gap, which preserves everything but wastes screen space. As a rule, crop when the subject is centered and the edges are unimportant, and pad when every part of the frame matters, such as text that runs to the edges. For repositioning during a crop, the <a href="/tools/freeform-crop-video/">Freeform Crop tool</a> lets you pick exactly which part of the frame to keep.</p>`,
      },
      {
        heading: `Why one master can feed many ratios`,
        html: `<p>If you publish across several platforms, do not reshoot for each one. Record or edit in the widest useful frame, then export crops for each destination. A common approach is to shoot 9:16 vertical with the subject centered, then derive a 1:1 square and a 4:5 portrait from the same source by trimming the top and bottom. Keep the full-quality vertical export as your master and treat the other ratios as derivatives. This saves shooting time and keeps a consistent look across every platform.</p>`,
      },
      {
        heading: `Common aspect ratio mistakes`,
        html: `<p>Watch for these recurring errors:</p><ul><li><strong>Uploading 16:9 to a vertical feed:</strong> the video appears as a small strip with large empty bars, looking unfinished.</li><li><strong>Letting the app crop automatically:</strong> uncontrolled cropping often cuts off heads or captions. Set the ratio yourself first.</li><li><strong>Stretching instead of cropping:</strong> forcing a wide clip into a tall frame distorts faces. Always crop or pad, never stretch.</li><li><strong>Mismatched resolution:</strong> 9:16 should be 1080 by 1920, not an odd size that the platform has to rescale.</li></ul><p>Confirm your final dimensions with the <a href="/tools/video-metadata-checker/">Metadata Checker</a> before posting.</p>`,
      },
      {
        heading: `Designing your shot for the target ratio`,
        html: `<p>The cleanest way to handle aspect ratio is to plan it before you ever press record. If you know a clip is destined for a vertical feed, frame it vertically from the start so you are not forced to crop away half the picture later. When you are unsure where a video will end up, shoot with breathing room: keep the subject centered and leave margin around the edges so the same footage can be cropped to 9:16, 1:1, or 4:5 without losing anything important. Avoid placing essential action right at the frame edge, since that is the first thing any crop removes. A little composition discipline up front means a single shoot can serve every placement, and your conversions become simple trims rather than rescues. See <a href="/blog/how-to-prepare-videos-for-upload/">how to prepare videos for upload</a> for the final checks once the shape is set.</p>`,
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
      {
        q: `Can I make several aspect ratios from one video?`,
        a: `Yes. Start from a high-quality source framed with room to spare, then crop derivatives for each placement. A centered 9:16 master can yield 1:1 and 4:5 versions by trimming the top and bottom.`,
      },
      {
        q: `What happens if I upload the wrong aspect ratio?`,
        a: `The platform either adds bars to pad the video or crops it to fit. Padding wastes screen space and cropping can cut off important content, so it is better to set the correct ratio yourself first.`,
      },
      {
        q: `Is stretching a video to fit a new ratio ever a good idea?`,
        a: `No. Stretching distorts faces and motion. Always crop to fill or pad to preserve the frame instead of changing the proportions of the picture.`,
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
      {
        heading: `Bitrate matters more than resolution`,
        html: `<p>Resolution gets all the attention, but bitrate, the amount of data per second of video, is what actually controls how clean the picture looks. A 1080p clip exported at a low bitrate can look blockier than a well-encoded 720p one, especially in fast motion, gradients, and dark scenes. When you export, choose a generous bitrate so the platform's re-compression starts from rich source data. Heavily compressed inputs leave the encoder little to work with, and the result looks soft no matter how high the resolution number is.</p>`,
      },
      {
        heading: `Content that compresses badly`,
        html: `<p>Some footage survives re-compression better than others. Fast motion, confetti, rain, smoke, water, fine textures, and subtle gradients are all hard to compress and tend to show artifacts after upload. Heavy film grain and noise are especially costly because the encoder treats random detail as information to preserve, wasting bitrate. If a clip looks rough after posting, the content itself may be the cause. Filming with steady motion, good lighting, and clean backgrounds gives the encoder an easier job and a sharper final result.</p>`,
      },
      {
        heading: `How to diagnose where quality was lost`,
        html: `<p>Before assuming the platform ruined your clip, trace the chain backward:</p><ol><li>Check your master file in the <a href="/tools/video-metadata-checker/">Metadata Checker</a>. Confirm it is genuinely high resolution and high bitrate.</li><li>Compare it to what you actually uploaded. Make sure you did not grab an exported preview or a shared copy by mistake.</li><li>Note whether the file passed through any messaging app or third tool along the way.</li><li>Only then compare the posted version.</li></ol><p>Often the loss happened before the upload, not during it. A clean pipeline from master to platform is the single biggest fix, as covered in <a href="/blog/how-to-prepare-videos-for-upload/">how to prepare videos for upload</a>.</p>`,
      },
      {
        heading: `What a single re-compression actually does`,
        html: `<p>It helps to picture what happens in one pass. A video encoder shrinks a file by discarding detail the eye is least likely to notice: it groups similar pixels, simplifies subtle color shifts, and predicts motion between frames rather than storing each one in full. Done once on a rich source, the loss is usually invisible. The trouble is that the next encoder cannot recover what the first one threw away, so it discards a second layer on top, and artifacts that were hidden start to show as blockiness, banding in skies, and smeared edges in motion. This is why a clip that passed through a chat app and then an upload looks markedly worse than one uploaded directly. Each link in the chain is permanent, so the practical goal is simple: keep the number of compressions as low as possible and make the first one count by starting from a high quality master.</p>`,
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
      {
        q: `What is bitrate and why does it matter for quality?`,
        a: `Bitrate is the amount of data used per second of video. A higher bitrate preserves more detail, which gives the platform's re-compression cleaner source data to work from. Low-bitrate exports look soft even at high resolution.`,
      },
      {
        q: `Why do some clips look worse than others after uploading?`,
        a: `Fast motion, grain, smoke, water, and fine textures are hard to compress, so they show more artifacts after re-encoding. Steady, well-lit footage with clean backgrounds holds up better.`,
      },
      {
        q: `How can I tell whether the platform or my own file caused the quality loss?`,
        a: `Check your master's resolution and bitrate first, confirm you uploaded that exact file and not a preview or shared copy, and note whether it passed through any other apps. The loss often happens before the upload.`,
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
      {
        heading: `Add a status or version system`,
        html: `<p>Beyond folders and dates, a short status tag tells you instantly where a project stands without opening files. Append a stage to the file name or use a small set of status subfolders:</p><ul><li><strong>wip</strong> for works in progress you are still editing.</li><li><strong>final</strong> for the approved master export.</li><li><strong>posted</strong> for versions already published.</li><li><strong>archive</strong> for older work you are keeping but not touching.</li></ul><p>Pair this with a version number, such as <code>_v2</code>, so you never overwrite a good cut by accident. When you have several takes, the highest version with a final tag is always the one to publish.</p>`,
      },
      {
        heading: `Keep a lightweight content log`,
        html: `<p>A simple spreadsheet alongside your folders turns a pile of files into a usable archive. One row per video with a handful of columns is enough: post date, topic, file name, platform, aspect ratio, and a note on how it performed. This lets you answer questions like which topics did best, find a clip to repurpose, or avoid reposting something too soon. It also doubles as a record of what you own, which matters if you ever need to prove a video is yours. Keep it in the same cloud folder as the library so the two stay together.</p>`,
      },
      {
        heading: `Repurpose without making a mess`,
        html: `<p>Reusing old footage is one of the best reasons to stay organized, but it can clutter your library fast. When you cut a new version from an existing clip, save it as a clearly named derivative rather than overwriting the original, for example <code>2026-05-12_coffee-tips_remix_1x1.mp4</code> in the same project folder. Keep the master untouched. If you are pulling a still for a cover, the <a href="/tools/video-thumbnail-extractor/">Thumbnail Extractor</a> grabs a frame without disturbing the source. This way one strong shoot can feed many posts while your originals stay clean and findable.</p>`,
      },
      {
        heading: `Move it off one device`,
        html: `<p>A library that lives only on your phone or one laptop is one drop or theft away from disappearing. Organization and safety go together: a clean folder structure is exactly what makes a reliable backup possible. Aim for the simple rule of keeping copies in more than one place, for example your working drive plus a cloud sync, so no single failure wipes out your work. Prioritize your master exports and your best performing clips, since those are the hardest to recreate. Storing raw memory cards untouched until a project is fully backed up adds another layer of safety. Once your structure and naming are consistent, syncing the whole library becomes automatic and you can find any file later, which is the real test of a backup. The full routine is covered in <a href="/blog/how-to-backup-your-own-social-media-videos/">how to back up your own social media videos</a>.</p>`,
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
      {
        q: `How do I keep track of which version of a video is final?`,
        a: `Add a status tag and version number to the file name, such as _final_v2, or use status subfolders for wip, final, posted, and archive. The highest version marked final is always the one to publish.`,
      },
      {
        q: `Do I need a spreadsheet to manage my videos?`,
        a: `It is optional but very helpful. A simple log with post date, topic, file name, platform, aspect ratio, and performance notes makes it easy to find clips to repurpose and to track what you own.`,
      },
      {
        q: `How should I save repurposed or remixed clips?`,
        a: `Save them as clearly named derivatives in the same project folder and leave the master untouched. Use a tag like _remix and the new aspect ratio so you can tell versions apart at a glance.`,
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
