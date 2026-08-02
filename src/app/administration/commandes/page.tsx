"use client";

import { useState } from "react";
import {
  Search, Package, X, MapPin, Calendar, Clock,
  ChevronRight, Send, MessageSquare, CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { useReservationsStore } from "@/stores/reservationsStore";
import { useCatalogStore } from "@/stores/catalogStore";
import { OrderStatusBadge } from "@/components/common/OrderStatusBadge";
import { OrderTimeline } from "@/components/common/OrderTimeline";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { SafeImage } from "@/components/common/SafeImage";
import type { Reservation, ReservationStatus } from "@/types";
/* ─── Config ─── */

const STATUSES: { key: ReservationStatus | "all"; label: string }[] = [
  { key: "all",            label: "Toutes" },
  { key: "nouvelle",       label: "Nouvelles" },
  { key: "en_preparation", label: "En préparation" },
  { key: "prete",          label: "Prêtes" },
  { key: "retiree",        label: "Retirées" },
  { key: "annulee",        label: "Annulées" },
];

const NEXT_STATUS: Partial<Record<ReservationStatus, { status: ReservationStatus; label: string; color: string }>> = {
  nouvelle:       { status: "en_preparation", label: "Mettre en préparation", color: "bg-blue-600 hover:bg-blue-700" },
  en_preparation: { status: "prete",          label: "Marquer comme prête ✉️", color: "bg-green-600 hover:bg-green-700" },
  prete:          { status: "retiree",        label: "Marquer comme retirée", color: "bg-gray-700 hover:bg-gray-800" },
};

const MESSAGE_TEMPLATES = [
  "Votre commande est en cours de préparation, elle sera prête dans environ 1 heure.",
  "Un article de votre commande n'est plus disponible. Nous vous contacterons pour vous proposer une alternative.",
  "Votre commande est prête ! Venez la retirer directement en magasin.",
  "En raison d'un fort afflux, un délai supplémentaire est nécessaire. Merci pour votre compréhension.",
];

/* ─── Email helpers ─── */

async function sendReadyEmail(res: Reservation) {
  if (!res.customerEmail) return;
  await fetch("/api/notify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      customerEmail: res.customerEmail,
      customerName:  res.customerName ?? "Client",
      orderNumber:   res.orderNumber,
      storeName:     res.store.name,
      storeAddress:  `${res.store.address}, ${res.store.postalCode} ${res.store.city}`,
      storePhone:    res.store.phone,
      pickupDate:    res.pickupSlot.date,
      pickupStart:   res.pickupSlot.startTime,
      pickupEnd:     res.pickupSlot.endTime,
      items:         res.items.map((i) => ({ name: i.product.name, quantity: i.quantity, price: i.price })),
      total:         res.total,
    }),
  }).catch(console.error);
}

async function sendCustomMessage(res: Reservation, message: string) {
  if (!res.customerEmail) return;
  await fetch("/api/message", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      customerEmail: res.customerEmail,
      customerName:  res.customerName ?? "Client",
      orderNumber:   res.orderNumber,
      storeName:     res.store.name,
      storePhone:    res.store.phone,
      message,
    }),
  }).catch(console.error);
}

/* ─── Modal ─── */

