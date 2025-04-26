import { DidDocument } from '@credo-ts/core';
import { Test } from '@nestjs/testing';

import { mockConfigModule } from '../../../config/__tests__/mockConfig.js';
import { AgentModule } from '../../agent.module.js';
import { DidsController } from '../dids.controller.js';
import { DidsService } from '../dids.service.js';

describe('DidsController', () => {
  let didsController: DidsController;
  let didsService: DidsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [mockConfigModule(), AgentModule],
      controllers: [DidsController],
      providers: [DidsService],
    }).compile();

    didsService = moduleRef.get(DidsService);
    didsController = moduleRef.get(DidsController);
  });

  describe('resolve', () => {
    it('should resolve a basic did', async () => {
      const result = new DidDocument({ id: 'did:key:foo' });
      jest.spyOn(didsService, 'resolve').mockResolvedValue(result);

      const event = await didsController.resolve({
        did: 'did:key:foo',
        tenantId: 'some-id',
      });

      expect(event.data).toStrictEqual(result);
    });
  });

  describe('register indy did from seed', () => {
    it('should register an indy did from seed', async () => {
      const result = ['did:indy:bcovrin:test:mock'];
      jest
        .spyOn(didsService, 'registerDidIndyFromSeed')
        .mockResolvedValue(result);

      const event = await didsController.registerFromSeed({
        seed: 'random-secure-seed',
        tenantId: 'some-id',
      });

      expect(event.data).toStrictEqual(result);
    });
  });
});
