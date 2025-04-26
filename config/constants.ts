export const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

export const API_MOCKING = process.env.NEXT_PUBLIC_API_MOCKING === 'true';

export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
export const IS_TEST = process.env.NODE_ENV === 'test';
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';

export const IS_BROWSER = process.env.NEXT_RUNTIME !== 'nodejs';
export const IS_SERVER = process.env.NEXT_RUNTIME === 'nodejs';
