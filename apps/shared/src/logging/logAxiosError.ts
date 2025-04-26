import type { AxiosError } from 'axios';

import { logger } from './logger.js';

export function logAxiosError(err: AxiosError) {
  if (err.response) {
    logger.error('Request made and server responded: ');
    logger.error(`Data: ${err.response.data}`);
    logger.error(`Status: ${err.response.status}`);
    logger.error(`Headers: ${err.response.headers}`);
  } else if (err.request) {
    logger.error('The request was made but no response was received: ');
    logger.error(err.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    logger.error('Request error: ', err);
  }
}
