"use client";

import { useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = any;

interface Column {
  key: string;
  label: string;
  render?: (row: Row) => React.ReactNode;
  sortable?: boolean;
}

interface Props {
  data: Row[];
  columns: Column[];
  searchPlaceholder?: string;
  searchKey?: string;
  pageSize?: number;
}

export function AdminDataTable({ data, columns, searchPlaceholder = "Rechercher...", searchKey, pageSize = 10 }: Props) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = searchKey
    ? data.filter((row: Row) =>
        String(row[searchKey] ?? "").toLowerCase().includes(query.toLowerCase())
      )
    : data;

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-4">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            placeholder={searchPlaceholder}
            className="w-full pl-9 pr-3 h-9 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
          />
        </div>
        <span className="text-sm text-gray-500">{filtered.length} résultat{filtered.length > 1 ? "s" : ""}</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {columns.map((col) => (
                <th key={col.key} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 whitespace-nowrap">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map((row: Row, i: number) => (
              <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-gray-700">
                    {col.render ? col.render(row) : String(row[col.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
            {paged.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="text-center py-12 text-gray-400 text-sm">
                  Aucun résultat trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
          <span>Page {page} sur {totalPages}</span>
          <div className="flex gap-1">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}
              className="w-8 h-8 rounded-lg hover:bg-gray-100 disabled:opacity-40 flex items-center justify-center">
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
              const p = i + 1;
              return (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium ${page === p ? "bg-purple-600 text-white" : "hover:bg-gray-100"}`}>
                  {p}
                </button>
              );
            })}
            <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}
              className="w-8 h-8 rounded-lg hover:bg-gray-100 disabled:opacity-40 flex items-center justify-center">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
