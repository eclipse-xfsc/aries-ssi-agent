/* c8 ignore start */
import type { ConfigType } from '@nestjs/config';
import type { IncomingMessage, ServerResponse } from 'node:http';

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { createApplicationLogger, initOpenTelemetry } from '@ocm/shared';
import { createRequire } from 'module';
import { resolve } from 'node:path';

import { Application } from './application.js';
import { httpConfig } from './config/http.config.js';
import { natsConfig } from './config/nats.config.js';

const pkgPath = resolve('package.json');
const pkg = createRequire(import.meta.url)(pkgPath);

const { sdk, prometheusExporter } = initOpenTelemetry(pkg.name);
sdk.start();

const app = await NestFactory.create(Application, {
  logger: createApplicationLogger(),
});

app.use('/metrics', (req: IncomingMessage, res: ServerResponse) => {
  prometheusExporter.getMetricsRequestHandler(req, res);
});

const { url, user, password } = app.get(natsConfig.KEY) as ConfigType<
  typeof natsConfig
>;

app.connectMicroservice({
  transport: Transport.NATS,
  options: {
    servers: [url],
    user,
    pass: password,
  },
});
await app.startAllMicroservices();

const { hostname, port } = app.get(httpConfig.KEY) as ConfigType<
  typeof httpConfig
>;
await app.listen(port, hostname);

Logger.log(`Application is running on: ${await app.getUrl()}`);
/* c8 ignore stop */
