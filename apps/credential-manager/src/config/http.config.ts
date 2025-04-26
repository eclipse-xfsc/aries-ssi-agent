import { registerAs } from '@nestjs/config';

export const httpConfig = registerAs('http', () => ({
  hostname: process.env.HTTP_HOSTNAME || '0.0.0.0',
  port: Number(process.env.HTTP_PORT) || 3000,
}));
