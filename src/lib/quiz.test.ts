import { describe, expect, it } from "vitest";
import { calculatePercentage, getQuizFeedback, isCorrectAnswer } from "./quiz";

describe("quiz utilities", () => {
  it("checks correct answer", () => {
    expect(isCorrectAnswer(1, 1)).toBe(true);
    expect(isCorrectAnswer(0, 1)).toBe(false);
  });

  it("calculates percentage", () => {
    expect(calculatePercentage(3, 4)).toBe(75);
    expect(calculatePercentage(0, 0)).toBe(0);
  });

  it("gives feedback", () => {
    expect(getQuizFeedback(4, 4)).toContain("Perfect");
    expect(getQuizFeedback(3, 4)).toContain("Great job");
    expect(getQuizFeedback(1, 4)).toContain("Good start");
  });
});
