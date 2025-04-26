import { ClientsModule } from '@nestjs/microservices';
import { Test } from '@nestjs/testing';

import { NATS_CLIENT } from '../../common/constants.js';
import { CredentialRequestsController } from '../credential-requests.controller.js';
import { CredentialRequestsModule } from '../credential-requests.module.js';
import { CredentialRequestsService } from '../credential-requests.service.js';

describe('CredentialRequestsModule', () => {
  let credentialRequestsController: CredentialRequestsController;
  let credentialRequestsService: CredentialRequestsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ClientsModule.registerAsync({
          isGlobal: true,
          clients: [{ name: NATS_CLIENT, useFactory: () => ({}) }],
        }),
        CredentialRequestsModule,
      ],
    }).compile();

    credentialRequestsController = moduleRef.get<CredentialRequestsController>(
      CredentialRequestsController,
    );
    credentialRequestsService = moduleRef.get<CredentialRequestsService>(
      CredentialRequestsService,
    );
  });

  it('should be defined', () => {
    expect(credentialRequestsController).toBeDefined();
    expect(credentialRequestsController).toBeInstanceOf(
      CredentialRequestsController,
    );

    expect(credentialRequestsService).toBeDefined();
    expect(credentialRequestsService).toBeInstanceOf(CredentialRequestsService);
  });
});
