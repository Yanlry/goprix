import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface Props {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: { label: string; href: string };
}

export function EmptyState({ icon: Icon, title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 rounded-2xl bg-purple-50 flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-purple-300" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 max-w-xs mb-6">{description}</p>
      {action && (
        <Link
          href={action.href}
          className="inline-flex items-center gap-2 bg-[#7C3AED] text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#6D28D9] transition-colors"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
