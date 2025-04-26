import type { AnonCredsCredentialDefinition } from '@credo-ts/anoncreds';

import { Test } from '@nestjs/testing';

import { mockConfigModule } from '../../../config/__tests__/mockConfig.js';
import { AgentModule } from '../../agent.module.js';
import { CredentialDefinitionsController } from '../credentialDefinitions.controller.js';
import { CredentialDefinitionsService } from '../credentialDefinitions.service.js';

describe('CredentialDefinitionsController', () => {
  let credentialDefinitionsController: CredentialDefinitionsController;
  let credentialDefinitionsService: CredentialDefinitionsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [mockConfigModule(), AgentModule],
      controllers: [CredentialDefinitionsController],
      providers: [CredentialDefinitionsService],
    }).compile();

    credentialDefinitionsService = moduleRef.get(CredentialDefinitionsService);
    credentialDefinitionsController = moduleRef.get(
      CredentialDefinitionsController,
    );
  });

  describe('get all', () => {
    it('should get all the registered credentialDefinitions of the agent', async () => {
      const result: Array<AnonCredsCredentialDefinition> = [];
      jest
        .spyOn(credentialDefinitionsService, 'getAll')
        .mockResolvedValue(result);

      const event = await credentialDefinitionsController.getAll({
        tenantId: 'some-id',
      });

      expect(event.data).toStrictEqual(result);
    });
  });

  describe('get by id', () => {
    it('should get a credentialDefinition by id', async () => {
      const result: AnonCredsCredentialDefinition | null = null;
      jest
        .spyOn(credentialDefinitionsService, 'getById')
        .mockResolvedValue(result);

      const event = await credentialDefinitionsController.getById({
        credentialDefinitionId: 'id',
        tenantId: 'some-id',
      });

      expect(event.data).toStrictEqual(result);
    });
  });

  describe('register credentialDefinition', () => {
    it('should register a credentialDefinition on a ledger', async () => {
      const result: AnonCredsCredentialDefinition & {
        credentialDefinitionId: string;
      } = {
        tag: 'some-tag',
        type: 'CL',
        issuerId: 'did:indy:issuer',
        schemaId: 'schemaid:123:default',
        value: {
          primary: {},
        },
        credentialDefinitionId: 'some-id',
      };

      jest
        .spyOn(credentialDefinitionsService, 'register')
        .mockResolvedValue(result);

      const event = await credentialDefinitionsController.register({
        supportsRevocation: false,
        tenantId: 'some-tenant-id',
        tag: 'some-tag',
        issuerDid: 'did:indy:issuer',
        schemaId: 'schemaid:123:default',
      });

      expect(event.data).toStrictEqual(result);
    });
  });
});
