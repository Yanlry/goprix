"use client";

import { useState } from "react";
import {
  Search, Users, ShoppingBag, Euro, Mail, CalendarDays,
  TrendingUp, X, Send, Package, MessageSquare, CheckCircle, ChevronRight,
} from "lucide-react";
import { useReservationsStore } from "@/stores/reservationsStore";
import { useClientMessagesStore } from "@/stores/clientMessagesStore";
import { OrderStatusBadge } from "@/components/common/OrderStatusBadge";
import { SafeImage } from "@/components/common/SafeImage";
import type { Reservation } from "@/types";

/* ─── Types ─── */

interface ClientRow {
  userId: string;
  name: string;
  email: string;
  orderCount: number;
  totalSpent: number;
  lastOrderAt: string;
  lastStatus: Reservation["status"];
  orders: Reservation[];
}

function buildClients(reservations: Reservation[]): ClientRow[] {
  const map = new Map<string, ClientRow>();

  for (const r of reservations) {
    const key = r.userId || r.customerEmail || "inconnu";
    const existing = map.get(key);
    if (existing) {
      existing.orderCount += 1;
      existing.totalSpent += r.total;
      existing.orders.push(r);
      if (r.createdAt > existing.lastOrderAt) {
        existing.lastOrderAt = r.createdAt;
        existing.lastStatus  = r.status;
      }
    } else {
      map.set(key, {
        userId:      key,
        name:        r.customerName ?? "Client anonyme",
        email:       r.customerEmail ?? "—",
        orderCount:  1,
        totalSpent:  r.total,
        lastOrderAt: r.createdAt,
        lastStatus:  r.status,
        orders:      [r],
      });
    }
  }

  return Array.from(map.values()).sort((a, b) => b.lastOrderAt.localeCompare(a.lastOrderAt));
}

/* ─── Modal client ─── */

