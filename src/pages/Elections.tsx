import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, ExternalLink, MapPin, Vote, Layers, Hourglass } from "lucide-react";
import { Navbar } from "@/components/votesmart/Navbar";
import { Footer } from "@/components/votesmart/Footer";
import { VerificationBadge, VerificationStatus } from "@/components/votesmart/VerificationBadge";
import { useRegion } from "@/components/votesmart/RegionContext";
import { REGIONS } from "@/data/regions";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface Election {
  id: string;
  name: string;
  region: string;
  election_type: string;
  voting_start_date: string | null;
  voting_end_date: string | null;
  nomination_deadline: string | null;
  result_date: string | null;
  phases: number | null;
  official_link: string | null;
  description: string | null;
  status: VerificationStatus;
}

const fmt = (d: string | null) =>
  d ? new Date(d).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) : "—";

const Elections = () => {
  const { region } = useRegion();
  const r = REGIONS.find((x) => x.code === region)!;
  const [items, setItems] = useState<Election[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Upcoming Elections — VoteSmart AI";
    setLoading(true);
    supabase
      .from("elections")
      .select("*")
      .eq("region", region)
      .order("voting_start_date", { ascending: true })
      .then(({ data }) => {
        setItems((data ?? []) as Election[]);
        setLoading(false);
      });
  }, [region]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <section className="container py-12 md:py-16 flex-1">
        <div className="max-w-3xl">
          <span className="text-xs font-medium uppercase tracking-wider text-accent">Dashboard</span>
          <h1 className="mt-2 font-display text-4xl md:text-5xl font-bold">Upcoming elections</h1>
          <p className="mt-3 text-muted-foreground text-lg">
            Key dates, deadlines and official links for {r.flag} <strong>{r.name}</strong>. Information is reviewed
            against {r.authority} and clearly labeled by verification status.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {loading &&
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-2xl" />
            ))}

          {!loading && items.length === 0 && (
            <div className="md:col-span-2 p-10 text-center rounded-2xl border border-dashed border-border bg-card">
              <p className="text-muted-foreground">No upcoming elections recorded yet for {r.name}.</p>
            </div>
          )}

          {!loading &&
            items.map((e, i) => (
              <motion.article
                key={e.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                className="p-6 rounded-2xl bg-card border border-border shadow-card hover:shadow-elegant transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-accent">
                      <Vote className="w-3.5 h-3.5" /> {e.election_type}
                    </span>
                    <h2 className="mt-1 font-display text-xl font-semibold leading-snug">{e.name}</h2>
                  </div>
                  <VerificationBadge status={e.status} />
                </div>

                {e.description && <p className="mt-3 text-sm text-muted-foreground">{e.description}</p>}

                <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
                  <Stat icon={<CalendarDays className="w-4 h-4" />} label="Voting">
                    {fmt(e.voting_start_date)}
                    {e.voting_end_date && e.voting_end_date !== e.voting_start_date ? ` – ${fmt(e.voting_end_date)}` : ""}
                  </Stat>
                  <Stat icon={<Hourglass className="w-4 h-4" />} label="Nomination deadline">
                    {fmt(e.nomination_deadline)}
                  </Stat>
                  <Stat icon={<Layers className="w-4 h-4" />} label="Phases">
                    {e.phases ?? 1}
                  </Stat>
                  <Stat icon={<MapPin className="w-4 h-4" />} label="Result date">
                    {fmt(e.result_date)}
                  </Stat>
                </dl>

                {e.official_link && (
                  <a
                    href={e.official_link}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
                  >
                    Official source <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </motion.article>
            ))}
        </div>
      </section>
      <Footer />
    </div>
  );
};

const Stat = ({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) => (
  <div>
    <dt className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-muted-foreground">
      {icon} {label}
    </dt>
    <dd className="mt-1 font-medium">{children}</dd>
  </div>
);

export default Elections;