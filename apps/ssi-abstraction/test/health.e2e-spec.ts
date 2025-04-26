import type { INestApplication } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';

import { Test } from '@nestjs/testing';
import request from 'supertest';

import { Application } from '../src/application.js';

describe('HealthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [Application],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/health (GET)', () =>
    request(app.getHttpServer()).get('/health').expect(200));
});
