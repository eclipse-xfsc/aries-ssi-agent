import type { TenantAgent } from '../agent.service.js';

import { Injectable } from '@nestjs/common';
import {
  RevocationState,
  type EventAnonCredsRevocationCheckCredentialStatus,
  type EventAnonCredsRevocationCheckCredentialStatusInput,
  type EventAnonCredsRevocationRegisterRevocationRegistryDefinition,
  type EventAnonCredsRevocationRegisterRevocationRegistryDefinitionInput,
  type EventAnonCredsRevocationRegisterRevocationStatusList,
  type EventAnonCredsRevocationRegisterRevocationStatusListInput,
  type EventAnonCredsRevocationRevoke,
  type EventAnonCredsRevocationRevokeInput,
  type EventAnonCredsRevocationTailsFile,
  type EventAnonCredsRevocationTailsFileInput,
} from '@ocm/shared';
import { readFile } from 'node:fs/promises';

import { AgentService } from '../agent.service.js';
import { WithTenantService } from '../withTenantService.js';

export interface AnonCredsCredentialMetadata {
  schemaId?: string;
  credentialDefinitionId?: string;
  revocationRegistryId?: string;
  credentialRevocationId?: string;
}

@Injectable()
export class RevocationService {
  public constructor(
    private withTenantService: WithTenantService,
    private agentService: AgentService,
  ) {}

  // Get the credential from storage
  // Get the revocation registry definition id
  // Get the revocation index
  // Get the status list
  // Update the status list with the revoked index set
  public async revoke({
    tenantId,
    credentialId,
  }: EventAnonCredsRevocationRevokeInput): Promise<
    EventAnonCredsRevocationRevoke['data']
  > {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return this.withTenantService.invoke(tenantId, async (t) => {
      const {
        credentialRevocationId,
        revocationStatusList,
        revocationRegistryId,
      } = await this.getRevocationParts(t, credentialId);

      if (revocationStatusList.revocationList[credentialRevocationId] === 1) {
        throw new Error(
          `credential (${credentialId}), with revocation id ${credentialRevocationId}, is already in a revoked state`,
        );
      }

      const result = await t.modules.anoncreds.updateRevocationStatusList({
        revocationStatusList: {
          revocationRegistryDefinitionId: revocationRegistryId,
          revokedCredentialIndexes: [credentialRevocationId],
        },
        options: {},
      });

      if (result.revocationStatusListState.state !== 'finished') {
        throw new Error(
          `An error occurred while trying to update the revocation status list. Error: ${JSON.stringify(
            result,
          )}`,
        );
      }

      return {};
    });
  }

  public async registerRevocationRegistryDefinition({
    tenantId,
    tag,
    issuerDid,
    credentialDefinitionId,
    maximumCredentialNumber,
  }: EventAnonCredsRevocationRegisterRevocationRegistryDefinitionInput): Promise<
    EventAnonCredsRevocationRegisterRevocationRegistryDefinition['data']
  > {
    const endorserDid = await this.agentService.getEndorserDid(issuerDid);
    return this.withTenantService.invoke(tenantId, async (t) => {
      const { revocationRegistryDefinitionState } =
        await t.modules.anoncreds.registerRevocationRegistryDefinition({
          options: {
            endorserMode: 'external',
            endorserDid,
          },
          revocationRegistryDefinition: {
            maximumCredentialNumber,
            credentialDefinitionId,
            tag,
            issuerId: issuerDid,
          },
        });

      if (
        revocationRegistryDefinitionState.state !== 'action' ||
        revocationRegistryDefinitionState.action !== 'endorseIndyTransaction'
      ) {
        throw new Error(
          `Error registering revocation registry definition: ${
            revocationRegistryDefinitionState.state === 'failed'
              ? revocationRegistryDefinitionState.reason
              : 'Not Finished'
          }`,
        );
      }

      const signedRevocationRegistryDefinitionRequest =
        await this.agentService.endorseTransaction(
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          revocationRegistryDefinitionState.revocationRegistryDefinitionRequest,
          endorserDid,
        );

      await t.modules.indyVdr.submitTransaction(
        signedRevocationRegistryDefinitionRequest,
        issuerDid,
      );

      return {
        revocationRegistryDefinitionId:
          revocationRegistryDefinitionState.revocationRegistryDefinitionId,
      };
    });
  }

