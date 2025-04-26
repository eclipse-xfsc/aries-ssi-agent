import type { TenantAgent } from '../agent.service.js';
import type {
  CredentialExchangeRecord,
  CredentialStateChangedEvent,
} from '@credo-ts/core';
import type {
  EventAnonCredsCredentialOfferGetAll,
  EventAnonCredsCredentialOfferGetAllInput,
  EventAnonCredsCredentialOfferGetById,
  EventAnonCredsCredentialOfferGetByIdInput,
  EventAnonCredsCredentialRequestGetAll,
  EventAnonCredsCredentialRequestGetAllInput,
  EventAnonCredsCredentialRequestGetById,
  EventAnonCredsCredentialRequestGetByIdInput,
  EventAnonCredsCredentialsDeleteById,
  EventAnonCredsCredentialsDeleteByIdInput,
  EventAnonCredsCredentialsGetAllInput,
  EventAnonCredsCredentialsGetByIdInput,
  EventDidcommAnonCredsCredentialsAcceptOffer,
  EventDidcommAnonCredsCredentialsAcceptOfferInput,
  EventDidcommAnonCredsCredentialsOffer,
  EventDidcommAnonCredsCredentialsOfferInput,
  EventDidcommAnonCredsCredentialsOfferToSelf,
  EventDidcommAnonCredsCredentialsOfferToSelfInput,
} from '@ocm/shared';

import {
  AutoAcceptCredential,
  CredentialEventTypes,
  CredentialRole,
  CredentialState,
} from '@credo-ts/core';
import { GenericRecord } from '@credo-ts/core/build/modules/generic-records/repository/GenericRecord.js';
import { Injectable } from '@nestjs/common';
import { logger } from '@ocm/shared';

import { GenericRecordTokens, MetadataTokens } from '../../common/constants.js';
import { AgentService } from '../agent.service.js';
import { WithTenantService } from '../withTenantService.js';

@Injectable()
export class AnonCredsCredentialsService {
  public constructor(
    private withTenantService: WithTenantService,
    private agentService: AgentService,
  ) {}

  public async getAll({
    tenantId,
  }: EventAnonCredsCredentialsGetAllInput): Promise<
    Array<CredentialExchangeRecord>
  > {
    return this.withTenantService.invoke(tenantId, (t) =>
      t.credentials.getAll(),
    );
  }

  public async getAllOffers({
    tenantId,
  }: EventAnonCredsCredentialOfferGetAllInput): Promise<
    EventAnonCredsCredentialOfferGetAll['data']
  > {
    return this.withTenantService.invoke(tenantId, (t) =>
      t.credentials.findAllByQuery({
        $or: [
          { state: CredentialState.OfferSent },
          { state: CredentialState.OfferReceived },
        ],
      }),
    );
  }

  public async getAllRequests({
    tenantId,
  }: EventAnonCredsCredentialRequestGetAllInput): Promise<
    EventAnonCredsCredentialRequestGetAll['data']
  > {
    return this.withTenantService.invoke(tenantId, (t) =>
      t.credentials.findAllByQuery({
        $or: [
          { state: CredentialState.RequestSent },
          { state: CredentialState.RequestReceived },
        ],
      }),
    );
  }

  public async deleteById({
    tenantId,
    credentialRecordId,
  }: EventAnonCredsCredentialsDeleteByIdInput): Promise<
    EventAnonCredsCredentialsDeleteById['data']
  > {
    return this.withTenantService.invoke(tenantId, async (t) => {
      await t.credentials.deleteById(credentialRecordId);
      return {};
    });
  }

  public async getById({
    tenantId,
    credentialRecordId,
  }: EventAnonCredsCredentialsGetByIdInput): Promise<CredentialExchangeRecord | null> {
    return this.withTenantService.invoke(tenantId, (t) =>
      t.credentials.findById(credentialRecordId),
    );
  }

  public async getOfferById({
    tenantId,
    credentialOfferId,
  }: EventAnonCredsCredentialOfferGetByIdInput): Promise<
    EventAnonCredsCredentialOfferGetById['data']
  > {
    return this.withTenantService.invoke(tenantId, async (t) => {
      const credential = await t.credentials.findById(credentialOfferId);

      if (
        credential &&
        credential.state !== CredentialState.OfferSent &&
        credential.state !== CredentialState.OfferReceived
      ) {
        logger.warn(
          `Credential '${credentialOfferId}' does exist, but is not in offer state. Actual state: ${credential.state}`,
        );
      }

      return credential;
    });
  }

  public async getRequestById({
    tenantId,
    credentialRequestId,
  }: EventAnonCredsCredentialRequestGetByIdInput): Promise<
    EventAnonCredsCredentialRequestGetById['data']
  > {
    return this.withTenantService.invoke(tenantId, async (t) => {
      const credential = await t.credentials.findById(credentialRequestId);

      if (
        credential &&
        credential.state !== CredentialState.RequestSent &&
        credential.state !== CredentialState.RequestReceived
      ) {
        logger.warn(
          `Credential '${credentialRequestId}' does exist, but is not in a request state. Actual state: ${credential.state}`,
        );
      }

      return credential;
    });
  }

