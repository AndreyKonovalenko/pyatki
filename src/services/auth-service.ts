import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';
import FileCookieStore from 'tough-cookie-file-store';
import { validEnv } from '../utils/utils';
import dotenv from 'dotenv';

dotenv.config();

const COOKIE_FILE_PATH = 'storage/cookies/session.json';
const BASE_URL = validEnv(process.env.BASE_URL);
const LOGIN = validEnv(process.env.LOGIN);
const USERNAME = validEnv(process.env.USERNAME);
const PASSWORD = validEnv(process.env.PASSWORD);

declare module 'axios' {
  export interface AxiosRequestConfig {
    _retry?: boolean;
  }
}

export class AuthServiece {
  private api: AxiosInstance;
  private cookieJar: CookieJar;
  private isAuthenticated = false;
  private authPromise: Promise<void> | null = null;

  constructor(baseURL: string = BASE_URL) {
    this.cookieJar = new CookieJar();
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
          console.log('🔄 Session expired. Refreshing authentication...');
          this.isAuthenticated = false;
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
  async authenticate(): Promise<void> {
    // Already authenticated
    if (this.isAuthenticated) {
      return;
    }

    // If no auth in progress, start one
    if (!this.authPromise) {
      this.authPromise = this.login();
    }

    // ✅ Store reference to avoid null issues
    const currentPromise = this.authPromise;

    try {
      await currentPromise;
    } catch (error) {
      // Clear promise on error so we can retry
      this.authPromise = null;
      this.isAuthenticated = false;
      throw error;
    } finally {
      // Only clear if it's still the same promise
      if (this.authPromise === currentPromise) {
        this.authPromise = null;
      }
    }
  }

  private async login(): Promise<void> {
    const UserName = USERNAME;
    const Password = PASSWORD;
    console.log('🔐 Authenticating...');
    const response = await this.api.post(LOGIN, { UserName, Password });

    if (response.data?.staus?.methodStatus === 'Success') {
      this.isAuthenticated = true;
      console.log('✅Authentication successful!');

      const cookies = await this.cookieJar.getCookies(BASE_URL);
      if (cookies.length > 0) {
        console.log(`🍪 ${cookies.length} cookies stored`);
      }
    } else {
      throw new Error('Login failed: ' + JSON.stringify(response.data));
    }
  }
}

// const jar = new CookieJar();
// const api = wrapper(axios ).create({
//   baseURL: validEnv(process.env.BASE_URL),
//   jar,
//   withCredentials: true,
//   headers: {'Content-Type': 'application/json'}
// });

// let authenticated = false;

// async function isAuth() {
//   if (authenticated) return;
//   await api.post(validEnv(process.env.LOGIN),{
//     UserName: validEnv(process.env.USERNAME),
//     Password: validEnv(process.env.PASSWORD)
//   })
//   authenticated = true;
//   console.log('✅ Authenticated');

// }
