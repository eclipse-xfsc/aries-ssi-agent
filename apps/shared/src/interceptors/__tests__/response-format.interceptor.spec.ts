import type { ExecutionContext } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';

import { Test } from '@nestjs/testing';
import { of } from 'rxjs';

import { ResponseFormatInterceptor } from '../response-format.interceptor.js';

describe('ResponseFormatInterceptor', () => {
  let interceptor: ResponseFormatInterceptor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResponseFormatInterceptor],
    }).compile();

    interceptor = module.get<ResponseFormatInterceptor>(
      ResponseFormatInterceptor,
    );
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
    expect(interceptor).toBeInstanceOf(ResponseFormatInterceptor);
  });

  it('should intercept the request and format the response', (done) => {
    const context: ExecutionContext = {
      switchToHttp: () => ({
        getResponse: () => ({
          statusCode: 200,
        }),
      }),
    } as ExecutionContext;
    const next = {
      handle: jest.fn().mockReturnValue(of('Hello World')),
    };

    const result = interceptor.intercept(context, next);

    expect(result).toBeDefined();
    expect(next.handle).toHaveBeenCalled();

    result.subscribe((response) => {
      expect(response).toEqual({ statusCode: 200, data: 'Hello World' });
      done();
    });
  });
});