  public async acceptOffer({
    tenantId,
    credentialId,
  }: EventDidcommAnonCredsCredentialsAcceptOfferInput): Promise<
    EventDidcommAnonCredsCredentialsAcceptOffer['data']
  > {
    return this.withTenantService.invoke(tenantId, (t) =>
      t.credentials.acceptOffer({
        credentialRecordId: credentialId,
      }),
    );
  }

  public async offer({
    tenantId,
    connectionId,
    credentialDefinitionId,
    attributes,
    revocationRegistryDefinitionId,
  }: EventDidcommAnonCredsCredentialsOfferInput): Promise<
    EventDidcommAnonCredsCredentialsOffer['data']
  > {
    return this.withTenantService.invoke(tenantId, async (t) => {
      const revocationRegistryIndex = await this.getNextRevocationIdx(t);
      return t.credentials.offerCredential({
        protocolVersion: 'v2',
        connectionId,
        credentialFormats: {
          anoncreds: {
            credentialDefinitionId,
            attributes,
            revocationRegistryDefinitionId,
            revocationRegistryIndex,
          },
        },
      });
    });
  }

  public async offerToSelf({
    tenantId,
    credentialDefinitionId,
    attributes,
    revocationRegistryDefinitionId,
  }: EventDidcommAnonCredsCredentialsOfferToSelfInput): Promise<
    EventDidcommAnonCredsCredentialsOfferToSelf['data']
  > {
    return this.withTenantService.invoke(tenantId, async (t) => {
      const connections = await t.connections.getAll();
      const connection = connections.find((c) => {
        const metadata = c.metadata.get<{ withSelf: boolean }>(
          MetadataTokens.CONNECTION_METADATA_KEY,
        );
        return metadata && metadata.withSelf === true;
      });

      if (!connection) {
        throw new Error(
          'Cannot offer a credential to yourself as there is no connection',
        );
      }

      if (!connection.isReady) {
        throw new Error('Connection with yourself is not ready, yet');
      }

      const acceptOfferListener = new Promise<void>((resolve) => {
        this.agentService.agent.events.on<CredentialStateChangedEvent>(
          CredentialEventTypes.CredentialStateChanged,
          async ({ payload: { credentialRecord } }) => {
            const { connectionId } = credentialRecord;
            if (
              !connectionId ||
              credentialRecord.state !== CredentialState.OfferReceived
            ) {
              return;
            }

            const connectionRecord = await t.connections.getById(connectionId);

            const metadata = connectionRecord.metadata.get<{
              withSelf: boolean;
            }>(MetadataTokens.CONNECTION_METADATA_KEY);

            if (!metadata || metadata.withSelf === false) return;

            await t.credentials.acceptOffer({
              credentialRecordId: credentialRecord.id,
              autoAcceptCredential: AutoAcceptCredential.Always,
            });

            resolve();
          },
        );
      });

      const waitUntilDone = new Promise<CredentialExchangeRecord>((resolve) =>
        this.agentService.agent.events.on<CredentialStateChangedEvent>(
          CredentialEventTypes.CredentialStateChanged,
          ({ payload: { credentialRecord } }) => {
            if (
              credentialRecord.state === CredentialState.Done &&
              credentialRecord.role === CredentialRole.Holder
            )
              resolve(credentialRecord);
          },
        ),
      );

      const revocationRegistryIndex = await this.getNextRevocationIdx(t);

      void t.credentials.offerCredential({
        protocolVersion: 'v2',
        autoAcceptCredential: AutoAcceptCredential.Always,
        connectionId: connection.id,
        credentialFormats: {
          anoncreds: {
            credentialDefinitionId,
            attributes,
            revocationRegistryDefinitionId,
            revocationRegistryIndex,
          },
        },
      });

      await acceptOfferListener;

      return waitUntilDone;
    });
  }

  // TODO: this is mainly focussed on one revocation status list per issuer. But this is normally not the case. The credential should store the record id in metadata to support multiple generic records. One per revocation status list
  private async getNextRevocationIdx(
    tenantAgent: TenantAgent,
  ): Promise<number> {
    let recordExists = true;
    let genericRecord = await tenantAgent.genericRecords.findById(
      GenericRecordTokens.REVOCATION,
    );

    if (!genericRecord) {
      recordExists = false;
      genericRecord = new GenericRecord({
        id: GenericRecordTokens.REVOCATION,
        content: {
          revocationIndices: [],
        },
      });
    }

    if (
      !genericRecord.content.revocationIndices ||
      !Array.isArray(genericRecord.content.revocationIndices)
    ) {
      throw new Error(
        `Revocation record '${GenericRecordTokens.REVOCATION}' does not have the required revocationIndices in the content. Invalid state has been reached`,
      );
    }

    const highestIdx =
      genericRecord.content.revocationIndices.length > 0
        ? Math.max(...genericRecord.content.revocationIndices)
        : 0;

    const credentialIdx = highestIdx + 1;

    genericRecord.content.revocationIndices.push(credentialIdx);

    recordExists
      ? await tenantAgent.genericRecords.update(genericRecord)
      : await tenantAgent.genericRecords.save(genericRecord);

    return credentialIdx;
  }
}
