export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export const buildChatPayload = (messages: ChatMessage[], region: string) => {
  return {
    messages,
    region,
  };
};

export const canSendMessage = (input: string, loading: boolean): boolean => {
  return input.trim().length > 0 && !loading;
};
