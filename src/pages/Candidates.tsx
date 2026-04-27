import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, GraduationCap, Briefcase, MapPin, FileSignature } from "lucide-react";
import { Navbar } from "@/components/votesmart/Navbar";
import { Footer } from "@/components/votesmart/Footer";
import { VerificationBadge, VerificationStatus } from "@/components/votesmart/VerificationBadge";
import { useRegion } from "@/components/votesmart/RegionContext";
import { REGIONS } from "@/data/regions";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface Candidate {
  id: string;
  name: string;
  region: string;
  constituency: string | null;
  age: number | null;
  education: string | null;
  profession: string | null;
  affidavit_link: string | null;
  photo_url: string | null;
  bio: string | null;
  status: VerificationStatus;
  party: { name: string; abbreviation: string | null } | null;
}

const Candidates = () => {
  const { region } = useRegion();
  const r = REGIONS.find((x) => x.code === region)!;
  const [items, setItems] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Candidates — VoteSmart AI";
    setLoading(true);
    (async () => {
      const { data: candidates } = await supabase
        .from("candidates")
        .select("*")
        .eq("region", region)
        .order("name", { ascending: true });
      const partyIds = Array.from(new Set((candidates ?? []).map((c) => c.party_id).filter(Boolean) as string[]));
      let partyMap: Record<string, { name: string; abbreviation: string | null }> = {};
      if (partyIds.length) {
        const { data: parties } = await supabase.from("parties").select("id,name,abbreviation").in("id", partyIds);
        partyMap = Object.fromEntries((parties ?? []).map((p) => [p.id, { name: p.name, abbreviation: p.abbreviation }]));
      }
      const merged = (candidates ?? []).map((c) => ({
        ...c,
        party: c.party_id ? partyMap[c.party_id] ?? null : null,
      })) as Candidate[];
      setItems(merged);
      setLoading(false);
    })();
  }, [region]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <section className="container py-12 md:py-16 flex-1">
        <div className="max-w-3xl">
          <span className="text-xs font-medium uppercase tracking-wider text-accent">Reference</span>
          <h1 className="mt-2 font-display text-4xl md:text-5xl font-bold">Candidates</h1>
          <p className="mt-3 text-muted-foreground text-lg">
            Public-record information about candidates in {r.flag} <strong>{r.name}</strong>. Affidavits, education and
            constituency details — clearly tagged by verification status.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {loading && Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-64 rounded-2xl" />)}

          {!loading && items.length === 0 && (
            <div className="md:col-span-2 lg:col-span-3 p-10 text-center rounded-2xl border border-dashed border-border bg-card">
              <p className="text-muted-foreground">No candidates recorded yet for {r.name}.</p>
            </div>
          )}

          {!loading &&
            items.map((c, i) => (
              <motion.article
                key={c.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.04 }}
                className="p-6 rounded-2xl bg-card border border-border shadow-card hover:shadow-elegant transition-all flex flex-col"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-secondary grid place-items-center overflow-hidden">
                      {c.photo_url ? (
                        <img src={c.photo_url} alt={c.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="font-display font-bold text-primary">{c.name[0]}</span>
                      )}
                    </div>
                    <div>
                      <h2 className="font-display text-lg font-semibold leading-tight">{c.name}</h2>
                      {c.party && (
                        <p className="text-xs text-muted-foreground">
                          {c.party.name}
                          {c.party.abbreviation ? ` (${c.party.abbreviation})` : ""}
                        </p>
                      )}
                    </div>
                  </div>
                  <VerificationBadge status={c.status} />
                </div>

                <dl className="mt-5 space-y-2 text-sm flex-1">
                  {c.constituency && (
                    <Row icon={<MapPin className="w-3.5 h-3.5" />} label="Constituency">{c.constituency}</Row>
                  )}
                  {c.age != null && (
                    <Row icon={<Briefcase className="w-3.5 h-3.5" />} label="Age">{c.age}</Row>
                  )}
                  {c.education && (
                    <Row icon={<GraduationCap className="w-3.5 h-3.5" />} label="Education">{c.education}</Row>
                  )}
                  {c.profession && (
                    <Row icon={<Briefcase className="w-3.5 h-3.5" />} label="Profession">{c.profession}</Row>
                  )}
                </dl>

                {c.affidavit_link && (
                  <a
                    href={c.affidavit_link}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
                  >
                    <FileSignature className="w-3.5 h-3.5" /> Public affidavit <ExternalLink className="w-3.5 h-3.5" />
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

const Row = ({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) => (
  <div className="flex items-start gap-2">
    <span className="mt-0.5 text-muted-foreground">{icon}</span>
    <span className="text-muted-foreground min-w-[100px]">{label}:</span>
    <span className="font-medium">{children}</span>
  </div>
);

export default Candidates;