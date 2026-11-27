import type { Program } from "@/data/ramadan-tv";

type ProgramId = Program["id"];

// Add only verified, authorized links here; leave unlinked programs as demos.
export const VIDEO_URLS: Partial<Record<ProgramId, string>> = {
  // "drama-80": "https://www.youtube.com/watch?v=VIDEO_ID",
};