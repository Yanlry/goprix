"use client";

import { Minus, Plus } from "lucide-react";

interface Props {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  size?: "sm" | "md";
}

export function QuantitySelector({ value, min = 1, max = 99, onChange, size = "md" }: Props) {
  const sm = size === "sm";
  return (
    <div className={`flex items-center border border-gray-200 rounded-xl overflow-hidden ${sm ? "h-8" : "h-10"}`}>
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className={`flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors disabled:opacity-40 ${sm ? "w-8" : "w-10"}`}
      >
        <Minus className={sm ? "w-3 h-3" : "w-4 h-4"} />
      </button>
      <span className={`flex-1 text-center font-semibold text-gray-900 ${sm ? "text-sm min-w-[28px]" : "min-w-[36px]"}`}>
        {value}
      </span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className={`flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors disabled:opacity-40 ${sm ? "w-8" : "w-10"}`}
      >
        <Plus className={sm ? "w-3 h-3" : "w-4 h-4"} />
      </button>
    </div>
  );
}
