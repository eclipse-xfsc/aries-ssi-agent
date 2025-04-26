import { ClientsModule } from '@nestjs/microservices';
import { Test } from '@nestjs/testing';

import { NATS_CLIENT } from '../../common/constants.js';
import { CredentialDefinitionsController } from '../credential-definitions.controller.js';
import { CredentialDefinitionsModule } from '../credential-definitions.module.js';
import { CredentialDefinitionsService } from '../credential-definitions.service.js';

describe('CredentialDefinitionsModule', () => {
  let credentialDefinitionsModule: CredentialDefinitionsModule;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ClientsModule.registerAsync({
          isGlobal: true,
          clients: [{ name: NATS_CLIENT, useFactory: () => ({}) }],
        }),
        CredentialDefinitionsModule,
      ],
      controllers: [CredentialDefinitionsController],
      providers: [CredentialDefinitionsService],
    }).compile();

    credentialDefinitionsModule = moduleRef.get<CredentialDefinitionsModule>(
      CredentialDefinitionsModule,
    );
  });

  it('should be defined', () => {
    expect(credentialDefinitionsModule).toBeDefined();
  });
});
