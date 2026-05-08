import dotenv from 'dotenv';

dotenv.config();

const toNumber = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const env = {
  port: toNumber(process.env.PORT, 3001),
  jwtSecret: process.env.JWT_SECRET || 'change-me-in-local-dev',
  captchaTtlMs: toNumber(process.env.CAPTCHA_TTL_MS, 5 * 60 * 1000)
};
