import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, MessageSquare, Map, ListChecks, Sparkles, ShieldCheck, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/votesmart/Navbar";
import { Footer } from "@/components/votesmart/Footer";
import { useRegion } from "@/components/votesmart/RegionContext";
import { REGIONS } from "@/data/regions";

const features = [
  { icon: MessageSquare, title: "AI Chat Assistant", desc: "Ask anything about elections in plain English. Get clear, neutral answers in seconds." },
  { icon: Map, title: "Visual Election Flow", desc: "See the entire process from registration to results as an interactive step-by-step diagram." },
  { icon: ListChecks, title: "Timelines & Deadlines", desc: "Never miss a date. Region-specific timelines for India, US, and UK." },
  { icon: Sparkles, title: "Quizzes That Stick", desc: "Test your knowledge and track your progress as you learn." },
  { icon: Globe, title: "Region-Aware", desc: "Switch between India, US, and UK. The whole app adapts to your context." },
  { icon: ShieldCheck, title: "Non-Partisan", desc: "Just the process — no political opinions, ever." },
];

const Index = () => {
  const { region } = useRegion();
  const r = REGIONS.find((x) => x.code === region)!;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero opacity-[0.97]" />
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: "radial-gradient(circle at 20% 20%, hsl(var(--accent)) 0%, transparent 40%), radial-gradient(circle at 80% 60%, hsl(var(--primary-glow)) 0%, transparent 50%)"
        }} />
        <div className="container relative py-20 md:py-32 text-primary-foreground">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-foreground/10 backdrop-blur text-xs font-medium border border-primary-foreground/20">
              <Sparkles className="w-3.5 h-3.5 text-accent" /> AI-powered civic education
            </span>
            <h1 className="mt-6 font-display text-5xl md:text-7xl font-bold leading-[1.05] text-balance">
              Elections,<br />
              <span className="text-accent">made simple.</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-primary-foreground/85 max-w-2xl text-balance">
              VoteSmart AI explains how elections work — from voter registration to result declaration —
              in clear, beginner-friendly language. Currently exploring {r.flag} <strong>{r.name}</strong>.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-glow">
                <Link to="/chat">Ask the AI <ArrowRight className="ml-1.5 w-4 h-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent">
                <Link to="/learn">Explore the process</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="container py-20 md:py-28">
        <div className="max-w-2xl mb-12">
          <h2 className="font-display text-4xl md:text-5xl font-bold">Everything you need to vote with confidence.</h2>
          <p className="mt-4 text-muted-foreground text-lg">Built for first-time voters, students, and anyone who wants the process — without the politics.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="group p-6 rounded-2xl bg-card border border-border shadow-card hover:shadow-elegant transition-all hover:-translate-y-1"
            >
              <div className="w-11 h-11 rounded-xl bg-secondary grid place-items-center text-primary mb-4 group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                <f.icon className="w-5 h-5" />
              </div>
              <h3 className="font-display text-xl font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-16">
        <div className="rounded-3xl bg-hero p-10 md:p-16 text-primary-foreground text-center shadow-elegant">
          <h2 className="font-display text-3xl md:text-5xl font-bold text-balance">Ready to understand your vote?</h2>
          <p className="mt-4 text-primary-foreground/80 max-w-xl mx-auto">Start with a question. The AI assistant is one click away.</p>
          <Button asChild size="lg" className="mt-8 bg-accent text-accent-foreground hover:bg-accent/90">
            <Link to="/chat">Start chatting <ArrowRight className="ml-1.5 w-4 h-4" /></Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
