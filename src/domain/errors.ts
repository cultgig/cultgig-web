export type DomainErrorCode =
  | "unauthenticated"
  | "forbidden"
  | "not_found"
  | "invalid_input"
  | "invalid_transition"
  | "stale_proposal"
  | "own_proposal"
  | "already_accepted"
  | "duplicate"
  | "expired"
  | "not_configured"
  | "conflict";

/**
 * Error raised by marketplace business rules. `message` is always safe to show
 * to the end user; it never contains internal identifiers or stack details.
 */
export class DomainError extends Error {
  readonly code: DomainErrorCode;

  constructor(code: DomainErrorCode, message: string) {
    super(message);
    this.name = "DomainError";
    this.code = code;
  }
}

export function isDomainError(error: unknown): error is DomainError {
  return error instanceof DomainError;
}

/** Convert any thrown value into a user-safe message. */
export function toUserMessage(error: unknown, fallback = "Something went wrong. Please try again."): string {
  if (isDomainError(error)) return error.message;
  return fallback;
}
