import { CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export type VerificationStatus = "verified" | "pending" | "source_required";

const config: Record<VerificationStatus, { label: string; cls: string; Icon: typeof CheckCircle2 }> = {
  verified: {
    label: "Officially Verified",
    cls: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
    Icon: CheckCircle2,
  },
  pending: {
    label: "Pending Update",
    cls: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30",
    Icon: Clock,
  },
  source_required: {
    label: "Source Required",
    cls: "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30",
    Icon: AlertTriangle,
  },
};

export const VerificationBadge = ({ status, className }: { status: VerificationStatus; className?: string }) => {
  const { label, cls, Icon } = config[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
        cls,
        className,
      )}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
    </span>
  );
};