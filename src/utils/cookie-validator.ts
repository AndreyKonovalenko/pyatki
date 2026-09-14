import axios, { AxiosInstance } from 'axios';
import { CookieJar } from 'tough-cookie';
import fs from 'fs';

export interface ValidateParams {
  cookieFile: string;
  baseURL: string;
  cookieJar: CookieJar;
  api: AxiosInstance;
  testUrl: string;
  tokenName?: string;
}

/**
 * Check if cookies stored in the jar are still valid.
 * Returns true if cookies exist, aren't expired, have auth token, and server accepts them.
 */
export async function checkCookies(params: ValidateParams): Promise<boolean> {
  const { cookieFile, baseURL, cookieJar, api, testUrl, tokenName } = params;

  console.log('\n🔍 [checkCookies] START');
  console.log('   baseURL:', baseURL);
  console.log('   COOKIE_FILE:', cookieFile);

  // CASE 1: No cookie file on disk
  if (!fs.existsSync(cookieFile)) {
    console.log('❌ [CASE 1] No cookie file found — need to login');
    return false;
  }
  console.log('✅ [CASE 1] Cookie file exists');

  // CASE 2: Failed to read cookies from jar
  let cookies;
  try {
    cookies = await cookieJar.getCookies(baseURL);
  } catch (error) {
    console.log('❌ [CASE 2] Failed to read cookies from jar:', error);
    console.log('   → clearing corrupted file');
    return false;
  }
  console.log(`✅ [CASE 2] Read ${cookies.length} cookies from jar`);

  // CASE 3: Jar is empty
  if (cookies.length === 0) {
    console.log('❌ [CASE 3] Cookie jar is empty — need to login');
    console.log('   → file exists but FileCookieStore loaded 0 cookies');
    console.log('   → check file path & domain match');
    return false;
  }
  console.log('✅ [CASE 3] Cookies found:');
  // cookies.forEach(c =>
  //   console.log(
  //     `     • ${c.key}@${c.domain} expires=${c.expires || 'session'}`,
  //   ),
  // );

  // CASE 4: Cookies expired by date
  const now = new Date();
  const expired = cookies.filter(c => {
    if (!c.expires) return false;
    const exp = c.expires instanceof Date ? c.expires : new Date(c.expires);
    if (isNaN(exp.getTime())) return false;
    return exp < now;
  });

  if (expired.length > 0) {
    console.log(`❌ [CASE 4] ${expired.length} cookie(s) expired:`);
    expired.forEach(c =>
      console.log(`     • ${c.key} expired at ${c.expires}`),
    );
    console.log('   → need to login again');
    return false;
  }
  console.log('✅ [CASE 4] No expired cookies');

  // CASE 5: No auth token
  const hasToken = cookies.some(c => c.key === tokenName);
  if (!hasToken) {
    console.log(`❌ [CASE 5] No ${tokenName} cookie found`);
    // console.log(
    //   '   Available cookie keys:',
    //   cookies.map(c => c.key).join(', '),
    // );
    console.log('   → need to login again');
    return false;
  }
  console.log(`✅ [CASE 5] ${tokenName} present`);
  console.log('🔍 [checkCookies] END → return true\n');
  return true;

  // CASE 6: Server rejects stored cookies
  // try {
  //   console.log('🌐 [CASE 6] Testing cookies with server...');
  //   await api.get(testUrl);
  //   console.log('✅ [CASE 6] Server accepted cookies → SESSION VALID');
  //   console.log('🔍 [checkCookies] END → return true\n');
  //   return true;
  // } catch (error) {
  //   if (axios.isAxiosError(error)) {
  //     console.log('❌ [CASE 6] Server rejected cookies');
  //     console.log('   status:', error.response?.status);
  //     console.log('   data:', JSON.stringify(error.response?.data));
  //     console.log('   → cookies are stale, need to login');
  //   } else {
  //     console.log('❌ [CASE 6] Unexpected error:', error);
  //   }
  //   console.log('🔍 [checkCookies] END → return false\n');
  //   return false;
  // }
}