  public async registerRevocationStatusList({
    tenantId,
    revocationRegistryDefinitionId,
    issuerDid,
  }: EventAnonCredsRevocationRegisterRevocationStatusListInput): Promise<
    EventAnonCredsRevocationRegisterRevocationStatusList['data']
  > {
    const endorserDid = await this.agentService.getEndorserDid(issuerDid);
    return this.withTenantService.invoke(tenantId, async (t) => {
      const { revocationStatusListState } =
        await t.modules.anoncreds.registerRevocationStatusList({
          options: {
            endorserMode: 'external',
            endorserDid,
          },
          revocationStatusList: {
            revocationRegistryDefinitionId,
            issuerId: issuerDid,
          },
        });

      if (
        revocationStatusListState.state !== 'action' ||
        revocationStatusListState.action !== 'endorseIndyTransaction'
      ) {
        throw new Error(
          `Error registering revocation registry definition: ${
            revocationStatusListState.state === 'failed'
              ? revocationStatusListState.reason
              : 'Not Finished'
          }`,
        );
      }

      const signedRevocationRegistryDefinitionRequest =
        await this.agentService.endorseTransaction(
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          revocationStatusListState.revocationStatusListRequest,
          endorserDid,
        );

      await t.modules.indyVdr.submitTransaction(
        signedRevocationRegistryDefinitionRequest,
        issuerDid,
      );

      return {};
    });
  }

  public async getTailsFile({
    tenantId,
    revocationRegistryDefinitionId,
  }: EventAnonCredsRevocationTailsFileInput): Promise<
    EventAnonCredsRevocationTailsFile['data']
  > {
    return this.withTenantService.invoke(tenantId, async (t) => {
      const result = await t.modules.anoncreds.getRevocationRegistryDefinition(
        revocationRegistryDefinitionId,
      );

      if (!result.revocationRegistryDefinition) {
        throw new Error(
          `error: ${result.resolutionMetadata.error}. Message: ${result.resolutionMetadata.message}`,
        );
      }

      const { tailsLocation } = result.revocationRegistryDefinition.value;

      const content = await readFile(tailsLocation);

      return {
        tailsFile: Uint8Array.from(content),
      };
    });
  }

  public async checkCredentialStatus({
    tenantId,
    credentialId,
  }: EventAnonCredsRevocationCheckCredentialStatusInput): Promise<
    EventAnonCredsRevocationCheckCredentialStatus['data']
  > {
    return this.withTenantService.invoke(tenantId, async (t) => {
      const { credentialRevocationId, revocationStatusList } =
        await this.getRevocationParts(t, credentialId);

      const revocationStatus =
        revocationStatusList.revocationList[credentialRevocationId];

      return {
        state:
          revocationStatus === 0
            ? RevocationState.Issued
            : RevocationState.Revoked,
      };
    });
  }

  private async getRevocationParts(
    tenantAgent: TenantAgent,
    credentialId: string,
  ) {
    const credential = await tenantAgent.credentials.getById(credentialId);

    const metadata = credential.metadata.get<AnonCredsCredentialMetadata>(
      '_anoncreds/credential',
    );

    if (
      !metadata ||
      !metadata.revocationRegistryId ||
      !metadata.credentialRevocationId
    ) {
      throw new Error(
        `credential (${credentialId}) has no metadata, likely it was issued without support for revocation`,
      );
    }

    const { revocationRegistryDefinition } =
      await tenantAgent.modules.anoncreds.getRevocationRegistryDefinition(
        metadata.revocationRegistryId,
      );

    if (!revocationRegistryDefinition) {
      throw new Error(
        `Could not find the revocation registry definition for id: ${metadata.revocationRegistryId}`,
      );
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const { revocationStatusList } =
      await tenantAgent.modules.anoncreds.getRevocationStatusList(
        metadata.revocationRegistryId,
        timestamp,
      );

    if (!revocationStatusList) {
      throw new Error(
        `Could not find the revocation status list for revocation registry definition id: ${metadata.revocationRegistryId} and timestamp: ${timestamp}`,
      );
    }

    return {
      credentialRevocationId: Number(metadata.credentialRevocationId),
      revocationStatusList,
      revocationRegistryId: metadata.revocationRegistryId,
    };
  }
}
