import { ClientsModule } from '@nestjs/microservices';
import { Test } from '@nestjs/testing';

import { NATS_CLIENT } from '../../common/constants.js';
import { DIDsController } from '../dids.controller.js';
import { DIDsModule } from '../dids.module.js';
import { DIDsService } from '../dids.service.js';

describe('DIDsModule', () => {
  let didsController: DIDsController;
  let didsService: DIDsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ClientsModule.registerAsync({
          isGlobal: true,
          clients: [{ name: NATS_CLIENT, useFactory: () => ({}) }],
        }),
        DIDsModule,
      ],
    }).compile();

    didsController = moduleRef.get<DIDsController>(DIDsController);
    didsService = moduleRef.get<DIDsService>(DIDsService);
  });

  it('should be defined', () => {
    expect(didsController).toBeDefined();
    expect(didsController).toBeInstanceOf(DIDsController);

    expect(didsService).toBeDefined();
    expect(didsService).toBeInstanceOf(DIDsService);
  });
});
