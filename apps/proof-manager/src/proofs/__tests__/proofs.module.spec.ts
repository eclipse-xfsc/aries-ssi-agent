import { ClientsModule } from '@nestjs/microservices';
import { Test } from '@nestjs/testing';

import { NATS_CLIENT } from '../../common/constants.js';
import { ProofsController } from '../proofs.controller.js';
import { ProofsModule } from '../proofs.module.js';
import { ProofsService } from '../proofs.service.js';

describe('Proofs Module', () => {
  let proofsController: ProofsController;
  let proofsService: ProofsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ClientsModule.registerAsync({
          isGlobal: true,
          clients: [{ name: NATS_CLIENT, useFactory: () => ({}) }],
        }),
        ProofsModule,
      ],
    }).compile();

    proofsController = moduleRef.get<ProofsController>(ProofsController);
    proofsService = moduleRef.get<ProofsService>(ProofsService);
  });

  it('should be defined', () => {
    expect(proofsController).toBeDefined();
    expect(proofsController).toBeInstanceOf(ProofsController);

    expect(proofsService).toBeDefined();
    expect(proofsService).toBeInstanceOf(ProofsService);
  });
});
