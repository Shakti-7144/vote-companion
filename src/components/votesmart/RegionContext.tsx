import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { RegionCode } from "@/data/regions";

interface Ctx { region: RegionCode; setRegion: (r: RegionCode) => void; }
const RegionCtx = createContext<Ctx | null>(null);

export const RegionProvider = ({ children }: { children: ReactNode }) => {
  const [region, setRegionState] = useState<RegionCode>(() => {
    return (localStorage.getItem("vs_region") as RegionCode) || "IN";
  });
  const setRegion = (r: RegionCode) => { setRegionState(r); localStorage.setItem("vs_region", r); };
  useEffect(() => { document.documentElement.dataset.region = region; }, [region]);
  return <RegionCtx.Provider value={{ region, setRegion }}>{children}</RegionCtx.Provider>;
};

export const useRegion = () => {
  const c = useContext(RegionCtx);
  if (!c) throw new Error("useRegion must be inside RegionProvider");
  return c;
};
