import type { ReservationStatus } from "@/types";

const statusConfig: Record<ReservationStatus, { label: string; color: string; bg: string }> = {
  nouvelle: { label: "Commande reçue", color: "text-purple-700", bg: "bg-purple-100" },
  en_preparation: { label: "En préparation", color: "text-orange-700", bg: "bg-orange-100" },
  prete: { label: "Prête à retirer", color: "text-green-700", bg: "bg-green-100" },
  retiree: { label: "Retirée", color: "text-gray-600", bg: "bg-gray-100" },
  annulee: { label: "Annulée", color: "text-red-600", bg: "bg-red-100" },
};

interface Props {
  status: ReservationStatus;
  size?: "sm" | "md";
}

export function OrderStatusBadge({ status, size = "md" }: Props) {
  const cfg = statusConfig[status];
  return (
    <span className={`inline-flex items-center font-semibold rounded-full ${cfg.bg} ${cfg.color} ${
      size === "sm" ? "text-xs px-2 py-0.5" : "text-xs px-3 py-1"
    }`}>
      {cfg.label}
    </span>
  );
}
