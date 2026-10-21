export interface Credentials {
  UserName: string;
  PassWord: string;
}

export interface LoginResponse {
  status?: { methodStatus?: string };
}

export function isLoginSuccessful(res: LoginResponse): boolean {
  return res?.status?.methodStatus === 'Success';
}

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationErrror';
  }
}

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'HttpError';
  }
}
