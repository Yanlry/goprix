"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { User, Phone, Mail, Save, CheckCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "@/stores/authStore";

const schema = z.object({
  firstName: z.string().min(2, "Minimum 2 caractères"),
  lastName:  z.string().min(2, "Minimum 2 caractères"),
  phone:     z.string().optional(),
});
type FormData = z.infer<typeof schema>;

export default function ProfilPage() {
  const { user, updateProfile } = useAuthStore();
  const [success, setSuccess] = useState(false);
  const [error,   setError]   = useState("");

  const { register, handleSubmit, reset, formState: { errors, isSubmitting, isDirty } } =
    useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (user) {
      reset({ firstName: user.firstName, lastName: user.lastName, phone: user.phone ?? "" });
    }
  }, [user, reset]);

  if (!user) return null;

  const onSubmit = async (data: FormData) => {
    setError("");
    setSuccess(false);
    const result = await updateProfile({
      firstName: data.firstName,
      lastName:  data.lastName,
      phone:     data.phone || undefined,
    });
    if (result.error) { setError(result.error); return; }
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <nav className="text-xs text-gray-400 mb-1">
          <Link href="/compte" className="hover:text-purple-700">Mon compte</Link>
          <span className="mx-1">/</span>
          <span className="text-gray-600">Informations personnelles</span>
        </nav>
        <h1 className="text-2xl font-bold text-gray-900">Informations personnelles</h1>
        <p className="text-gray-500 text-sm mt-1">Modifiez votre nom et vos coordonnées.</p>
      </div>

      {/* Avatar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center flex-shrink-0">
            <span className="text-2xl font-bold text-purple-700">
              {user.firstName.charAt(0)}{user.lastName.charAt(0)}
            </span>
          </div>
          <div>
            <p className="font-bold text-gray-900 text-lg">{user.firstName} {user.lastName}</p>
            <p className="text-sm text-gray-500">
              Membre depuis {new Date(user.createdAt).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600">{error}</div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-700 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> Profil mis à jour avec succès !
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Prénom</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input {...register("firstName")} type="text"
                  className="w-full h-11 pl-9 pr-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300" />
              </div>
              {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input {...register("lastName")} type="text"
                  className="w-full h-11 pl-9 pr-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300" />
              </div>
              {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName.message}</p>}
            </div>
          </div>

          {/* Email — lecture seule */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Adresse e-mail <span className="text-xs text-gray-400 font-normal">(non modifiable)</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="email" value={user.email} readOnly
                className="w-full h-11 pl-9 pr-4 rounded-xl border border-gray-200 text-sm bg-gray-50 text-gray-500 cursor-not-allowed" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Téléphone <span className="text-xs text-gray-400 font-normal">(optionnel)</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input {...register("phone")} type="tel" placeholder="06 12 34 56 78"
                className="w-full h-11 pl-9 pr-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300" />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button type="submit" disabled={isSubmitting || !isDirty}
              className="flex items-center gap-2 px-6 h-11 bg-[#7C3AED] text-white rounded-xl font-semibold hover:bg-[#6D28D9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              <Save className="w-4 h-4" />
              {isSubmitting ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
