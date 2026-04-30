type Message = {
  role: "user" | "assistant";
  content: string;
};

// 👇 Optional: Type safety for gtag (prevents TS errors)
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export const buildChatPayload = (messages: Message[], region: string) => {
  // 🔥 Google Analytics event (chat usage)
  window.gtag?.("event", "ai_chat_used", {
    event_category: "assistant",
    region,
    message_count: messages.length,
  });

  return {
    messages,
    region,
  };
};

export const canSendMessage = (input: string, loading: boolean) => {
  return input.trim().length > 0 && !loading;
};
