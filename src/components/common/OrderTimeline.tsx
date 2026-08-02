import { Check, Clock, Package, Store, XCircle } from "lucide-react";
import type { ReservationStatus } from "@/types";

const steps: { key: ReservationStatus; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "nouvelle", label: "Commande reçue", icon: Clock },
  { key: "en_preparation", label: "En préparation", icon: Package },
  { key: "prete", label: "Prête à retirer", icon: Store },
  { key: "retiree", label: "Retirée", icon: Check },
];

const statusIndex: Record<ReservationStatus, number> = {
  nouvelle: 0,
  en_preparation: 1,
  prete: 2,
  retiree: 3,
  annulee: -1,
};

interface Props {
  status: ReservationStatus;
  compact?: boolean;
}

export function OrderTimeline({ status, compact }: Props) {
  if (status === "annulee") {
    return (
      <div className="flex items-center gap-2 text-red-500 text-sm">
        <XCircle className="w-4 h-4" />
        Commande annulée
      </div>
    );
  }

  const currentIndex = statusIndex[status];

  return (
    <div className={`flex items-center ${compact ? "gap-1" : "gap-0"}`}>
      {steps.map(({ key, label, icon: Icon }, i) => {
        const done = i < currentIndex;
        const active = i === currentIndex;
        return (
          <div key={key} className={`flex items-center ${compact ? "" : "flex-1"}`}>
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                done ? "bg-green-500 border-green-500 text-white" :
                active ? "bg-purple-600 border-purple-600 text-white" :
                "bg-white border-gray-200 text-gray-300"
              }`}>
                <Icon className="w-4 h-4" />
              </div>
              {!compact && <span className={`text-[10px] mt-1 text-center font-medium ${active ? "text-purple-700" : done ? "text-green-700" : "text-gray-400"}`}>{label}</span>}
            </div>
            {i < steps.length - 1 && !compact && (
              <div className={`flex-1 h-0.5 mx-1 ${i < currentIndex ? "bg-green-400" : "bg-gray-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
