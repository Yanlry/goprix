"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, UserPlus, CheckCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "@/stores/authStore";

const schema = z.object({
  firstName: z.string().min(2, "Minimum 2 caractères"),
  lastName: z.string().min(2, "Minimum 2 caractères"),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  password: z.string().min(8, "Minimum 8 caractères"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof schema>;

function mapErrorToFrench(error: string): string {
  if (error.includes("already registered") || error.includes("already exists") || error.includes("already been registered")) {
    return "Un compte existe déjà avec cet email.";
  }
  if (error.includes("Password should be")) {
    return "Le mot de passe doit contenir au moins 8 caractères.";
  }
  return "Une erreur est survenue. Veuillez réessayer.";
}

export default function InscriptionPage() {
  const router = useRouter();
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const { register: registerUser } = useAuthStore();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setError("");
    const result = await registerUser({
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone || undefined,
    });

    if (result.error) {
      setError(mapErrorToFrench(result.error));
      return;
    }

    if (result.needsConfirmation) {
      setEmailSent(true);
      return;
    }

    router.push("/compte");
  };

  if (emailSent) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gray-50">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Confirmez votre email</h1>
          <p className="text-gray-500 text-sm mb-6">
            Un lien de confirmation a été envoyé à votre adresse email. Cliquez sur ce lien pour activer votre compte.
          </p>
          <Link href="/connexion"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#7C3AED] text-white rounded-xl font-semibold hover:bg-[#6D28D9] transition-colors">
            Aller à la connexion
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Image src="/logo.jpg" alt="Goprix" width={120} height={48} className="h-12 w-auto mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900">Créer un compte</h1>
          <p className="text-gray-500 text-sm mt-1">Rejoignez Goprix pour réserver vos articles</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600">{error}</div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Prénom</label>
                <input {...register("firstName")} type="text" placeholder="Jean"
                  className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400" />
                {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom</label>
                <input {...register("lastName")} type="text" placeholder="Dupont"
                  className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400" />
                {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Adresse e-mail</label>
              <input {...register("email")} type="email" placeholder="vous@exemple.fr"
                className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400" />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Téléphone <span className="text-gray-400 font-normal">(optionnel)</span>
              </label>
              <input {...register("phone")} type="tel" placeholder="06 12 34 56 78"
                className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Mot de passe</label>
              <div className="relative">
                <input {...register("password")} type={showPwd ? "text" : "password"} placeholder="Minimum 8 caractères"
                  className="w-full h-11 pl-4 pr-10 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400" />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirmer le mot de passe</label>
              <div className="relative">
                <input {...register("confirmPassword")} type={showConfirm ? "text" : "password"} placeholder="••••••••"
                  className="w-full h-11 pl-4 pr-10 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400" />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <button type="submit" disabled={isSubmitting}
              className="w-full h-11 bg-[#7C3AED] text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-[#6D28D9] transition-colors disabled:opacity-70 mt-2">
              <UserPlus className="w-4 h-4" />
              {isSubmitting ? "Création en cours..." : "Créer mon compte"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            Déjà un compte ?{" "}
            <Link href="/connexion" className="text-purple-700 font-semibold hover:underline">Se connecter</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
