"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

type ImageWithFallbackProps = Omit<ImageProps, "src" | "onError"> & {
  src?: string | null;
  text?: string;
};

export function ImageWithFallback({ src, alt, text="no img", className, ...props }: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        className={cn(
          "flex h-full w-full flex-col items-center justify-center gap-1 bg-gray-100 text-gray-400",
          className
        )}
      >
        {/* <ImageOff size={20} /> */}
        <span className="text-sm">{text}</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
      {...props}
    />
  );
}