"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "@/stores/authStore";

const schema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Minimum 6 caractères"),
});
type FormData = z.infer<typeof schema>;

function ConnexionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/compte";
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const { login, loginAdmin } = useAuthStore();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setError("");
    if (data.email === "admin@goprix.fr") {
      const ok = await loginAdmin(data.email, data.password);
      if (ok) { router.push("/administration"); return; }
      setError("Email ou mot de passe incorrect");
      return;
    }
    const result = await login(data.email, data.password);
    if (!result.error) { router.push(redirectTo); return; }
    setError(result.error);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Image src="/logo.jpg" alt="Goprix" width={120} height={48} className="h-12 w-auto mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900">Connexion</h1>
          <p className="text-gray-500 text-sm mt-1">Accédez à vos réservations et favoris</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600">{error}</div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Adresse e-mail</label>
              <input {...register("email")} type="email" placeholder="vous@exemple.fr"
                className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400" />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Mot de passe</label>
              <div className="relative">
                <input {...register("password")} type={showPwd ? "text" : "password"} placeholder="••••••••"
                  className="w-full h-11 pl-4 pr-10 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400" />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
            </div>
            <div className="flex justify-end">
              <a href="#" className="text-xs text-purple-700 hover:underline">Mot de passe oublié ?</a>
            </div>
            <button type="submit" disabled={isSubmitting}
              className="w-full h-11 bg-[#7C3AED] text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-[#6D28D9] transition-colors disabled:opacity-70">
              <LogIn className="w-4 h-4" />
              {isSubmitting ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            Pas encore de compte ?{" "}
            <Link href="/inscription" className="text-purple-700 font-semibold hover:underline">Créer un compte</Link>
          </div>

          <div className="mt-4 p-3 bg-purple-50 rounded-xl text-xs text-gray-500 text-center">
            <strong>Admin :</strong> admin@goprix.fr / Admin123!
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ConnexionPage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center"><div className="w-8 h-8 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin" /></div>}>
      <ConnexionForm />
    </Suspense>
  );
}
