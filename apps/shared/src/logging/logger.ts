import type { NextFunction, Request, Response } from 'express';
import type { Logger } from 'winston';

import { ecsFormat } from '@elastic/ecs-winston-format';
import { WinstonModule } from 'nest-winston';
import { createLogger, transports } from 'winston';

export const logger: Logger = createLogger({
  format: ecsFormat({ convertReqRes: true }),
  transports: [new transports.Console()],
});

/**
 * @todo: disable in production
 */
logger.on('error', (error: Error) => {
  // eslint-disable-next-line no-console
  console.error('Error in logger caught', error);
});

export const createApplicationLogger = () =>
  WinstonModule.createLogger({ instance: logger });

export function loggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  logger.log({ level: 'info', message: '', req, res });
  next();
}
