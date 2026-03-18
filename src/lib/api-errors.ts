type ApiErrorDetails =
  | string
  | string[]
  | Record<string, string | string[] | undefined>
  | null
  | undefined;

export interface ApiErrorPayload {
  error?: string;
  details?: ApiErrorDetails;
}

export function getApiErrorMessage(payload: ApiErrorPayload | null | undefined, fallback: string) {
  if (!payload) {
    return fallback;
  }

  if (typeof payload.details === 'string' && payload.details.trim()) {
    return payload.details;
  }

  if (Array.isArray(payload.details)) {
    const details = payload.details.filter(Boolean).join(', ');
    if (details) {
      return details;
    }
  }

  if (payload.details && typeof payload.details === 'object') {
    const details = Object.values(payload.details)
      .flatMap((value) => (Array.isArray(value) ? value : value ? [value] : []))
      .filter(Boolean)
      .join(', ');

    if (details) {
      return details;
    }
  }

  return payload.error || fallback;
}
