import { ClientsModule } from '@nestjs/microservices';
import { Test } from '@nestjs/testing';

import { NATS_CLIENT } from '../../common/constants.js';
import { CredentialsController } from '../credentials.controller.js';
import { CredentialsModule } from '../credentials.module.js';
import { CredentialsService } from '../credentials.service.js';

describe('CredentialsModule', () => {
  let credentialsController: CredentialsController;
  let credentialsService: CredentialsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ClientsModule.registerAsync({
          isGlobal: true,
          clients: [{ name: NATS_CLIENT, useFactory: () => ({}) }],
        }),
        CredentialsModule,
      ],
    }).compile();

    credentialsController = moduleRef.get<CredentialsController>(
      CredentialsController,
    );
    credentialsService = moduleRef.get<CredentialsService>(CredentialsService);
  });

  it('should be defined', () => {
    expect(credentialsController).toBeDefined();
    expect(credentialsController).toBeInstanceOf(CredentialsController);

    expect(credentialsService).toBeDefined();
    expect(credentialsService).toBeInstanceOf(CredentialsService);
  });
});
