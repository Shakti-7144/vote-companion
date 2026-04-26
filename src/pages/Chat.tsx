import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import { Send, Sparkles, Loader2 } from "lucide-react";
import { Navbar } from "@/components/votesmart/Navbar";
import { Footer } from "@/components/votesmart/Footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRegion } from "@/components/votesmart/RegionContext";
import { REGIONS } from "@/data/regions";
import { toast } from "@/hooks/use-toast";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS: Record<string, string[]> = {
  IN: ["How do I register to vote in India?", "What is an EVM and how does it work?", "What is the Model Code of Conduct?", "How are votes counted?"],
  US: ["How do I register to vote?", "What is the Electoral College?", "How does mail-in voting work?", "What's the difference between primaries and caucuses?"],
  UK: ["How do I register to vote in the UK?", "What ID do I need at a polling station?", "How does first-past-the-post work?", "When do polls open and close?"],
};

const Chat = () => {
  const { region } = useRegion();
  const r = REGIONS.find((x) => x.code === region)!;
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    setInput("");
    const userMsg: Msg = { role: "user", content };
    const next = [...messages, userMsg];
    setMessages(next);
    setLoading(true);

    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: next, region }),
      });

      if (resp.status === 429) { toast({ title: "Slow down", description: "Rate limit reached. Try again in a moment.", variant: "destructive" }); setLoading(false); return; }
      if (resp.status === 402) { toast({ title: "Credits exhausted", description: "Please add AI credits to your workspace.", variant: "destructive" }); setLoading(false); return; }
      if (!resp.ok || !resp.body) throw new Error("Stream failed");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let acc = "";
      let streamDone = false;

      setMessages((p) => [...p, { role: "assistant", content: "" }]);

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let nl: number;
        while ((nl = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, nl);
          buffer = buffer.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || !line.trim()) continue;
          if (!line.startsWith("data: ")) continue;
          const j = line.slice(6).trim();
          if (j === "[DONE]") { streamDone = true; break; }
          try {
            const parsed = JSON.parse(j);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              acc += delta;
              setMessages((p) => p.map((m, i) => (i === p.length - 1 ? { ...m, content: acc } : m)));
            }
          } catch {
            buffer = line + "\n" + buffer; break;
          }
        }
      }
    } catch (e) {
      console.error(e);
      toast({ title: "Something went wrong", description: "Couldn't reach the AI. Try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-civic">
      <Navbar />
      <main className="flex-1 container py-6 md:py-10 flex flex-col">
        <header className="mb-4">
          <p className="text-xs text-accent font-medium">{r.flag} {r.name} · {r.authority}</p>
          <h1 className="font-display text-2xl md:text-3xl font-bold">Ask VoteSmart AI</h1>
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto rounded-2xl bg-card border border-border shadow-card p-4 md:p-6 space-y-4 min-h-[50vh]">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-hero grid place-items-center shadow-glow mb-4">
                <Sparkles className="w-7 h-7 text-accent" />
              </div>
              <h2 className="font-display text-2xl font-semibold">How can I help you understand elections?</h2>
              <p className="text-muted-foreground mt-1 max-w-md">Pick a starter question or type your own below.</p>
              <div className="grid sm:grid-cols-2 gap-2 mt-6 w-full max-w-2xl">
                {SUGGESTIONS[region].map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-left p-3 rounded-xl border border-border bg-background hover:border-accent hover:bg-secondary transition-all text-sm"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  m.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
                }`}>
                  {m.role === "assistant" ? (
                    <div className="prose prose-sm max-w-none prose-headings:font-display prose-strong:text-foreground prose-p:text-foreground prose-li:text-foreground">
                      <ReactMarkdown>{m.content || "…"}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap text-sm">{m.content}</p>
                  )}
                </div>
              </motion.div>
            ))
          )}
          {loading && messages[messages.length - 1]?.role === "user" && (
            <div className="flex justify-start">
              <div className="bg-secondary rounded-2xl px-4 py-3">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            </div>
          )}
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); send(); }}
          className="mt-4 flex gap-2 items-end"
        >
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder={`Ask about ${r.name} elections…`}
            rows={1}
            className="resize-none min-h-[52px] bg-card"
            aria-label="Ask a question"
          />
          <Button type="submit" size="lg" disabled={!input.trim() || loading} className="h-[52px] px-5">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default Chat;
