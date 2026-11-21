import { describe, expect, it } from "vitest";
import { CHANNELS, PROGRAMS, filterPrograms } from "@/data/ramadan-tv";

describe("Ramadan TV starter data", () => {
  it("starts with the six project-owned virtual channels", () => {
    expect(CHANNELS.map((channel) => channel.number)).toEqual(["01", "02", "03", "04", "05", "06"]);
  });

  it("does not claim demo entries have playable or verified source material", () => {
    expect(PROGRAMS.length).toBeGreaterThan(0);
    expect(PROGRAMS.every((program) => program.availability === "demo" && program.source === null)).toBe(true);
  });

  it("filters archive items by historical era, channel, and Arabic search", () => {
    expect(filterPrograms(PROGRAMS, "الثمانينيات", "all", "").map((program) => program.id)).toEqual([
      "drama-80",
      "fawazeer-80",
      "ads-80",
      "music-80",
    ]);
    expect(filterPrograms(PROGRAMS, "all", "kids", "الأطفال").map((program) => program.id)).toEqual([
      "kids-90",
      "kids-2000",
    ]);
  });
});