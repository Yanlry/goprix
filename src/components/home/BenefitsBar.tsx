import { Truck, ShieldCheck, RotateCcw, Headphones } from "lucide-react";

const benefits = [
  { icon: Truck, title: "Click & Collect gratuit", desc: "Retrait en magasin sous 1h" },
  { icon: ShieldCheck, title: "Produits garantis", desc: "Qualité vérifiée et contrôlée" },
  { icon: RotateCcw, title: "Paiement sécurisé", desc: "CB, PayPal, Apple Pay" },
  { icon: Headphones, title: "Service client", desc: "Du lundi au samedi" },
];

export function BenefitsBar() {
  return (
    <section className="border-y border-gray-100 bg-white">
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0 md:divide-x divide-gray-100">
        {benefits.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex items-center gap-3 px-4">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
              <Icon className="w-5 h-5 text-[#7C3AED]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{title}</p>
              <p className="text-xs text-gray-500">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
