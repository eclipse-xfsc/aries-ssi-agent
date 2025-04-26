import { ClientsModule } from '@nestjs/microservices';
import { Test } from '@nestjs/testing';

import { NATS_CLIENT } from '../../common/constants.js';
import { CredentialOffersController } from '../credential-offers.controller.js';
import { CredentialOffersModule } from '../credential-offers.module.js';
import { CredentialOffersService } from '../credential-offers.service.js';

describe('CredentialOffersModule', () => {
  let credentialOffersController: CredentialOffersController;
  let credentialOffersService: CredentialOffersService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ClientsModule.registerAsync({
          isGlobal: true,
          clients: [{ name: NATS_CLIENT, useFactory: () => ({}) }],
        }),
        CredentialOffersModule,
      ],
    }).compile();

    credentialOffersController = moduleRef.get<CredentialOffersController>(
      CredentialOffersController,
    );
    credentialOffersService = moduleRef.get<CredentialOffersService>(
      CredentialOffersService,
    );
  });

  it('should be defined', () => {
    expect(credentialOffersController).toBeDefined();
    expect(credentialOffersController).toBeInstanceOf(
      CredentialOffersController,
    );

    expect(credentialOffersService).toBeDefined();
    expect(credentialOffersService).toBeInstanceOf(CredentialOffersService);
  });
});
