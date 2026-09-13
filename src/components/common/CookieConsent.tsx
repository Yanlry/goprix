"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";

const STORAGE_KEY = "goprix_cookie_consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = window.localStorage.getItem(STORAGE_KEY);
    if (!consent) setVisible(true);
  }, []);

  function handleChoice(value: "accepted" | "declined") {
    window.localStorage.setItem(STORAGE_KEY, value);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-4 sm:p-6">
      <div className="mx-auto max-w-3xl bg-white rounded-2xl shadow-2xl border border-gray-200 p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/10 flex items-center justify-center flex-shrink-0">
          <Cookie className="w-5 h-5 text-[#7C3AED]" />
        </div>
        <div className="flex-1 text-sm text-gray-600">
          <p className="text-gray-900 font-semibold mb-1">Gestion des cookies</p>
          Nous utilisons des cookies pour améliorer votre expérience, mesurer l&apos;audience et vous proposer des offres
          adaptées. Vous pouvez accepter ou refuser leur utilisation.{" "}
          <Link href="/cookies" className="text-[#7C3AED] font-medium hover:underline">
            En savoir plus
          </Link>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => handleChoice("declined")}
            className="flex-1 sm:flex-none h-11 px-5 rounded-xl border border-gray-300 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors whitespace-nowrap"
          >
            Refuser
          </button>
          <button
            type="button"
            onClick={() => handleChoice("accepted")}
            className="flex-1 sm:flex-none h-11 px-5 rounded-xl bg-[#7C3AED] text-white font-medium text-sm hover:bg-purple-700 transition-colors whitespace-nowrap"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
}
