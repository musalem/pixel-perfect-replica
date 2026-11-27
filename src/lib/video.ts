import { VIDEO_URLS } from "@/data/videos";

export type ParsedVideoSource =
  | { kind: "youtube"; videoId: string }
  | { kind: "mp4"; url: string };

export type ProgramVideoStatus = "available" | "demo" | "invalid";

const YOUTUBE_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;
const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "youtube-nocookie.com",
  "www.youtube-nocookie.com",
]);

function isYouTubeId(value: string | null | undefined): value is string {
  return typeof value === "string" && YOUTUBE_ID_PATTERN.test(value);
}

export function parseVideoUrl(value: string): ParsedVideoSource | null {
  let url: URL;
  try {
    url = new URL(value.trim());
  } catch {
    return null;
  }

  if (url.protocol !== "https:" || url.username || url.password) return null;

  const hostname = url.hostname.toLowerCase();
  if (hostname === "youtu.be" || hostname === "www.youtu.be") {
    const segments = url.pathname.split("/").filter(Boolean);
    const videoId = segments.length === 1 ? segments[0] : undefined;
    return isYouTubeId(videoId) ? { kind: "youtube", videoId } : null;
  }

  if (YOUTUBE_HOSTS.has(hostname)) {
    const segments = url.pathname.split("/").filter(Boolean);
    let videoId: string | null | undefined;
    if (url.pathname === "/watch") videoId = url.searchParams.get("v");
    if (segments[0] === "shorts" || segments[0] === "embed") videoId = segments[1];
    return isYouTubeId(videoId) ? { kind: "youtube", videoId } : null;
  }

  if (url.pathname.toLowerCase().endsWith(".mp4")) {
    return { kind: "mp4", url: url.toString() };
  }

  return null;
}

export function getProgramVideoSource(programId: string): ParsedVideoSource | null {
  const url = VIDEO_URLS[programId as keyof typeof VIDEO_URLS];
  return typeof url === "string" ? parseVideoUrl(url) : null;
}

export function getProgramVideoStatus(programId: string): ProgramVideoStatus {
  const url = VIDEO_URLS[programId as keyof typeof VIDEO_URLS];
  if (typeof url !== "string") return "demo";
  return parseVideoUrl(url) ? "available" : "invalid";
}

export function getProgramStatusNote(status: ProgramVideoStatus): string {
  if (status === "available") return "رابط مشاهدة متاح لهذا العنوان.";
  if (status === "invalid") return "تعذّر تشغيل الرابط؛ يُرجى التحقق من صيغته.";
  return "عنوان توضيحي بلا رابط مشاهدة.";
}