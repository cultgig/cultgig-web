import { useState } from 'react';
import { buildCloudinaryUrl, type CloudinaryTransformOptions } from '../../config/cloudinary';

interface OptimizedMediaProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  transforms?: CloudinaryTransformOptions;
  fallbackLabel?: string;
}

export function OptimizedMedia({
  src,
  alt,
  width,
  height,
  className = '',
  transforms,
  fallbackLabel,
}: OptimizedMediaProps) {
  const [errored, setErrored] = useState(false);
  const resolvedSrc = buildCloudinaryUrl(src, transforms);

  if (errored || !resolvedSrc) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex items-center justify-center bg-brand-subtle border border-accent-border text-ink-primary text-xs font-medium p-4 ${className}`}
      >
        {fallbackLabel || alt}
      </div>
    );
  }

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setErrored(true)}
      className={className}
    />
  );
}
