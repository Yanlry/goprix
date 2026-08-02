"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useReservationsStore } from "@/stores/reservationsStore";
import { useClientMessagesStore } from "@/stores/clientMessagesStore";

export function AuthInit() {
  const initAuth = useAuthStore((s) => s.initAuth);

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    initAuth().then((fn) => {
      cleanup = fn;
      const user = useAuthStore.getState().user;
      if (user) {
        useReservationsStore.getState().initializeForUser(user.id);
        useClientMessagesStore.getState().initializeForUser(user.id);
      }
    });
    return () => { cleanup?.(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