function OrderModal({
  res,
  onClose,
  onStatusUpdate,
  onCancel,
}: {
  res: Reservation;
  onClose: () => void;
  onStatusUpdate: (id: string, status: ReservationStatus) => void;
  onCancel: (id: string) => void;
}) {
  const { addMessage } = useReservationsStore();
  const next = NEXT_STATUS[res.status];

  const [tab,           setTab]           = useState<"detail" | "message">("detail");
  const [messageText,   setMessageText]   = useState("");
  const [sending,       setSending]       = useState(false);
  const [sent,          setSent]          = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;
    setSending(true);
    await sendCustomMessage(res, messageText);
    addMessage(res.id, messageText);
    setSending(false);
    setSent(true);
    setMessageText("");
    setTimeout(() => setSent(false), 3000);
  };

  const dateFormatted = res.pickupSlot.date.split("-").reverse().join("/");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">

        {/* ── En-tête ── */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <Package className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-lg">{res.orderNumber}</p>
              <p className="text-xs text-gray-500">
                {new Date(res.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                {res.customerName && ` · ${res.customerName}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <OrderStatusBadge status={res.status} />
            <button onClick={onClose} className="w-8 h-8 rounded-lg bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors">
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* ── Onglets ── */}
        <div className="flex border-b border-gray-100 flex-shrink-0">
          {[
            { key: "detail",  label: "Détails",  icon: Package },
            { key: "message", label: "Message",  icon: MessageSquare },
          ].map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setTab(key as typeof tab)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-colors ${
                tab === key
                  ? "border-purple-600 text-purple-700"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}>
              <Icon className="w-4 h-4" />
              {label}
              {key === "message" && (res.messages?.length ?? 0) > 0 && (
                <span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {res.messages!.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Contenu scrollable ── */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">

          {/* ── Onglet Détails ── */}
          {tab === "detail" && (
            <>
              {/* Articles */}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                  Articles ({res.items.length})
                </p>
                <div className="space-y-2">
                  {res.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                      <SafeImage
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-12 h-12 flex-shrink-0 rounded-lg bg-white"
                        imageClassName="object-cover"
                        sizes="48px"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 line-clamp-1">{item.product.name}</p>
                        <p className="text-xs text-gray-400">{item.product.brand} · Réf. {item.product.reference}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-bold text-gray-900">{(item.price * item.quantity).toFixed(2)} €</p>
                        <p className="text-xs text-gray-400">×{item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center mt-3 px-3">
                  <span className="text-sm text-gray-500">Total TTC</span>
                  <span className="text-base font-bold text-gray-900">{res.total.toFixed(2)} €</span>
                </div>
              </div>

              {/* Magasin & créneau */}
              <div className="bg-purple-50 rounded-xl p-4 space-y-2">
                <p className="text-xs font-bold text-purple-700 uppercase tracking-wider mb-1">Retrait</p>
                <div className="flex items-start gap-2 text-sm text-gray-700">
                  <MapPin className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">{res.store.name}</p>
                    <p className="text-xs text-gray-500">{res.store.address}, {res.store.postalCode} {res.store.city}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Calendar className="w-4 h-4 text-purple-500 flex-shrink-0" />
                  <span>{dateFormatted} de {res.pickupSlot.startTime} à {res.pickupSlot.endTime}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Clock className="w-4 h-4 text-purple-500 flex-shrink-0" />
                  <span>Réservation valable 48h</span>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Avancement</p>
                <OrderTimeline status={res.status} />
              </div>
            </>
          )}

          {/* ── Onglet Message ── */}
          {tab === "message" && (
            <div className="space-y-4">
              {/* Historique */}
              {(res.messages?.length ?? 0) > 0 && (
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Messages envoyés</p>
                  <div className="space-y-2">
                    {res.messages!.map((msg, i) => (
                      <div key={i} className="bg-gray-50 rounded-xl p-3">
                        <p className="text-sm text-gray-700">{msg.text}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(msg.sentAt).toLocaleString("fr-FR")}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Templates */}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Messages rapides</p>
                <div className="space-y-2">
                  {MESSAGE_TEMPLATES.map((tpl) => (
                    <button key={tpl} onClick={() => setMessageText(tpl)}
                      className="w-full text-left text-sm text-gray-700 bg-gray-50 hover:bg-purple-50 hover:text-purple-800 rounded-xl px-4 py-3 transition-colors flex items-center gap-2">
                      <ChevronRight className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      {tpl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Zone de texte */}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Message personnalisé</p>
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Écrivez votre message au client..."
                  rows={4}
                  className="w-full rounded-xl border border-gray-200 text-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-300 resize-none"
                />
                {!res.customerEmail && (
                  <p className="text-xs text-orange-500 mt-1 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Cet email client n&apos;est pas disponible (commande ancienne).
                  </p>
                )}
              </div>

              {sent && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-700 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Message envoyé au client !
                </div>
              )}
            </div>
          )}

        </div>

        {/* ── Pied de modal : actions ── */}
        <div className="border-t border-gray-100 p-4 bg-gray-50 flex flex-wrap gap-2 justify-between flex-shrink-0">
          {/* Annuler commande */}
          {res.status !== "annulee" && res.status !== "retiree" && (
            <button onClick={() => setConfirmCancel(true)}
              className="flex items-center gap-1.5 px-4 h-10 rounded-xl bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100 transition-colors">
              <X className="w-4 h-4" /> Annuler la commande
            </button>
          )}

          <div className="flex gap-2 ml-auto">
            {/* Envoyer message (si onglet message) */}
            {tab === "message" && (
              <button onClick={handleSendMessage}
                disabled={!messageText.trim() || sending || !res.customerEmail}
                className="flex items-center gap-1.5 px-4 h-10 rounded-xl bg-purple-100 text-purple-700 text-sm font-semibold hover:bg-purple-200 transition-colors disabled:opacity-40">
                <Send className="w-4 h-4" />
                {sending ? "Envoi..." : "Envoyer"}
              </button>
            )}

            {/* Avancer le statut */}
            {next && (
              <button
                onClick={() => {
                  onStatusUpdate(res.id, next.status);
                  onClose();
                }}
                className={`flex items-center gap-1.5 px-4 h-10 rounded-xl text-white text-sm font-semibold transition-colors ${next.color}`}>
                <CheckCircle className="w-4 h-4" />
                {next.label}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Confirm annulation */}
      <ConfirmDialog
        open={confirmCancel}
        title="Annuler la commande"
        message="Cette action est irréversible. La commande sera annulée."
        confirmLabel="Oui, annuler"
        onConfirm={() => { onCancel(res.id); setConfirmCancel(false); onClose(); }}
        onCancel={() => setConfirmCancel(false)}
        danger
      />
    </div>
  );
}

/* ─── Page principale ─── */

export default function CommandesAdminPage() {
  const { reservations, updateStatus, addMessage } = useReservationsStore();
  const { restoreStock } = useCatalogStore();

  const [query,       setQuery]       = useState("");
  const [statusFilter, setStatusFilter] = useState<ReservationStatus | "all">("all");
  const [storeFilter, setStoreFilter] = useState("all");
  const [selected,    setSelected]    = useState<Reservation | null>(null);

  const stores = [...new Set(reservations.map((r) => r.store.name))];

  const filtered = reservations.filter((r) => {
    const q = query.toLowerCase();
    const matchQuery  = r.orderNumber.toLowerCase().includes(q) || r.store.name.toLowerCase().includes(q) ||
                        (r.customerName ?? "").toLowerCase().includes(q);
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    const matchStore  = storeFilter  === "all" || r.store.name === storeFilter;
    return matchQuery && matchStatus && matchStore;
  });

  const handleStatusUpdate = (id: string, newStatus: ReservationStatus) => {
    updateStatus(id, newStatus);
    if (newStatus === "prete") {
      const res = reservations.find((r) => r.id === id);
      if (res) sendReadyEmail(res);
    }
    // Met à jour la réservation sélectionnée en temps réel
    if (selected?.id === id) {
      setSelected((prev) => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const handleCancel = (id: string) => {
    const res = reservations.find((r) => r.id === id);
    if (res) restoreStock(res.items, res.store.id);
    updateStatus(id, "annulee");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Commandes Click &amp; Collect</h1>
          <p className="text-sm text-gray-500 mt-1">{filtered.length} commande{filtered.length > 1 ? "s" : ""}</p>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="N° commande, client, magasin..."
              className="w-full pl-9 pr-4 h-9 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 bg-gray-50" />
          </div>
          <select value={storeFilter} onChange={(e) => setStoreFilter(e.target.value)}
            className="h-9 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 bg-white">
            <option value="all">Tous les magasins</option>
            {stores.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="flex gap-2 flex-wrap">
          {STATUSES.map(({ key, label }) => (
            <button key={key} onClick={() => setStatusFilter(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                statusFilter === key ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-purple-50"
              }`}>
              {label}
              {key !== "all" && (
                <span className="ml-1.5 bg-white/20 px-1.5 py-0.5 rounded-full text-[10px]">
                  {reservations.filter((r) => r.status === key).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Liste des commandes */}
      <div className="space-y-2">
        {filtered.map((res) => {
          const next = NEXT_STATUS[res.status];
          return (
            <div
              key={res.id}
              onClick={() => setSelected(res)}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden cursor-pointer hover:border-purple-200 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-4 p-4">
                {/* Icône statut */}
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <Package className="w-5 h-5 text-gray-500" />
                </div>

                {/* Infos principales */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-bold text-gray-900">{res.orderNumber}</p>
                    {res.customerName && (
                      <span className="text-xs text-gray-400">· {res.customerName}</span>
                    )}
                    {(res.messages?.length ?? 0) > 0 && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded-full">
                        <MessageSquare className="w-3 h-3" /> {res.messages!.length}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate">
                    {res.store.name} · {res.pickupSlot.date.split("-").reverse().join("/")} {res.pickupSlot.startTime}
                    {res.items.length > 0 && ` · ${res.items.length} article${res.items.length > 1 ? "s" : ""}`}
                  </p>
                </div>

                {/* Droite : badge + prix + flèche */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-gray-900">{res.total.toFixed(2)} €</p>
                    {next && (
                      <p className="text-[10px] text-gray-400">Prochaine : {next.label.replace(" ✉️", "")}</p>
                    )}
                  </div>
                  <OrderStatusBadge status={res.status} size="sm" />
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center text-gray-400">
            <Package className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-semibold">Aucune commande trouvée</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {selected && (
        <OrderModal
          res={reservations.find((r) => r.id === selected.id) ?? selected}
          onClose={() => setSelected(null)}
          onStatusUpdate={handleStatusUpdate}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}
