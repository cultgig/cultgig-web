import { useState, type ImgHTMLAttributes } from "react";
import { ImageBroken } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface SafeImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackLabel?: string;
}

/** Image with a graceful fallback when the source is missing or fails to load. Lazy by default. */
export function SafeImage({ src, alt, fallbackLabel, className, loading = "lazy", ...props }: SafeImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  if (!src || failedSrc === src) {
    return (
      <div
        className={cn("flex flex-col items-center justify-center gap-2 bg-surface-container p-4 text-center text-ink-secondary", className)}
        role="img"
        aria-label={alt || fallbackLabel || "Image unavailable"}
      >
        <ImageBroken size={24} aria-hidden />
        {fallbackLabel && <span className="type-caption">{fallbackLabel}</span>}
      </div>
    );
  }
  return <img src={src} alt={alt} loading={loading} decoding="async" referrerPolicy="no-referrer" onError={() => setFailedSrc(src)} className={className} {...props} />;
}
