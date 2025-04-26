import type { IndyVdrRegisterCredentialDefinitionOptions } from '@credo-ts/indy-vdr';
import type {
  EventAnonCredsCredentialDefinitionsGetAll,
  EventAnonCredsCredentialDefinitionsGetAllInput,
  EventAnonCredsCredentialDefinitionsGetById,
  EventAnonCredsCredentialDefinitionsGetByIdInput,
  EventAnonCredsCredentialDefinitionsRegister,
  EventAnonCredsCredentialDefinitionsRegisterInput,
} from '@ocm/shared';

import { Injectable } from '@nestjs/common';

import { AgentService } from '../agent.service.js';
import { WithTenantService } from '../withTenantService.js';

@Injectable()
export class CredentialDefinitionsService {
  public constructor(
    private withTenantService: WithTenantService,
    private agentService: AgentService,
  ) {}

  public async getAll({
    tenantId,
  }: EventAnonCredsCredentialDefinitionsGetAllInput): Promise<
    EventAnonCredsCredentialDefinitionsGetAll['data']
  > {
    return this.withTenantService.invoke(tenantId, async (t) =>
      (await t.modules.anoncreds.getCreatedCredentialDefinitions({})).map(
        ({ credentialDefinitionId, credentialDefinition }) => ({
          credentialDefinitionId,
          ...credentialDefinition,
        }),
      ),
    );
  }

  public async getById({
    tenantId,
    credentialDefinitionId,
  }: EventAnonCredsCredentialDefinitionsGetByIdInput): Promise<
    EventAnonCredsCredentialDefinitionsGetById['data']
  > {
    return this.withTenantService.invoke(tenantId, async (t) => {
      const { credentialDefinition } =
        await t.modules.anoncreds.getCredentialDefinition(
          credentialDefinitionId,
        );
      return credentialDefinition
        ? { credentialDefinitionId, ...credentialDefinition }
        : null;
    });
  }

  public async register({
    tenantId,
    schemaId,
    issuerDid,
    supportsRevocation,
    tag,
  }: EventAnonCredsCredentialDefinitionsRegisterInput): Promise<
    EventAnonCredsCredentialDefinitionsRegister['data']
  > {
    const endorserDid = await this.agentService.getEndorserDid(issuerDid);
    return this.withTenantService.invoke(tenantId, async (t) => {
      const { credentialDefinitionState } =
        await t.modules.anoncreds.registerCredentialDefinition<IndyVdrRegisterCredentialDefinitionOptions>(
          {
            credentialDefinition: {
              issuerId: issuerDid,
              schemaId,
              tag,
            },
            options: {
              endorserMode: 'external',
              endorserDid,
              supportRevocation: supportsRevocation,
            },
          },
        );

      if (
        credentialDefinitionState.state !== 'action' ||
        credentialDefinitionState.action !== 'endorseIndyTransaction'
      ) {
        throw new Error(
          `Error registering credentialDefinition: ${
            credentialDefinitionState.state === 'failed'
              ? credentialDefinitionState.reason
              : 'Not Finished'
          }`,
        );
      }

      const signedcredentialDefinitionRequest =
        await this.agentService.endorseTransaction(
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          credentialDefinitionState.credentialDefinitionRequest,
          endorserDid,
        );

      const credentialDefinitionSubmitResult =
        await t.modules.anoncreds.registerCredentialDefinition<IndyVdrRegisterCredentialDefinitionOptions>(
          {
            options: {
              endorsedTransaction: signedcredentialDefinitionRequest,
              endorserMode: 'external',
              supportRevocation: supportsRevocation,
            },
            credentialDefinition:
              credentialDefinitionState.credentialDefinition,
          },
        );

      if (
        credentialDefinitionSubmitResult.credentialDefinitionState.state !==
        'finished'
      ) {
        throw Error(
          `Error while registering credentialDefinition. Cause: ${JSON.stringify(credentialDefinitionSubmitResult)}`,
        );
      }

      return {
        credentialDefinitionId:
          credentialDefinitionState.credentialDefinitionId,
        ...credentialDefinitionState.credentialDefinition,
      };
    });
  }
}
