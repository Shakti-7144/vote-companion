import { motion } from "framer-motion";
import { Navbar } from "@/components/votesmart/Navbar";
import { Footer } from "@/components/votesmart/Footer";
import { useRegion } from "@/components/votesmart/RegionContext";
import { ELECTION_FLOW, REGIONS } from "@/data/regions";
import { ArrowDown } from "lucide-react";

const Learn = () => {
  const { region } = useRegion();
  const r = REGIONS.find((x) => x.code === region)!;
  const steps = ELECTION_FLOW[region];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="container py-12 md:py-20 flex-1">
        <header className="max-w-2xl mb-12">
          <p className="text-sm text-accent font-medium">{r.flag} {r.name} · {r.authority}</p>
          <h1 className="mt-2 font-display text-4xl md:text-6xl font-bold">The election process, step by step.</h1>
          <p className="mt-4 text-muted-foreground text-lg">Follow the journey from registering as a voter to seeing the final result.</p>
        </header>

        <div className="relative max-w-3xl mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="relative"
            >
              <div className="flex gap-5 items-start">
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-hero text-primary-foreground grid place-items-center text-2xl shadow-elegant">
                    {step.icon}
                  </div>
                  {i < steps.length - 1 && (
                    <div className="w-0.5 flex-1 bg-gradient-to-b from-primary/30 to-transparent my-2 min-h-[40px]" />
                  )}
                </div>
                <div className="flex-1 pb-10">
                  <span className="text-xs font-mono text-muted-foreground">STEP {String(i + 1).padStart(2, "0")}</span>
                  <h3 className="font-display text-2xl font-semibold mt-1">{step.title}</h3>
                  <p className="mt-2 text-muted-foreground">{step.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center text-sm text-muted-foreground">
          Have a question about a step? <a href="/chat" className="text-accent font-medium hover:underline">Ask the AI →</a>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Learn;
