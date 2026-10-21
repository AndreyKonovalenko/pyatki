export interface SessionCookie {
  key: string;
  value?: string;
  expires?: Date;
  domain?: string;
}

export function hasAuthToken(
  cookies: SessionCookie[],
  tokenName: string,
): boolean {
  return cookies.some(c => c.key === tokenName);
}

export function hasExpiredCookies(
  cookies: SessionCookie[],
  now: Date = new Date(),
): boolean {
  return cookies.some(c => c.expires && c.expires.getTime() < now.getTime());
}

export function isValidSession(
  cookies: SessionCookie[],
  tokenName: string,
  now: Date = new Date(),
): boolean {
  if (cookies.length === 0) return false;
  if (hasExpiredCookies(cookies, now)) return false;
  if (!hasAuthToken(cookies, tokenName)) return false;
  return true;
}
