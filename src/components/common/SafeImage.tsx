"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";

interface SafeImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  fallback?: ReactNode;
}

function isValidImageSrc(src: string | null | undefined) {
  if (!src) return false;
  return (
    src.startsWith("http://") ||
    src.startsWith("https://") ||
    src.startsWith("/") ||
    src.startsWith("data:image/")
  );
}

export function SafeImage({
  src,
  alt,
  className = "",
  imageClassName = "object-cover",
  sizes = "200px",
  fallback,
}: SafeImageProps) {
  const [failed, setFailed] = useState(false);
  const imageSrc = typeof src === "string" ? src : "";
  const canRender = isValidImageSrc(imageSrc) && !failed;

  return (
    <div className={`relative overflow-hidden bg-gray-100 ${className}`}>
      {canRender ? (
        <Image
          src={imageSrc}
          alt={alt}
          fill
          sizes={sizes}
          unoptimized
          className={imageClassName}
          onError={() => setFailed(true)}
        />
      ) : (
        fallback || (
          <div className="flex h-full w-full items-center justify-center text-gray-300">
            <ImageOff className="h-7 w-7" />
          </div>
        )
      )}
    </div>
  );
}
