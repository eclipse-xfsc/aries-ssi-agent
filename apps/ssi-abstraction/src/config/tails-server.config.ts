import { registerAs } from '@nestjs/config';

export const tailsServerConfig = registerAs('tailsServer', () => ({
  baseUrl: process.env.TAILS_SERVER_BASE_URL || '',
  bucketName: process.env.TAILS_SERVER_BUCKET_NAME || '',
}));
