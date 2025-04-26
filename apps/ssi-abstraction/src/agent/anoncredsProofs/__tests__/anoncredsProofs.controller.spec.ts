import { ProofExchangeRecord, ProofState } from '@credo-ts/core';
import { Test } from '@nestjs/testing';

import { mockConfigModule } from '../../../config/__tests__/mockConfig.js';
import { AgentModule } from '../../agent.module.js';
import { AnonCredsProofsController } from '../anoncredsProofs.controller.js';
import { AnonCredsProofsService } from '../anoncredsProofs.service.js';

describe('AnonCredsProofsController', () => {
  let proofsController: AnonCredsProofsController;
  let proofsService: AnonCredsProofsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [mockConfigModule(), AgentModule],
      controllers: [AnonCredsProofsController],
      providers: [AnonCredsProofsService],
    }).compile();

    proofsService = moduleRef.get(AnonCredsProofsService);
    proofsController = moduleRef.get(AnonCredsProofsController);
  });

  it('get all', async () => {
    const result: Array<ProofExchangeRecord> = [];
    jest.spyOn(proofsService, 'getAll').mockResolvedValue(result);

    const event = await proofsController.getAll({
      tenantId: 'some-id',
    });

    expect(event.data).toStrictEqual(result);
  });

  it('get by id', async () => {
    const result: ProofExchangeRecord | null = null;
    jest.spyOn(proofsService, 'getById').mockResolvedValue(result);

    const event = await proofsController.getById({
      tenantId: 'some-id',
      proofRecordId: 'some-id',
    });

    expect(event.data).toStrictEqual(result);
  });

  it('request', async () => {
    const result = new ProofExchangeRecord({
      state: ProofState.Done,
      threadId: 'some-id',
      protocolVersion: 'v2',
    });
    jest.spyOn(proofsService, 'request').mockResolvedValue(result);

    const event = await proofsController.request({
      tenantId: 'some-id',
      connectionId: 'some-id',
      name: 'My New Proof Request',
      requestedAttributes: {
        identity: {
          names: ['name'],
          restrictions: [{ issuer_id: 'did:web:government.org' }],
        },
      },
      requestedPredicates: {
        'age > 18': {
          name: 'age',
          restrictions: [{ issuer_id: 'did:web:government.org' }],
          predicateType: '>',
          predicateValue: 18,
        },
      },
    });

    expect(event.data).toStrictEqual(result);
  });

  it('accept', async () => {
    const result = new ProofExchangeRecord({
      state: ProofState.Done,
      threadId: 'some-id',
      protocolVersion: 'v2',
    });
    jest.spyOn(proofsService, 'accept').mockResolvedValue(result);

    const event = await proofsController.accept({
      tenantId: 'some-id',
      proofRecordId: 'some-id',
    });

    expect(event.data).toStrictEqual(result);
  });
});
