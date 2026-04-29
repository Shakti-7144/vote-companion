import { describe, expect, it } from "vitest";
import { buildChatPayload, canSendMessage } from "./chat";

describe("chat utilities", () => {
  it("allows valid message", () => {
    expect(canSendMessage("How do I vote?", false)).toBe(true);
  });

  it("blocks empty message", () => {
    expect(canSendMessage("   ", false)).toBe(false);
  });

  it("blocks message while loading", () => {
    expect(canSendMessage("Hello", true)).toBe(false);
  });

  it("builds chat payload", () => {
    const payload = buildChatPayload(
      [{ role: "user", content: "What is EVM?" }],
      "IN"
    );

    expect(payload.region).toBe("IN");
    expect(payload.messages[0].content).toBe("What is EVM?");
  });
});