function ClientModal({ client, onClose }: { client: ClientRow; onClose: () => void }) {
  const { addMessage, getMessages } = useClientMessagesStore();
  const [tab,        setTab]        = useState<"orders" | "message">("orders");
  const [text,       setText]       = useState("");
  const [sending,    setSending]    = useState(false);
  const [sent,       setSent]       = useState(false);

  const history = getMessages(client.userId);

  const handleSend = async () => {
    if (!text.trim()) return;
    setSending(true);

    // Persistance locale (visible côté client immédiatement)
    addMessage(client.userId, text);

    // Envoi email si email disponible
    if (client.email !== "—") {
      await fetch("/api/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerEmail: client.email,
          customerName:  client.name,
          orderNumber:   "—",
          storeName:     "Goprix",
          storePhone:    "—",
          message:       text,
        }),
      }).catch(console.error);
    }

    setSending(false);
    setSent(true);
    setText("");
    setTimeout(() => setSent(false), 3000);
  };

  const sortedOrders = [...client.orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">

        {/* En-tête */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-purple-700">
                {client.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
              </span>
            </div>
            <div>
              <p className="font-bold text-gray-900">{client.name}</p>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <Mail className="w-3 h-3" /> {client.email}
              </p>
            </div>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors">
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Stats rapides */}
        <div className="flex divide-x divide-gray-100 border-b border-gray-100 flex-shrink-0">
          <div className="flex-1 px-5 py-3 text-center">
            <p className="text-xl font-bold text-gray-900">{client.orderCount}</p>
            <p className="text-xs text-gray-500">Commandes</p>
          </div>
          <div className="flex-1 px-5 py-3 text-center">
            <p className="text-xl font-bold text-gray-900">{client.totalSpent.toFixed(2)} €</p>
            <p className="text-xs text-gray-500">Total dépensé</p>
          </div>
          <div className="flex-1 px-5 py-3 text-center">
            <p className="text-xl font-bold text-gray-900">{history.length}</p>
            <p className="text-xs text-gray-500">Messages envoyés</p>
          </div>
        </div>

        {/* Onglets */}
        <div className="flex border-b border-gray-100 flex-shrink-0">
          {[
            { key: "orders",  label: "Commandes",        icon: Package },
            { key: "message", label: "Envoyer un message", icon: MessageSquare },
          ].map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setTab(key as typeof tab)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-colors ${
                tab === key
                  ? "border-purple-600 text-purple-700"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}>
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Corps scrollable */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">

          {/* ── Onglet Commandes ── */}
          {tab === "orders" && (
            <div className="space-y-2">
              {sortedOrders.map((r) => (
                <div key={r.id} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                  <SafeImage
                    src={r.items[0]?.product.images[0]}
                    alt={r.items[0]?.product.name ?? "Article"}
                    className="w-10 h-10 flex-shrink-0 rounded-lg bg-white"
                    imageClassName="object-cover"
                    sizes="40px"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{r.orderNumber}</p>
                    <p className="text-xs text-gray-500 line-clamp-1">
                      {r.items.map((i) => i.product.name).join(", ")}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(r.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                      {" · "}{r.store.name}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <OrderStatusBadge status={r.status} size="sm" />
                    <p className="text-xs font-bold text-gray-900">{r.total.toFixed(2)} €</p>
                  </div>
                </div>
              ))}
              {sortedOrders.length === 0 && (
                <p className="text-center text-gray-400 text-sm py-8">Aucune commande</p>
              )}
            </div>
          )}

          {/* ── Onglet Message ── */}
          {tab === "message" && (
            <div className="space-y-4">

              {/* Historique messages */}
              {history.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                    Historique ({history.length})
                  </p>
                  <div className="space-y-2">
                    {history.map((msg) => (
                      <div key={msg.id} className="bg-gray-50 rounded-xl p-3">
                        <p className="text-sm text-gray-700">{msg.text}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(msg.sentAt).toLocaleString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Éditeur */}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Nouveau message</p>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={`Écrire un message à ${client.name}...`}
                  rows={5}
                  className="w-full rounded-xl border border-gray-200 text-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-300 resize-none"
                />
                {client.email === "—" && (
                  <p className="text-xs text-orange-500 mt-1">
                    Email indisponible — le message sera visible uniquement dans le compte client.
                  </p>
                )}
              </div>

              {sent && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-700 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Message envoyé !
                </div>
              )}
            </div>
          )}
        </div>

        {/* Pied */}
        {tab === "message" && (
          <div className="border-t border-gray-100 p-4 flex justify-end flex-shrink-0">
            <button
              onClick={handleSend}
              disabled={!text.trim() || sending}
              className="flex items-center gap-2 px-5 h-10 rounded-xl bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 transition-colors disabled:opacity-40">
              <Send className="w-4 h-4" />
              {sending ? "Envoi..." : "Envoyer le message"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Page principale ─── */

export default function ClientsAdminPage() {
  const { reservations } = useReservationsStore();
  const [query,    setQuery]    = useState("");
  const [selected, setSelected] = useState<ClientRow | null>(null);

  const clients = buildClients(reservations);

  const filtered = clients.filter((c) => {
    const q = query.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
  });

  const totalRevenue = clients.reduce((s, c) => s + c.totalSpent, 0);
  const totalOrders  = reservations.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          <p className="text-sm text-gray-500 mt-1">
            {clients.length} client{clients.length > 1 ? "s" : ""} enregistré{clients.length > 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
            <Users className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{clients.length}</p>
            <p className="text-xs text-gray-500">Clients uniques</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
            <ShoppingBag className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
            <p className="text-xs text-gray-500">Commandes totales</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{totalRevenue.toFixed(0)} €</p>
            <p className="text-xs text-gray-500">Chiffre d&apos;affaires</p>
          </div>
        </div>
      </div>

      {/* Recherche */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher par nom ou email..."
            className="w-full pl-9 pr-4 h-10 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
          />
        </div>
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-semibold">Aucun client trouvé</p>
            <p className="text-sm mt-1">Les clients apparaissent automatiquement à la première commande.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left">
                <th className="px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Client</th>
                <th className="px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Email</th>
                <th className="px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Commandes</th>
                <th className="px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Total dépensé</th>
                <th className="px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider hidden md:table-cell">Dernière commande</th>
                <th className="px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Statut dernière</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((c) => (
                <tr
                  key={c.userId}
                  onClick={() => setSelected(c)}
                  className="hover:bg-purple-50 cursor-pointer transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-purple-700">
                          {c.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                        </span>
                      </div>
                      <span className="font-semibold text-gray-900">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 hidden sm:table-cell">
                    <span className="flex items-center gap-1.5 text-gray-500">
                      <Mail className="w-3.5 h-3.5 flex-shrink-0" />{c.email}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-gray-100 text-xs font-bold text-gray-700">
                      {c.orderCount}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <span className="flex items-center justify-end gap-1 font-bold text-gray-900">
                      <Euro className="w-3.5 h-3.5 text-gray-400" />{c.totalSpent.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 hidden md:table-cell">
                    <span className="flex items-center gap-1.5 text-gray-500">
                      <CalendarDays className="w-3.5 h-3.5 flex-shrink-0" />
                      {new Date(c.lastOrderAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 hidden lg:table-cell">
                    <OrderStatusBadge status={c.lastStatus} size="sm" />
                  </td>
                  <td className="px-4 py-3.5">
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selected && (
        <ClientModal
          client={clients.find((c) => c.userId === selected.userId) ?? selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
