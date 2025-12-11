export function isTokenExpired(token: number | null): boolean {
  // token may be one of:
  // - absolute ms timestamp (Date.now() style)
  // - unix seconds timestamp (seconds since epoch)
  // - a small number (like a duration in seconds) which we try to avoid relying on
  if (!token) return true;

  const now = Date.now();

  // If token looks like a millisecond timestamp (>= 1e12 ~ Sep 2001)
  if (token > 1e12) {
    return token < now;
  }

  // If token looks like unix seconds timestamp (>= 1e9 ~ 2001)
  if (token > 1e9) {
    return token * 1000 < now;
  }

  // Fallback: token is small (likely a duration in seconds returned by the server).
  // This case should be handled by converting the duration to an absolute timestamp
  // when saving it into the store (we update those call sites). As a safe fallback
  // here, treat small positive values as NOT expired so the app can attempt to refresh
  // using the refresh token instead of immediately logging out.
  return false;
}
