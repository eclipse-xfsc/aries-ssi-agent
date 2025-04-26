import type { NestMiddleware } from '@nestjs/common';
import type { Request, NextFunction, Response } from 'express';

import { Injectable, HttpStatus } from '@nestjs/common';

/**
 * Middleware that checks validity of provided params and body
 * to the requests.
 */
@Injectable()
export class AgentMiddleware implements NestMiddleware {
  public use(req: Request, res: Response, next: NextFunction) {
    const [, prop] = req.url.split('/');
    if (prop === 'info') {
      next();
      return;
    }

    if (req.body.subMethod && !req.body.subMethod.name) {
      res.send({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'subMethod.name has to be specified',
      });
      res.end();
      return;
    }

    next();
  }
}
