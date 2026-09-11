import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';
import FileCookieStore from 'tough-cookie-file-store';
import { checkCookies } from '../utils/cookie-validator';
import fs from 'fs';
import path from 'path';

import config from '../config';

const {auth, endpoints} = config;

const COOKIE_FILE_PATH = path.join(process.cwd(), 'storage', 'cookies', 'session.json');


declare module 'axios' {
  export interface AxiosRequestConfig {
    _retry?: boolean;
  }
}

export class AuthService {
  private api: AxiosInstance;
  private cookieJar: CookieJar;
  private isAuthenticated = false;
  private authPromise: Promise<void> | null = null;

  constructor(baseURL: string = endpoints.baseURL) {
    fs.mkdirSync(path.dirname(COOKIE_FILE_PATH), { recursive: true });
    const fileStore = new FileCookieStore(COOKIE_FILE_PATH);
    this.cookieJar = new CookieJar(fileStore);

    this.api = wrapper(axios).create({
      baseURL,
      jar: this.cookieJar,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'aplicaton/json',
      },
    });
    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.api.interceptors.response.use(
      response => response,
      async (error: AxiosError) => {
        const originalRequest = error.config;

        if (error.response?.status === 403 && !originalRequest?._retry) {
          console.log('🔄 Session expired. Re authenticating...');
          this.isAuthenticated = false;
          this.clearCookieFile();
          await this.authenticate();

          if (originalRequest) {
            originalRequest._retry = true;
            return this.api(originalRequest);
          }
        }
        return Promise.reject(error);
      },
    );
  }

  // Cookie File Helpers

  private cookieFileExists(): boolean {
    return fs.existsSync(COOKIE_FILE_PATH)
  }

  private clearCookieFile(): void{
    try {
      this.cookieJar.removeAllCookiesSync();
      if(this.cookieFileExists()){
          fs.unlinkSync(COOKIE_FILE_PATH);
          console.log('🗑️ Cookie file cleared')
      }
    } catch (error) {
      console.error('Failed to clear cookies:', error);
    } 
  }  

  // ✅ Just one line now
  private async hasValidCookies(): Promise<boolean> {
    return checkCookies({
      cookieFile: COOKIE_FILE_PATH,
      baseURL: endpoints.baseURL,
      cookieJar: this.cookieJar,
      api: this.api,
      testUrl: endpoints.check_balance,
      tokenName: auth.tokenName,
    });
  }


  async authenticate(): Promise<void> {
    // Already authenticatd 
    if (this.isAuthenticated) return
    if (this.authPromise) return this.authPromise

    if (await this.hasValidCookies()){
      this.isAuthenticated = true;
      console.log('✅ Using stored session');
      return;
    }

    if (this.cookieFileExists()){
      this.clearCookieFile()
    }

    this.authPromise = this.login()
    try {
      await this.authPromise;
    }finally {
      this.authPromise = null
    }

  }

  private async login(): Promise<void> {
    const UserName = auth.username;
    const Password = auth.password;
    console.log('🔐 Authenticating...');
    if (!UserName || !Password) {
      throw new Error('Missing credentials. Set MYSELDON_USERNAME and MYSELDON_PASSWORD');
    }
    console.log('🔐 Logging in...');
    const response = await this.api.post(endpoints.login, { UserName, Password });
    if (response.data?.status?.methodStatus !== 'Success') {
      throw new Error('Login failed: ' + JSON.stringify(response.data));
    }
    this. isAuthenticated = true
      console.log('✅Authentication successful!');
      console.log(`💾 Cookies automatically saved to ${COOKIE_FILE_PATH}`);
  }

  async get<T = any>(url: string, cfg?: AxiosRequestConfig): Promise<T> {
    await this.authenticate();
    return (await this.api.get<T>(url, cfg)).data;
  }

  async post<T = any>(url: string, data?: any, cfg?: AxiosRequestConfig): Promise<T> {
    await this.authenticate();
    return (await this.api.post<T>(url, data, cfg)).data;
  }

  async put<T = any>(url: string, data?: any, cfg?: AxiosRequestConfig): Promise<T> {
    await this.authenticate();
    return (await this.api.put<T>(url, data, cfg)).data;
  }

  async delete<T = any>(url: string, cfg?: AxiosRequestConfig): Promise<T> {
    await this.authenticate();
    return (await this.api.delete<T>(url, cfg)).data;
  }

  async reauthenticate(): Promise<void> {
    this.isAuthenticated = false;
    this.authPromise = null;
    this.clearCookieFile();
    await this.authenticate();
  }

  logout(): void {
    this.isAuthenticated = false;
    this.authPromise = null;
    this.clearCookieFile();
    console.log('🔓 Logged out');
  }

  getAxiosInstance(): AxiosInstance {
    return this.api;
  }

  async getCookies(): Promise<any[]> {
    // ✅ Use config.baseURL directly
    return await this.cookieJar.getCookies(endpoints.baseURL);
  }

}

export const authService = new AuthService();

