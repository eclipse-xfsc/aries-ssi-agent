import type { RpcExceptionFilter } from '@nestjs/common';
import type { RpcException } from '@nestjs/microservices';

import { Catch } from '@nestjs/common';
import { throwError } from 'rxjs';

@Catch()
export class ExceptionHandler implements RpcExceptionFilter<RpcException> {
  public catch(exception: RpcException) {
    return throwError(() => exception.getError());
  }
}
