"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, ShoppingBag, Package, Tag, Award,
  Users, Store, ChevronLeft, ChevronRight,
  LogOut
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";

const menuItems = [
  { label: "Tableau de bord", href: "/administration", icon: LayoutDashboard },
  { label: "Commandes C&C", href: "/administration/commandes", icon: ShoppingBag },
  { label: "Produits", href: "/administration/produits", icon: Package },
  { label: "Catégories", href: "/administration/categories", icon: Tag },
  { label: "Marques", href: "/administration/marques", icon: Award },
  { label: "Magasins", href: "/administration/magasins", icon: Store },
  { label: "Clients", href: "/administration/clients", icon: Users },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { logoutAdmin } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`bg-gray-900 text-gray-300 flex flex-col h-screen sticky top-0 transition-all duration-300 ${collapsed ? "w-16" : "w-64"}`}>
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Image src="/logo.jpg" alt="Goprix" width={80} height={32} className="h-8 w-auto brightness-0 invert" />
            <span className="text-xs text-gray-500 font-medium">Admin</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors ml-auto"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 space-y-0.5 px-2">
        {menuItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || (href !== "/administration" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-900/30"
                  : "hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-white/10 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-white/5 hover:text-white transition-colors"
        >
          <Store className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Voir le site</span>}
        </Link>
        <button
          onClick={logoutAdmin}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-red-900/30 hover:text-red-400 transition-colors w-full text-left"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Déconnexion</span>}
        </button>
      </div>
    </aside>
  );
}
