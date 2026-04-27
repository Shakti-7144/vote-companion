import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Users, Calendar, FileText } from "lucide-react";
import { Navbar } from "@/components/votesmart/Navbar";
import { Footer } from "@/components/votesmart/Footer";
import { VerificationBadge, VerificationStatus } from "@/components/votesmart/VerificationBadge";
import { useRegion } from "@/components/votesmart/RegionContext";
import { REGIONS } from "@/data/regions";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface Party {
  id: string;
  name: string;
  abbreviation: string | null;
  region: string;
  symbol_url: string | null;
  leader: string | null;
  founded_year: number | null;
  ideology: string | null;
  manifesto_link: string | null;
  official_site: string | null;
  status: VerificationStatus;
}

const Parties = () => {
  const { region } = useRegion();
  const r = REGIONS.find((x) => x.code === region)!;
  const [items, setItems] = useState<Party[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Political Parties — VoteSmart AI";
    setLoading(true);
    supabase
      .from("parties")
      .select("*")
      .eq("region", region)
      .order("name", { ascending: true })
      .then(({ data }) => {
        setItems((data ?? []) as Party[]);
        setLoading(false);
      });
  }, [region]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <section className="container py-12 md:py-16 flex-1">
        <div className="max-w-3xl">
          <span className="text-xs font-medium uppercase tracking-wider text-accent">Reference</span>
          <h1 className="mt-2 font-display text-4xl md:text-5xl font-bold">Political parties</h1>
          <p className="mt-3 text-muted-foreground text-lg">
            Registered parties in {r.flag} <strong>{r.name}</strong>. Each entry links to manifestos and official sites
            where available.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {loading && Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-56 rounded-2xl" />)}

          {!loading && items.length === 0 && (
            <div className="md:col-span-2 lg:col-span-3 p-10 text-center rounded-2xl border border-dashed border-border bg-card">
              <p className="text-muted-foreground">No parties recorded yet for {r.name}.</p>
            </div>
          )}

          {!loading &&
            items.map((p, i) => (
              <motion.article
                key={p.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.04 }}
                className="p-6 rounded-2xl bg-card border border-border shadow-card hover:shadow-elegant transition-all flex flex-col"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-secondary grid place-items-center overflow-hidden">
                      {p.symbol_url ? (
                        <img src={p.symbol_url} alt={`${p.name} symbol`} className="w-full h-full object-cover" />
                      ) : (
                        <span className="font-display font-bold text-primary">{p.abbreviation?.[0] ?? p.name[0]}</span>
                      )}
                    </div>
                    <div>
                      <h2 className="font-display text-lg font-semibold leading-tight">{p.name}</h2>
                      {p.abbreviation && <p className="text-xs text-muted-foreground">{p.abbreviation}</p>}
                    </div>
                  </div>
                  <VerificationBadge status={p.status} />
                </div>

                <dl className="mt-5 space-y-2 text-sm flex-1">
                  {p.leader && (
                    <Row icon={<Users className="w-3.5 h-3.5" />} label="Leader">{p.leader}</Row>
                  )}
                  {p.founded_year && (
                    <Row icon={<Calendar className="w-3.5 h-3.5" />} label="Founded">{p.founded_year}</Row>
                  )}
                  {p.ideology && (
                    <Row icon={<FileText className="w-3.5 h-3.5" />} label="Ideology">{p.ideology}</Row>
                  )}
                </dl>

                <div className="mt-5 flex flex-wrap gap-3 text-sm">
                  {p.official_site && (
                    <a href={p.official_site} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-1.5 font-medium text-accent hover:underline">
                      Official site <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {p.manifesto_link && (
                    <a href={p.manifesto_link} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-1.5 font-medium text-accent hover:underline">
                      Manifesto <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </motion.article>
            ))}
        </div>
      </section>
      <Footer />
    </div>
  );
};

const Row = ({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) => (
  <div className="flex items-start gap-2">
    <span className="mt-0.5 text-muted-foreground">{icon}</span>
    <span className="text-muted-foreground min-w-[68px]">{label}:</span>
    <span className="font-medium">{children}</span>
  </div>
);

export default Parties;