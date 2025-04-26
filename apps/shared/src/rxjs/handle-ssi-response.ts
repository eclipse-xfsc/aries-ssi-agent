import { pipe } from 'rxjs';

import { exrtactResponseData } from './extract-response-data.js';
import { handleEmptyResponse } from './handle-empty-response.js';
import { handleRequestTimeout } from './handle-request-timeout.js';

export const handleSSIResponse = pipe(
  handleRequestTimeout(),
  handleEmptyResponse(),
  exrtactResponseData(),
);
