import { Image as ImageIcon } from "lucide-react";
import { useState, type ImgHTMLAttributes } from "react";

interface SafeImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackLabel?: string;
}

export function SafeImage({
  src,
  alt,
  fallbackLabel,
  className = "",
  ...props
}: SafeImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-2 bg-plum-soft text-ink-secondary p-4 text-center ${className}`}
        role="img"
        aria-label={alt || fallbackLabel || "Image preview"}
      >
        <ImageIcon size={24} className="text-plum" aria-hidden="true" />
        <span className="type-caption text-ink-secondary">
          {fallbackLabel || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
      {...props}
    />
  );
}
