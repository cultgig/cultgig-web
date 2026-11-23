import { DomainError } from "@/domain/errors";

/**
 * Portfolio media handling.
 * - Validates type and size before anything is read.
 * - Images are downscaled in the browser (max 1600px, JPEG) so demo storage stays small; in
 *   production the same prepared blob is uploaded to the Appwrite storage bucket, whose own
 *   server-side file-type and size limits are the real enforcement.
 * - Audio and video are linked (https only) rather than uploaded in demo mode.
 */

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function validateImageFile(file: File): void {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) throw new DomainError("invalid_input", "Use a JPG, PNG or WebP image.");
  if (file.size > MAX_IMAGE_BYTES) throw new DomainError("invalid_input", "Images must be 10 MB or smaller.");
}

export function prepareImage(file: File, maxEdge = 1600, quality = 0.82): Promise<string> {
  validateImageFile(file);
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxEdge / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext("2d");
      URL.revokeObjectURL(url);
      if (!ctx) return reject(new DomainError("invalid_input", "We couldn't process that image."));
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new DomainError("invalid_input", "That file doesn't look like a valid image."));
    };
    img.src = url;
  });
}

/** Only https links are accepted for linked media, so no javascript:/data: URLs reach the page. */
export function validateMediaLink(value: string): string {
  try {
    const url = new URL(value.trim());
    if (url.protocol !== "https:") throw new Error("not https");
    return url.toString();
  } catch {
    throw new DomainError("invalid_input", "Paste a full https:// link to the audio or video.");
  }
}
