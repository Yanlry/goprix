"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";

export function AuthInit() {
  const initAuth = useAuthStore((s) => s.initAuth);

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    initAuth().then((fn) => { cleanup = fn; });
    return () => { cleanup?.(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
