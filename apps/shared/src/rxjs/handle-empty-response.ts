import { InternalServerErrorException, Logger } from '@nestjs/common';
import { catchError, of } from 'rxjs';

export const handleEmptyResponse = (
  message = 'Make sure SSI abstraction is running',
) =>
  catchError((error) => {
    if (
      error instanceof Error &&
      error.constructor.name === 'EmptyResponseException'
    ) {
      Logger.error(error.message);
      message && Logger.error(message);
      throw new InternalServerErrorException();
    }
    return of(error);
  });
