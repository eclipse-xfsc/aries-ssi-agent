import type { AnonCredsSchema } from '@credo-ts/anoncreds';
import type { IndyVdrRegisterSchemaOptions } from '@credo-ts/indy-vdr';
import type {
  EventAnonCredsSchemasGetAll,
  EventAnonCredsSchemasGetAllInput,
  EventAnonCredsSchemasGetById,
  EventAnonCredsSchemasGetByIdInput,
  EventAnonCredsSchemasRegister,
  EventAnonCredsSchemasRegisterInput,
} from '@ocm/shared';

import { Injectable } from '@nestjs/common';

import { AgentService } from '../agent.service.js';
import { WithTenantService } from '../withTenantService.js';

@Injectable()
export class SchemasService {
  public constructor(
    private withTenantService: WithTenantService,
    private agentService: AgentService,
  ) {}

  public async getAll({
    tenantId,
  }: EventAnonCredsSchemasGetAllInput): Promise<
    EventAnonCredsSchemasGetAll['data']
  > {
    return this.withTenantService.invoke(tenantId, async (t) =>
      (await t.modules.anoncreds.getCreatedSchemas({})).map((r) => r.schema),
    );
  }

  public async getById({
    tenantId,
    schemaId,
  }: EventAnonCredsSchemasGetByIdInput): Promise<
    EventAnonCredsSchemasGetById['data']
  > {
    return this.withTenantService.invoke(tenantId, async (t) => {
      const { schema } = await t.modules.anoncreds.getSchema(schemaId);
      return schema ?? null;
    });
  }

  public async register({
    tenantId,
    name,
    version,
    issuerDid,
    attributeNames,
  }: EventAnonCredsSchemasRegisterInput): Promise<
    EventAnonCredsSchemasRegister['data']
  > {
    return this.withTenantService.invoke(tenantId, async (t) => {
      const endorserDid = await this.agentService.getEndorserDid(issuerDid);

      const { schemaState } =
        await t.modules.anoncreds.registerSchema<IndyVdrRegisterSchemaOptions>({
          schema: {
            version,
            name,
            issuerId: issuerDid,
            attrNames: attributeNames,
          },
          options: {
            endorserMode: 'external',
            endorserDid,
          },
        });

      if (
        schemaState.state !== 'action' ||
        schemaState.action !== 'endorseIndyTransaction'
      ) {
        throw new Error(
          `Error registering schema: ${
            schemaState.state === 'failed' ? schemaState.reason : 'Not Finished'
          }`,
        );
      }

      const signedschemaRequest = await this.agentService.endorseTransaction(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        schemaState.schemaRequest,
        endorserDid,
      );

      const schemaSubmitResult =
        await t.modules.anoncreds.registerSchema<IndyVdrRegisterSchemaOptions>({
          options: {
            endorsedTransaction: signedschemaRequest,
            endorserMode: 'external',
          },
          schema: schemaState.schema,
        });

      if (schemaSubmitResult.schemaState.state !== 'finished') {
        throw Error(
          `Error while registering schema. Cause: ${JSON.stringify(schemaSubmitResult)}`,
        );
      }

      return { schemaId: schemaState.schemaId, ...schemaState.schema };
    });
  }
}
