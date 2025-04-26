/* c8 ignore start */
import type { ConfigType } from '@nestjs/config';
import type { IncomingMessage, ServerResponse } from 'http';

import { Logger, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { createApplicationLogger, initOpenTelemetry } from '@ocm/shared';
import helmet from 'helmet';
import { createRequire } from 'module';
import { resolve } from 'node:path';

import { Application } from './application.js';
import { httpConfig } from './config/http.config.js';

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

app.use(helmet());

app.enableVersioning({
  defaultVersion: ['1'],
  type: VersioningType.URI,
});

const swaggerConfig = new DocumentBuilder()
  .setTitle(pkg.description)
  .setVersion(pkg.version)
  .build();

const document = SwaggerModule.createDocument(app, swaggerConfig);

SwaggerModule.setup('/', app, document, {
  swaggerOptions: {
    docExpansion: 'none',
    tryItOutEnabled: true,
  },
});

const { hostname, port } = app.get(httpConfig.KEY) as ConfigType<
  typeof httpConfig
>;
await app.listen(port, hostname);

Logger.log(`Application is running on: ${await app.getUrl()}`);
/* c8 ignore stop */
