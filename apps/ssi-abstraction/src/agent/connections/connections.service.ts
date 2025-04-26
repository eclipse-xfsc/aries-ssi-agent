import type { AppAgent } from '../agent.service.js';
import type {
  ConnectionRecord,
  ConnectionStateChangedEvent,
} from '@credo-ts/core';
import type {
  EventDidcommConnectionsBlock,
  EventDidcommConnectionsBlockInput,
  EventDidcommConnectionsCreateInvitationInput,
  EventDidcommConnectionsCreateWithSelf,
  EventDidcommConnectionsCreateWithSelfInput,
  EventDidcommConnectionsGetAllInput,
  EventDidcommConnectionsGetById,
  EventDidcommConnectionsGetByIdInput,
  EventDidcommConnectionsParseInvitation,
  EventDidcommConnectionsParseInvitationInput,
  EventDidcommConnectionsReceiveInvitationFromUrlInput,
} from '@ocm/shared';

import {
  ConnectionEventTypes,
  ConnectionRepository,
  DidExchangeState,
} from '@credo-ts/core';
import { isDid } from '@credo-ts/core/build/utils/did.js';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { MetadataTokens } from '../../common/constants.js';
import { AgentService } from '../agent.service.js';
import { WithTenantService } from '../withTenantService.js';

@Injectable()
export class ConnectionsService {
  private agent: AppAgent;

  public constructor(
    agentService: AgentService,
    private withTenantService: WithTenantService,
    private configService: ConfigService,
  ) {
    this.agent = agentService.agent;
  }

  public async getAll({
    tenantId,
  }: EventDidcommConnectionsGetAllInput): Promise<Array<ConnectionRecord>> {
    return this.withTenantService.invoke(tenantId, (t) =>
      t.connections.getAll(),
    );
  }

  public async getById({
    tenantId,
    id,
  }: EventDidcommConnectionsGetByIdInput): Promise<
    EventDidcommConnectionsGetById['data']
  > {
    return this.withTenantService.invoke(tenantId, (t) =>
      t.connections.findById(id),
    );
  }

  public async blockByIdOrDid({
    tenantId,
    idOrDid,
  }: EventDidcommConnectionsBlockInput): Promise<
    EventDidcommConnectionsBlock['data']
  > {
    return this.withTenantService.invoke(tenantId, async (t) => {
      if (isDid(idOrDid)) {
        const records = await t.connections.findAllByQuery({
          theirDid: idOrDid,
        });

        if (records.length === 0) {
          return null;
        }

        if (records.length > 1) {
          throw new Error(
            'Found multiple records with the same DID. This should not be possible',
          );
        }

        await t.connections.deleteById(records[0].id);

        return records[0];
      }

      const record = await t.connections.findById(idOrDid);
      if (!record) return null;

      await t.connections.deleteById(record.id);

      return record;
    });
  }

  public async createInvitation({
    tenantId,
  }: EventDidcommConnectionsCreateInvitationInput): Promise<{
    invitationUrl: string;
  }> {
    const host = this.configService.get<string>('agent.host');
    if (!host) {
      throw new Error(
        'Could not get the `agentHost` from the config. This is required to create an invitation',
      );
    }

    return this.withTenantService.invoke(tenantId, async (t) => {
      const { outOfBandInvitation } = await t.oob.createInvitation();

      return {
        invitationUrl: outOfBandInvitation.toUrl({
          domain: host,
        }),
      };
    });
  }

  public async waitUntilComplete({ connectionId }: { connectionId: string }) {
    return new Promise<ConnectionRecord>((resolve) =>
      this.agent.events.on<ConnectionStateChangedEvent>(
        ConnectionEventTypes.ConnectionStateChanged,
        ({ payload: { connectionRecord } }) => {
          if (
            connectionRecord.id === connectionId &&
            connectionRecord.state === DidExchangeState.Completed
          ) {
            resolve(connectionRecord);
          }
        },
      ),
    );
  }

  public async receiveInvitationFromUrl({
    tenantId,
    invitationUrl,
  }: EventDidcommConnectionsReceiveInvitationFromUrlInput): Promise<ConnectionRecord> {
    return this.withTenantService.invoke(tenantId, async (t) => {
      const { connectionRecord } =
        await t.oob.receiveInvitationFromUrl(invitationUrl);

      if (!connectionRecord) {
        throw new Error(
          'Invitation did not establish a connection. Is it a connection invitation?',
        );
      }

      return connectionRecord;
    });
  }

  public async createConnectionWithSelf({
    tenantId,
  }: EventDidcommConnectionsCreateWithSelfInput): Promise<
    EventDidcommConnectionsCreateWithSelf['data']
  > {
    return this.withTenantService.invoke(tenantId, async (t) => {
      const outOfBandRecord = await t.oob.createInvitation();
      const invitation = outOfBandRecord.outOfBandInvitation;

      const { connectionRecord } = await t.oob.receiveInvitation(invitation);

      if (connectionRecord) {
        connectionRecord.metadata.set(MetadataTokens.CONNECTION_METADATA_KEY, {
          trusted: true,
          withSelf: true,
        });

        const connRepo = t.dependencyManager.resolve(ConnectionRepository);
        await connRepo.update(t.context, connectionRecord);
      }

      return new Promise((resolve) =>
        this.agent.events.on<ConnectionStateChangedEvent>(
          ConnectionEventTypes.ConnectionStateChanged,
          async ({ payload: { connectionRecord } }) => {
            if (connectionRecord.state !== DidExchangeState.Completed) return;
            connectionRecord.metadata.set(
              MetadataTokens.CONNECTION_METADATA_KEY,
              {
                trusted: true,
                withSelf: true,
              },
            );

            const connRepo = t.dependencyManager.resolve(ConnectionRepository);
            // Check whether the connection record actually belongs to the current tenant (t)
            if (await connRepo.findById(t.context, connectionRecord.id)) {
              await connRepo.update(t.context, connectionRecord);
            }

            resolve(connectionRecord);
          },
        ),
      );
    });
  }

  public async parseInvitation({
    tenantId,
    invitationUrl,
  }: EventDidcommConnectionsParseInvitationInput): Promise<
    EventDidcommConnectionsParseInvitation['data']
  > {
    return this.withTenantService.invoke(tenantId, async (t) =>
      t.oob.parseInvitation(invitationUrl),
    );
  }
}
