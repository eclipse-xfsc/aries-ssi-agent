import { Test } from '@nestjs/testing';

import { mockConfigModule } from '../../../config/__tests__/mockConfig.js';
import { AgentModule } from '../../agent.module.js';
import { RevocationController } from '../revocation.controller.js';
import { RevocationService } from '../revocation.service.js';

describe('RevocationController', () => {
  let revocationController: RevocationController;
  let revocationService: RevocationService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [mockConfigModule(), AgentModule],
      controllers: [RevocationController],
      providers: [RevocationService],
    }).compile();

    revocationService = moduleRef.get(RevocationService);
    revocationController = moduleRef.get(RevocationController);
  });

  describe('revoke', () => {
    it('should revoke a credential by id', async () => {
      const result = {};
      jest.spyOn(revocationService, 'revoke').mockResolvedValue(result);

      const event = await revocationController.revoke({
        tenantId: 'some-id',
        credentialId: 'some-fake-id',
      });

      expect(event.data).toStrictEqual(result);
    });
  });

  describe('register revocation registry definition', () => {
    it('should register a revocation registry definition', async () => {
      const result = { revocationRegistryDefinitionId: 'some-id' };
      jest
        .spyOn(revocationService, 'registerRevocationRegistryDefinition')
        .mockResolvedValue(result);

      const event =
        await revocationController.registerRevocationRegistryDefinition({
          tag: 'rev_tag',
          issuerDid: 'did:me',
          credentialDefinitionId: 'some:cred:id',
          maximumCredentialNumber: 100,
          tenantId: 'some-id',
        });

      expect(event.data).toStrictEqual(result);
    });
  });

  describe('register revocation status list', () => {
    it('should register a revocation status list', async () => {
      const result = {};

      jest
        .spyOn(revocationService, 'registerRevocationStatusList')
        .mockResolvedValue(result);

      const event = await revocationController.registerRevocationStatusList({
        tenantId: 'some-id',
        revocationRegistryDefinitionId: 'some-fake-id',
        issuerDid: 'did:me',
      });

      expect(event.data).toStrictEqual(result);
    });
  });
});
