"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User as SBUser } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import type { User } from "@/types";

interface AuthState {
  user: User | null;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  loginAdmin: (email: string, password: string) => Promise<boolean>;
  register: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) => Promise<{ error?: string; needsConfirmation?: boolean }>;
  updateProfile: (data: { firstName: string; lastName: string; phone?: string }) => Promise<{ error?: string }>;
  updatePassword: (newPassword: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  logoutAdmin: () => void;
  initAuth: () => Promise<() => void>;
}

function mapUser(su: SBUser): User {
  const m = su.user_metadata ?? {};
  return {
    id: su.id,
    email: su.email ?? "",
    firstName: (m.firstName as string) || "Utilisateur",
    lastName: (m.lastName as string) || "",
    phone: m.phone as string | undefined,
    createdAt: su.created_at ?? new Date().toISOString(),
  };
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAdmin: false,

      login: async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          if (error.message.toLowerCase().includes("email not confirmed")) {
            return { error: "Votre email n'est pas encore confirmé. Vérifiez votre boîte mail." };
          }
          return { error: "Email ou mot de passe incorrect" };
        }
        if (!data.user) return { error: "Email ou mot de passe incorrect" };
        set({ user: mapUser(data.user) });
        return {};
      },

      loginAdmin: async (email, password) => {
        if (email === "admin@goprix.fr" && password === "Admin123!") {
          set({ isAdmin: true });
          return true;
        }
        return false;
      },

      register: async ({ email, password, firstName, lastName, phone }) => {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { firstName, lastName, phone: phone ?? null } },
        });
        if (error) return { error: error.message };
        if (data.session && data.user) set({ user: mapUser(data.user) });
        return { needsConfirmation: !data.session };
      },

      updateProfile: async ({ firstName, lastName, phone }) => {
        const { data, error } = await supabase.auth.updateUser({
          data: { firstName, lastName, phone: phone ?? null },
        });
        if (error) return { error: "Impossible de mettre à jour le profil" };
        if (data.user) set({ user: mapUser(data.user) });
        return {};
      },

      updatePassword: async (newPassword) => {
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) return { error: "Impossible de changer le mot de passe" };
        return {};
      },

      logout: async () => {
        set({ user: null });
        await supabase.auth.signOut();
      },

      logoutAdmin: () => set({ isAdmin: false }),

      initAuth: async () => {
        const { data: { session } } = await supabase.auth.getSession();
        set({ user: session?.user ? mapUser(session.user) : null });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          set({ user: session?.user ? mapUser(session.user) : null });
        });

        return () => subscription.unsubscribe();
      },
    }),
    {
      name: "goprix-auth",
      partialize: (state) => ({ isAdmin: state.isAdmin }),
    }
  )
);
