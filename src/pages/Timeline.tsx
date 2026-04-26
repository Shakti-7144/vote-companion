import { motion } from "framer-motion";
import { Navbar } from "@/components/votesmart/Navbar";
import { Footer } from "@/components/votesmart/Footer";
import { useRegion } from "@/components/votesmart/RegionContext";
import { TIMELINES, REGIONS } from "@/data/regions";

const Timeline = () => {
  const { region } = useRegion();
  const r = REGIONS.find((x) => x.code === region)!;
  const events = TIMELINES[region];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="container py-12 md:py-20 flex-1">
        <header className="max-w-2xl mb-12">
          <p className="text-sm text-accent font-medium">{r.flag} {r.name}</p>
          <h1 className="mt-2 font-display text-4xl md:text-6xl font-bold">Election timeline & key dates.</h1>
          <p className="mt-4 text-muted-foreground text-lg">Counted in weeks before polling day. Use this as your prep checklist.</p>
        </header>

        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-border" />
          {events.map((e, i) => (
            <motion.div
              key={e.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className={`relative grid md:grid-cols-2 gap-6 mb-8 ${i % 2 === 0 ? "" : "md:[direction:rtl]"}`}
            >
              <div className={`pl-12 md:pl-0 ${i % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12 [direction:ltr]"}`}>
                <div className="inline-block px-3 py-1 rounded-full bg-secondary text-xs font-mono">
                  {e.weeksBefore > 0 ? `T-${e.weeksBefore}w` : e.weeksBefore === 0 ? "Polling Day" : `T+${Math.abs(e.weeksBefore)}w`}
                </div>
                <h3 className="font-display text-xl font-semibold mt-2">{e.label}</h3>
                <p className="text-muted-foreground text-sm mt-1">{e.detail}</p>
              </div>
              <div className="hidden md:block" />
              <div className="absolute left-4 md:left-1/2 top-2 -translate-x-1/2 w-4 h-4 rounded-full bg-accent ring-4 ring-background shadow-glow" />
            </motion.div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Timeline;
