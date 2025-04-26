import { registerAs } from '@nestjs/config';

export const s3Config = registerAs('s3', () => ({
  secret: process.env.S3_SECRET || '',
  accessKey: process.env.S3_ACCESS_KEY || '',
}));
