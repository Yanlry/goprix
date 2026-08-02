"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  LayoutDashboard, User, Bell, CreditCard, ShoppingBag,
  Heart, MapPin, Settings, LogOut, ChevronRight, MessageSquare,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useFavoritesStore } from "@/stores/favoritesStore";
import { useReservationsStore } from "@/stores/reservationsStore";
import { useClientMessagesStore } from "@/stores/clientMessagesStore";

const navItems = [
  { icon: LayoutDashboard,  label: "Tableau de bord",            href: "/compte" },
  { icon: User,             label: "Informations personnelles",  href: "/compte/profil" },
  { icon: ShoppingBag,      label: "Mes réservations",           href: "/compte/reservations" },
  { icon: MessageSquare,    label: "Messages du vendeur",        href: "/compte/messages" },
  { icon: Heart,            label: "Mes favoris",                href: "/compte/favoris" },
  { icon: Bell,             label: "Notifications",              href: "/compte/notifications" },
  { icon: CreditCard,       label: "Paiements",                  href: "/compte/paiements" },
  { icon: MapPin,           label: "Infos magasin",              href: "/compte/infos-magasin" },
  { icon: Settings,         label: "Paramètres",                 href: "/compte/parametres" },
];

export function AccountLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const favorites    = useFavoritesStore((s) => s.items);
  const reservations = useReservationsStore((s) => s.reservations);
  const unreadCount  = useClientMessagesStore((s) => user ? s.unreadCount(user.id) : 0);

  useEffect(() => {
    if (!user) router.push("/connexion");
  }, [user, router]);

  if (!user) return null;

  const userReservations = reservations.filter((r) => r.userId === user.id);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-6">

        {/* ── Sidebar ── */}
        <aside className="lg:w-64 flex-shrink-0">

          {/* Carte profil */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                <span className="text-xl font-bold text-purple-700">
                  {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                </span>
              </div>
              <div className="min-w-0">
                <p className="font-bold text-gray-900 truncate">{user.firstName} {user.lastName}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="bg-purple-50 rounded-xl py-2">
                <p className="font-bold text-purple-700 text-lg leading-tight">{userReservations.length}</p>
                <p className="text-gray-500">Réservations</p>
              </div>
              <div className="bg-pink-50 rounded-xl py-2">
                <p className="font-bold text-pink-600 text-lg leading-tight">{favorites.length}</p>
                <p className="text-gray-500">Favoris</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {navItems.map(({ icon: Icon, label, href }) => {
              const isActive =
                href === "/compte"
                  ? pathname === "/compte"
                  : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-4 py-3 border-b border-gray-50 last:border-0 transition-colors ${
                    isActive
                      ? "bg-purple-50 text-purple-700"
                      : "hover:bg-purple-50 text-gray-700"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isActive ? "bg-purple-100" : "bg-gray-100"
                  }`}>
                    <Icon className={`w-4 h-4 ${isActive ? "text-purple-600" : "text-gray-500"}`} />
                  </div>
                  <span className="text-sm font-medium flex-1">{label}</span>
                  {href === "/compte/messages" && unreadCount > 0 && (
                    <span className="ml-1 bg-purple-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                      {unreadCount}
                    </span>
                  )}
                  <ChevronRight className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-purple-400" : "text-gray-300"}`} />
                </Link>
              );
            })}

            <button
              onClick={() => logout()}
              className="flex items-center gap-3 px-4 py-3 w-full text-left hover:bg-red-50 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                <LogOut className="w-4 h-4 text-red-500" />
              </div>
              <span className="text-sm font-medium text-red-500">Déconnexion</span>
            </button>
          </div>
        </aside>

        {/* ── Contenu ── */}
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
