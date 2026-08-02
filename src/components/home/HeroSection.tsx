import Link from "next/link";
import Image from "next/image";
import { ArrowRight, PackageCheck, Zap } from "lucide-react";
import commerceImage from "../../../asset/commerce.png";

export function HeroSection() {
  return (
    <section className="bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-12 lg:py-20 flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
        {/* Left content */}
        <div className="flex-1 max-w-xl">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            <Zap className="w-3.5 h-3.5" />
            Destockage &amp; Surplus — jusqu&apos;à -70%
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
            Les meilleures <span className="text-[#7C3AED]">affaires,</span>{" "}
            <br />
            toute l&apos;année.
          </h1>
          <p className="text-gray-500 text-lg mb-8 leading-relaxed">
            Goprix, votre spécialiste du déstockage et surplus. Des milliers de produits de grandes marques à prix cassés, disponibles uniquement en Click &amp; Collect.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/nouveautes"
              className="inline-flex items-center gap-4 bg-[#7C3AED] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#6D28D9] transition-colors shadow-lg shadow-purple-200"
            >
              Voir les nouveautés
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {/* Trust signals */}
          <div className="flex flex-wrap gap-6 mt-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              Click &amp; Collect gratuit
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-500" />
              Grandes marques
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-pink-500" />
             Prix réduits
            </div>
          </div>
        </div>

        {/* Right visual */}
        <div className="flex-1 relative">
          <div className="relative mx-auto w-full max-w-xl overflow-hidden rounded-3xl shadow-lg">
            <Image
              src={commerceImage}
              alt="Commerce Goprix"
              className="block h-auto w-full"
              priority
              sizes="(max-width: 1024px) 100vw, 36rem"
            />

            {/* Promo badge */}
            <div className="absolute top-6 right-6 bg-[#EC4899] text-white rounded-2xl p-4 shadow-xl rotate-3">
              <p className="text-2xl font-bold">-70%</p>
              <p className="text-xs opacity-90">jusqu&apos;à</p>
            </div>

            {/* Small badge bottom */}
            <div className="absolute bottom-6 left-6 bg-[#22C55E] text-white rounded-2xl p-4 shadow-xl -rotate-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <PackageCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-black leading-tight">Click &amp; Collect</p>
                  <p className="text-xs text-white/90">Retrait 1h gratuit</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
