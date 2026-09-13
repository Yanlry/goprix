import Link from "next/link";

export function LegalLayout({
  title,
  updatedAt,
  children,
}: {
  title: string;
  updatedAt: string;
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-purple-700">Accueil</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 font-medium">{title}</span>
      </nav>

      <h1 className="text-2xl font-bold text-gray-900 mb-1">{title}</h1>
      <p className="text-sm text-gray-400 mb-8">Dernière mise à jour : {updatedAt}</p>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
        {children}
      </div>
    </div>
  );
}

export function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-7 last:mb-0">
      <h2 className="text-base font-bold text-gray-900 mb-2">{title}</h2>
      <div className="space-y-2.5 text-sm text-gray-600 leading-relaxed">{children}</div>
    </section>
  );
}

export function LegalList({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="list-disc list-inside space-y-1.5">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

export function LegalPlaceholder({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded-md border border-amber-200 font-medium">
      {children}
    </span>
  );
}
