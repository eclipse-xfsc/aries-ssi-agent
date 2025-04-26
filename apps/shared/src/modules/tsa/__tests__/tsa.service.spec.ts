import type { TestingModule } from '@nestjs/testing';
import type { AxiosResponse } from 'axios' assert { 'resolution-mode': 'require' };

import { HttpService } from '@nestjs/axios';
import { Test } from '@nestjs/testing';
import { of } from 'rxjs';

import { TSAService } from '../tsa.service.js';

describe('TSA Service', () => {
  const httpServiceMock = {
    post: jest.fn(),
  } as unknown as jest.Mocked<HttpService>;

  let service: TSAService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: HttpService, useValue: httpServiceMock },
        TSAService,
      ],
    }).compile();

    service = module.get<TSAService>(TSAService);

    jest.clearAllMocks();
  });

  it('should do something', () => {
    expect(service).toBeDefined();
    expect(service).toBeInstanceOf(TSAService);
  });

  it('should evaluate a policy', async () => {
    const expectedResult = {};
    const expectedResponse = {
      data: expectedResult,
    } as AxiosResponse;

    httpServiceMock.post.mockReturnValueOnce(of(expectedResponse));

    const result = await service.evaluatePolicy('policies/xfsc/didresolve/1.0');

    expect(result).toStrictEqual(expectedResult);
  });

  it('should handle string response', async () => {
    const expectedResult = '{}';
    const expectedResponse = {
      data: expectedResult,
    } as AxiosResponse;

    httpServiceMock.post.mockReturnValueOnce(of(expectedResponse));

    const result = await service.evaluatePolicy('policies/xfsc/didresolve/1.0');

    expect(result).toEqual(JSON.parse(expectedResult));
  });
});
