"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Lock, CheckCircle, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "@/stores/authStore";

const schema = z.object({
  newPassword:     z.string().min(8, "Minimum 8 caractères"),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});
type FormData = z.infer<typeof schema>;

export default function ParametresPage() {
  const { user, updatePassword } = useAuthStore();
  const [showNew,     setShowNew]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success,     setSuccess]     = useState(false);
  const [error,       setError]       = useState("");

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<FormData>({ resolver: zodResolver(schema) });

  if (!user) return null;

  const onSubmit = async (data: FormData) => {
    setError("");
    setSuccess(false);
    const result = await updatePassword(data.newPassword);
    if (result.error) { setError(result.error); return; }
    reset();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      <div>
        <nav className="text-xs text-gray-400 mb-1">
          <Link href="/compte" className="hover:text-purple-700">Mon compte</Link>
          <span className="mx-1">/</span>
          <span className="text-gray-600">Paramètres</span>
        </nav>
        <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-gray-500 text-sm mt-1">Sécurité et préférences de votre compte.</p>
      </div>

      {/* Changer mot de passe */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
            <Lock className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900">Changer le mot de passe</h2>
            <p className="text-xs text-gray-500">Utilisez un mot de passe fort d&apos;au moins 8 caractères</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600">{error}</div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-700 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> Mot de passe modifié avec succès !
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Nouveau mot de passe</label>
            <div className="relative">
              <input {...register("newPassword")} type={showNew ? "text" : "password"}
                placeholder="Minimum 8 caractères"
                className="w-full h-11 pl-4 pr-10 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300" />
              <button type="button" onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.newPassword && <p className="text-xs text-red-500 mt-1">{errors.newPassword.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirmer le mot de passe</label>
            <div className="relative">
              <input {...register("confirmPassword")} type={showConfirm ? "text" : "password"}
                placeholder="••••••••"
                className="w-full h-11 pl-4 pr-10 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300" />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>}
          </div>

          <div className="pt-1 flex justify-end">
            <button type="submit" disabled={isSubmitting}
              className="flex items-center gap-2 px-6 h-11 bg-[#7C3AED] text-white rounded-xl font-semibold hover:bg-[#6D28D9] transition-colors disabled:opacity-50">
              <Lock className="w-4 h-4" />
              {isSubmitting ? "Mise à jour..." : "Changer le mot de passe"}
            </button>
          </div>
        </form>
      </div>

      {/* Infos sécurité */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900">Sécurité du compte</h2>
            <p className="text-xs text-gray-500">État de sécurité actuel</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-gray-700">Email vérifié</span>
            </div>
            <span className="text-xs font-semibold text-green-600">Actif</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-2 text-sm">
              <Lock className="w-4 h-4 text-gray-400" />
              <span className="text-gray-700">Compte connecté via</span>
            </div>
            <span className="text-xs font-semibold text-gray-600">Email / Mot de passe</span>
          </div>
        </div>
      </div>
    </div>
  );
}
