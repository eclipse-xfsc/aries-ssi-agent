import type { AnonCredsSchema } from '@credo-ts/anoncreds';

import { Test } from '@nestjs/testing';

import { mockConfigModule } from '../../../config/__tests__/mockConfig.js';
import { AgentModule } from '../../agent.module.js';
import { SchemasController } from '../schemas.controller.js';
import { SchemasService } from '../schemas.service.js';

describe('SchemasController', () => {
  let schemasController: SchemasController;
  let schemasService: SchemasService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [mockConfigModule(), AgentModule],
      controllers: [SchemasController],
      providers: [SchemasService],
    }).compile();

    schemasService = moduleRef.get(SchemasService);
    schemasController = moduleRef.get(SchemasController);
  });

  describe('get all', () => {
    it('should get all the registered schemas of the agent', async () => {
      const result: Array<AnonCredsSchema> = [];
      jest.spyOn(schemasService, 'getAll').mockResolvedValue(result);

      const event = await schemasController.getAll({
        tenantId: 'some-id',
      });

      expect(event.data).toStrictEqual(result);
    });
  });

  describe('get by id', () => {
    it('should get a schema by id', async () => {
      const result: AnonCredsSchema | null = null;
      jest.spyOn(schemasService, 'getById').mockResolvedValue(result);

      const event = await schemasController.getById({
        schemaId: 'id',
        tenantId: 'some-id',
      });

      expect(event.data).toStrictEqual(result);
    });
  });

  describe('register schema', () => {
    it('should register a schema on a ledger', async () => {
      const result: AnonCredsSchema & { schemaId: string } = {
        name: 'schema-name',
        version: '1.0',
        issuerId: 'did:indy:123',
        attrNames: ['name', 'age'],
        schemaId: 'some-id',
      };

      jest.spyOn(schemasService, 'register').mockResolvedValue(result);

      const event = await schemasController.register({
        tenantId: 'some-id',
        version: '1.0',
        name: 'schema-name',
        issuerDid: 'did:indy:123',
        attributeNames: ['name', 'age'],
      });

      expect(event.data).toStrictEqual(result);
    });
  });
});
