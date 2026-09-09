import axios, { isAxiosError } from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';
import dotenv from 'dotenv';
dotenv.config();

// Generic error handler
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }
  return 'An unknown error occurred';
}

async function auth() {
  const url = 'https://basis.myseldon.com/api/Rest/login';
  const payload = {
    UserName: validEnv(process.env.LOGIN),
    Password: validEnv(process.env.PASSWORD),
  };
  const config = {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await axios.post(url, payload, config);
    console.log(response);
    console.log('✅ Login successful!');
    console.log('💰 Getting balance...');
    const balance = await axios.get(
      'https://basis.myseldon.com/api/Rest/check_balance',
      { withCredentials: true },
    );
    console.log('✅ Balance:', balance.data);
  } catch (error) {
    console.error('API Error:', getErrorMessage(error));
  }
}

async function checkBalance() {
  const url = 'https://basis.myseldon.com/api/Rest/check_balance';
  try {
    const response = await axios.get(url, { withCredentials: true });
    console.log(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const setCookieHeader = error.response?.headers['set-cookie'];
      console.log('Server tried to set cookies:', setCookieHeader);
    }

    console.error('API Error:', getErrorMessage(error));
  }
}
// auth()
// checkBalance()

// Just copy this and run it
async function quickTest() {
  // Login
  const login = await axios.post(
    'https://basis.myseldon.com/api/Rest/login',
    {
      UserName: validEnv(process.env.LOGIN),
      Password: validEnv(process.env.PASSWORD),
    },
    { withCredentials: true },
  );

  // Extract token
  const cookies = login.headers['set-cookie'];
  const tokenCookie = cookies?.find(c => c.startsWith('MySeldonToken='));
  const token = tokenCookie?.split('=')[1]?.split(';')[0];

  if (!token) {
    console.error('No token!');
    return;
  }

  console.log('Token:', token.substring(0, 50) + '...');

  // Use token for balance
  const balance = await axios.get(
    'https://basis.myseldon.com/api/Rest/check_balance',
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    },
  );

  console.log('💰 Balance:', balance.data);
}

const jar = new CookieJar();
const api = wrapper(axios as any).create({
  baseURL: 'https://basis.myseldon.com',
  jar: jar,
  withCredentials: true,
});

async function test() {
  // Login
  await api.post('/api/Rest/login', {
    UserName: validEnv(process.env.LOGIN),
    Password: validEnv(process.env.PASSWORD),
  });

  // Get balance
  const balance = await api.get('/api/Rest/check_balance');

  console.log('✅ Success!');
  console.log(balance.data);
  console.log(`Calls left: ${balance.data.report?.calls_left}`);
  console.log(`Calls today: ${balance.data.report?.calls_made_today}`);
}

test().catch(console.error);
