import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { REGIONS, RegionCode } from "@/data/regions";
import { useRegion } from "./RegionContext";

export const RegionPicker = () => {
  const { region, setRegion } = useRegion();
  return (
    <Select value={region} onValueChange={(v) => setRegion(v as RegionCode)}>
      <SelectTrigger className="w-[130px]" aria-label="Select region">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {REGIONS.map((r) => (
          <SelectItem key={r.code} value={r.code}>
            <span className="mr-2">{r.flag}</span>{r.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
