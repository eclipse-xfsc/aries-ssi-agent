import type {
  EventAnonCredsProofsDeleteById,
  EventAnonCredsProofsDeleteByIdInput,
  EventAnonCredsProofsGetAll,
  EventAnonCredsProofsGetAllInput,
  EventAnonCredsProofsGetById,
  EventAnonCredsProofsGetByIdInput,
  EventDidcommAnonCredsProofsAcceptRequest,
  EventDidcommAnonCredsProofsAcceptRequestInput,
  EventDidcommAnonCredsProofsRequest,
  EventDidcommAnonCredsProofsRequestInput,
} from '@ocm/shared';

import { Injectable } from '@nestjs/common';

import { WithTenantService } from '../withTenantService.js';

@Injectable()
export class AnonCredsProofsService {
  public constructor(private withTenantService: WithTenantService) {}

  public async getAll({
    tenantId,
  }: EventAnonCredsProofsGetAllInput): Promise<
    EventAnonCredsProofsGetAll['data']
  > {
    return this.withTenantService.invoke(tenantId, (t) => t.proofs.getAll());
  }

  public async getById({
    tenantId,
    proofRecordId,
  }: EventAnonCredsProofsGetByIdInput): Promise<
    EventAnonCredsProofsGetById['data']
  > {
    return this.withTenantService.invoke(tenantId, (t) =>
      t.proofs.findById(proofRecordId),
    );
  }

  public async deleteById({
    tenantId,
    proofRecordId,
  }: EventAnonCredsProofsDeleteByIdInput): Promise<
    EventAnonCredsProofsDeleteById['data']
  > {
    return this.withTenantService.invoke(tenantId, async (t) => {
      await t.proofs.deleteById(proofRecordId);
      return {};
    });
  }

  public async request({
    tenantId,
    connectionId,
    name,
    requestedAttributes,
    requestedPredicates,
  }: EventDidcommAnonCredsProofsRequestInput): Promise<
    EventDidcommAnonCredsProofsRequest['data']
  > {
    const transformedPredicates = Object.entries(requestedPredicates).reduce(
      (prev, [key, value]) => ({
        ...prev,
        [key]: {
          name: value.name,
          restrictions: value.restrictions,
          p_type: value.predicateType,
          p_value: value.predicateValue,
        },
      }),
      {},
    );

    return this.withTenantService.invoke(tenantId, (t) =>
      t.proofs.requestProof({
        connectionId,
        protocolVersion: 'v2',
        proofFormats: {
          anoncreds: {
            name,
            version: '1.0',
            requested_attributes: requestedAttributes,
            requested_predicates: transformedPredicates,
          },
        },
      }),
    );
  }

  public async accept({
    tenantId,
    proofRecordId,
  }: EventDidcommAnonCredsProofsAcceptRequestInput): Promise<
    EventDidcommAnonCredsProofsAcceptRequest['data']
  > {
    return this.withTenantService.invoke(tenantId, (t) =>
      t.proofs.acceptRequest({ proofRecordId }),
    );
  }
}
