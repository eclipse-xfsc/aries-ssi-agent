import { ClientsModule } from '@nestjs/microservices';
import { Test } from '@nestjs/testing';

import { NATS_CLIENT } from '../../common/constants.js';
import { SchemasController } from '../schemas.controller.js';
import { SchemasModule } from '../schemas.module.js';
import { SchemasService } from '../schemas.service.js';

describe('Schemas Module', () => {
  let schemasController: SchemasController;
  let schemasService: SchemasService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ClientsModule.registerAsync({
          isGlobal: true,
          clients: [{ name: NATS_CLIENT, useFactory: () => ({}) }],
        }),
        SchemasModule,
      ],
    }).compile();

    schemasController = moduleRef.get<SchemasController>(SchemasController);
    schemasService = moduleRef.get<SchemasService>(SchemasService);
  });

  it('should be defined', () => {
    expect(schemasController).toBeDefined();
    expect(schemasController).toBeInstanceOf(SchemasController);

    expect(schemasService).toBeDefined();
    expect(schemasService).toBeInstanceOf(SchemasService);
  });
});
