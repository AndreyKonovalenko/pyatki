'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.hasAuthToken = hasAuthToken;
exports.hasExpiredCookies = hasExpiredCookies;
exports.isValidSession = isValidSession;
function hasAuthToken(cookies, tokenName) {
  return cookies.some(c => c.key === tokenName);
}
function hasExpiredCookies(cookies, now = new Date()) {
  return cookies.some(c => c.expires && c.expires.getTime() < now.getTime());
}
function isValidSession(cookies, tokenName, now = new Date()) {
  if (cookies.length === 0) return false;
  if (hasExpiredCookies(cookies, now)) return false;
  if (!hasAuthToken(cookies, tokenName)) return false;
  return true;
}
