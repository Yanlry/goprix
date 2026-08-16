"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { useAuthStore } from "@/stores/authStore";
import { useCatalogStore } from "@/stores/catalogStore";
import { useStoresStore } from "@/stores/storesStore";
import { useReservationsStore } from "@/stores/reservationsStore";
import { Search } from "lucide-react";
import { NotificationBell } from "@/components/admin/NotificationBell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAdmin } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    useCatalogStore.getState().initialize();
    useStoresStore.getState().initialize();
    useReservationsStore.getState().initializeForAdmin();
  }, []);

  useEffect(() => {
    if (!isAdmin && pathname !== "/administration/connexion") {
      router.push("/administration/connexion");
    }
  }, [isAdmin, pathname, router]);

  if (pathname === "/administration/connexion") {
    return <>{children}</>;
  }

  if (!isAdmin) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Admin header */}
        <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between shadow-sm flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Rechercher..." className="pl-9 pr-4 h-9 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 w-56 bg-gray-50" />
          </div>
          <div className="flex items-center gap-3">
            <NotificationBell />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center text-white text-xs font-bold">AD</div>
              <div className="hidden sm:block">
                <p className="text-xs font-semibold text-gray-900">Admin</p>
                <p className="text-[10px] text-gray-400">admin@goprix.fr</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
