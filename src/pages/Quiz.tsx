import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/votesmart/Navbar";
import { Footer } from "@/components/votesmart/Footer";
import { Button } from "@/components/ui/button";
import { useRegion } from "@/components/votesmart/RegionContext";
import { QUIZZES, REGIONS } from "@/data/regions";
import { CheckCircle2, XCircle, RotateCcw, Trophy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const Quiz = () => {
  const { region } = useRegion();
  const r = REGIONS.find((x) => x.code === region)!;
  const questions = QUIZZES[region];
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => { reset(); /* eslint-disable-next-line */ }, [region]);

  const q = questions[idx];

  const choose = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    if (i === q.correct) setScore((s) => s + 1);
  };

  const next = async () => {
    if (idx + 1 < questions.length) {
      setIdx(idx + 1); setSelected(null);
    } else {
      setDone(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase.from("quiz_attempts").insert({
          user_id: user.id, region, topic: "general", score, total: questions.length,
        });
        if (!error) toast({ title: "Score saved!", description: `${score}/${questions.length} added to your progress.` });
      } else {
        toast({ title: "Sign in to save scores", description: "Your progress will sync across devices." });
      }
    }
  };

  const reset = () => { setIdx(0); setSelected(null); setScore(0); setDone(false); };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="container py-12 md:py-20 flex-1">
        <header className="max-w-2xl mb-10">
          <p className="text-sm text-accent font-medium">{r.flag} {r.name} Quiz</p>
          <h1 className="mt-2 font-display text-4xl md:text-5xl font-bold">Test your election knowledge.</h1>
          <p className="mt-3 text-muted-foreground">Quick questions. Instant explanations.</p>
        </header>

        <div className="max-w-2xl mx-auto">
          {!done ? (
            <div className="bg-card rounded-3xl p-8 shadow-card border border-border">
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm font-mono text-muted-foreground">Q{idx + 1} / {questions.length}</span>
                <span className="text-sm font-medium">Score: {score}</span>
              </div>
              <div className="h-1.5 bg-secondary rounded-full mb-6 overflow-hidden">
                <motion.div className="h-full bg-accent" animate={{ width: `${((idx) / questions.length) * 100}%` }} />
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <h2 className="font-display text-2xl font-semibold mb-6">{q.q}</h2>
                  <div className="space-y-2.5">
                    {q.options.map((opt, i) => {
                      const isCorrect = i === q.correct;
                      const isSelected = i === selected;
                      const showState = selected !== null;
                      return (
                        <button
                          key={i}
                          onClick={() => choose(i)}
                          disabled={selected !== null}
                          className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between ${
                            !showState
                              ? "border-border hover:border-accent hover:bg-secondary"
                              : isCorrect
                              ? "border-success bg-success/10"
                              : isSelected
                              ? "border-destructive bg-destructive/10"
                              : "border-border opacity-60"
                          }`}
                        >
                          <span className="font-medium">{opt}</span>
                          {showState && isCorrect && <CheckCircle2 className="w-5 h-5 text-success" />}
                          {showState && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-destructive" />}
                        </button>
                      );
                    })}
                  </div>

                  {selected !== null && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-5 p-4 rounded-xl bg-secondary text-sm"
                    >
                      <strong>Explanation:</strong> {q.explain}
                    </motion.div>
                  )}

                  {selected !== null && (
                    <Button onClick={next} className="mt-6 w-full" size="lg">
                      {idx + 1 < questions.length ? "Next question" : "See results"}
                    </Button>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card rounded-3xl p-10 shadow-elegant border border-border text-center"
            >
              <div className="w-20 h-20 mx-auto rounded-full bg-hero grid place-items-center shadow-glow">
                <Trophy className="w-10 h-10 text-accent" />
              </div>
              <h2 className="mt-6 font-display text-4xl font-bold">{score} / {questions.length}</h2>
              <p className="mt-2 text-muted-foreground">
                {score === questions.length ? "Perfect score! You're ready to vote." :
                 score >= questions.length * 0.6 ? "Great job! Brush up and you'll ace it next time." :
                 "Good start. Try the Learn page and come back!"}
              </p>
              <Button onClick={reset} size="lg" className="mt-8" variant="outline">
                <RotateCcw className="mr-2 w-4 h-4" /> Try again
              </Button>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Quiz;
