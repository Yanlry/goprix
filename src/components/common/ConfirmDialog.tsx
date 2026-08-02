"use client";

import { AlertTriangle } from "lucide-react";

interface Props {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
}

export function ConfirmDialog({ open, title, message, confirmLabel = "Confirmer", cancelLabel = "Annuler", onConfirm, onCancel, danger = false }: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 fade-in">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 ${danger ? "bg-red-100" : "bg-yellow-100"}`}>
          <AlertTriangle className={`w-6 h-6 ${danger ? "text-red-500" : "text-yellow-600"}`} />
        </div>
        <h3 className="text-lg font-bold text-gray-900 text-center mb-2">{title}</h3>
        <p className="text-sm text-gray-500 text-center mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 h-10 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            {cancelLabel}
          </button>
          <button onClick={onConfirm} className={`flex-1 h-10 rounded-xl text-sm font-semibold text-white transition-colors ${danger ? "bg-red-500 hover:bg-red-600" : "bg-purple-600 hover:bg-purple-700"}`}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
