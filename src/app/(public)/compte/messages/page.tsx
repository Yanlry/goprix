"use client";

import { useEffect } from "react";
import Link from "next/link";
import { MessageSquare, Store } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useClientMessagesStore } from "@/stores/clientMessagesStore";

export default function MessagesPage() {
  const { user }                    = useAuthStore();
  const { getMessages, markAllRead } = useClientMessagesStore();

  useEffect(() => {
    if (user) markAllRead(user.id);
  }, [user, markAllRead]);

  if (!user) return null;

  const messages = getMessages(user.id);

  return (
    <div className="space-y-5">
      <div>
        <nav className="text-xs text-gray-400 mb-1">
          <Link href="/compte" className="hover:text-purple-700">Mon compte</Link>
          <span className="mx-1">/</span>
          <span className="text-gray-600">Messages du vendeur</span>
        </nav>
        <h1 className="text-2xl font-bold text-gray-900">Messages du vendeur</h1>
      </div>

      {messages.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center text-gray-400">
          <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-semibold">Aucun message</p>
          <p className="text-sm mt-1">L&apos;équipe Goprix vous contactera ici si besoin.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div key={msg.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Store className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-bold text-gray-900">Équipe Goprix</p>
                    <p className="text-xs text-gray-400">
                      {new Date(msg.sentAt).toLocaleString("fr-FR", {
                        day: "numeric", month: "long", hour: "2-digit", minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-line">{msg.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
