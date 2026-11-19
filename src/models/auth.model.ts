export interface Credentials {
  username: string;
  password: string;
}

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationErrror';
  }
}
