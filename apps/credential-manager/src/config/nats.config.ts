import { registerAs } from '@nestjs/config';

export const natsConfig = registerAs('nats', () => ({
  url: process.env.NATS_URL || 'nats://localhost:4222',
  user: process.env.NATS_USER,
  password: process.env.NATS_PASSWORD,
  monitoringUrl: process.env.NATS_MONITORING_URL || 'http://localhost:8222',
}));
