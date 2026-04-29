import { describe, expect, it } from "vitest";
import { REGIONS, QUIZZES, ELECTION_FLOW, TIMELINES } from "@/data/regions";

describe("region data", () => {
  it("has supported regions", () => {
    expect(REGIONS.length).toBeGreaterThan(0);
  });

  it("has quiz questions for every region", () => {
    REGIONS.forEach((region) => {
      expect(QUIZZES[region.code].length).toBeGreaterThan(0);
    });
  });

  it("has election flow for every region", () => {
    REGIONS.forEach((region) => {
      expect(ELECTION_FLOW[region.code].length).toBeGreaterThan(0);
    });
  });

  it("has timeline data for every region", () => {
    REGIONS.forEach((region) => {
      expect(TIMELINES[region.code].length).toBeGreaterThan(0);
    });
  });
});
