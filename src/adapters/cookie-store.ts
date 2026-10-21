import fs from 'fs';
import path from 'path';
import { CookieJar } from 'tough-cookie';
import FileCookieStore from 'tough-cookie-file-store';
import type { CookieStore } from '../domain/prots';
import type { SessionCookie } from '../domain/session';

export class ToughCookieStore implements CookieStore {
  private jar: CookieJar;

  constructor(private filePath: string) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    this.jar = new CookieJar(new FileCookieStore(filePath));
  }

  getJar(): CookieJar {
    return this.jar;
  }

  hasFile(): boolean {
    return fs.existsSync(this.filePath);
  }

  async getCookies(baseURL: string): Promise<SessionCookie[]> {
    const cookies = await this.jar.getCookies(baseURL);
    return cookies.map(c => ({
      key: c.key,
      value: c.value,
      expires: c.expires instanceof Date ? c.expires : undefined,
      domain: c.domain ?? undefined,
    }));
  }

  async clear(): Promise<void> {
    this.jar.removeAllCookiesSync();
    if (this.hasFile()) fs.unlinkSync(this.filePath);
  }
}
