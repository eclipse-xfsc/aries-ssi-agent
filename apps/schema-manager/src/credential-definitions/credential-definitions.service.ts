import type {
  EventAnonCredsCredentialDefinitionsGetAllInput,
  EventAnonCredsCredentialDefinitionsRegisterInput,
  EventAnonCredsRevocationRegisterRevocationRegistryDefinitionInput,
  EventAnonCredsRevocationRegisterRevocationStatusListInput,
} from '@ocm/shared';
import type { Observable } from 'rxjs';

import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  EventAnonCredsCredentialDefinitionsGetAll,
  EventAnonCredsCredentialDefinitionsGetById,
  EventAnonCredsCredentialDefinitionsRegister,
  EventAnonCredsRevocationRegisterRevocationRegistryDefinition,
  EventAnonCredsRevocationRegisterRevocationStatusList,
} from '@ocm/shared';
import { forkJoin, map, shareReplay, switchMap, tap } from 'rxjs';

import { NATS_CLIENT } from '../common/constants.js';

@Injectable()
export class CredentialDefinitionsService {
  private readonly logger = new Logger(this.constructor.name);

  public constructor(
    @Inject(NATS_CLIENT) private readonly natsClient: ClientProxy,
  ) {}

  public findCredentialDefinitions(
    tenantId: string,
  ): Observable<EventAnonCredsCredentialDefinitionsGetAll['data']> {
    this.logger.log({
      message: 'Find all credential definitions',
      labels: { tenantId },
    });
    return this.natsClient
      .send<
        EventAnonCredsCredentialDefinitionsGetAll,
        EventAnonCredsCredentialDefinitionsGetAllInput
      >(EventAnonCredsCredentialDefinitionsGetAll.token, { tenantId })
      .pipe(map((result) => result.data));
  }

  public getCredentialDefinitionById(
    tenantId: string,
    credentialDefinitionId: string,
  ): Observable<EventAnonCredsCredentialDefinitionsGetById['data']> {
    this.logger.log({
      message: 'Get a credential definition by ID',
      labels: { tenantId },
      'ocm.credentialDefinitions.credentialDefinitionId':
        credentialDefinitionId,
    });
    return this.natsClient
      .send(EventAnonCredsCredentialDefinitionsGetById.token, {
        tenantId,
        credentialDefinitionId,
      })
      .pipe(map((result) => result.data));
  }

  public async registerCredentialDefinition(
    tenantId: string,
    payload: Omit<EventAnonCredsCredentialDefinitionsRegisterInput, 'tenantId'>,
  ): Promise<Observable<EventAnonCredsCredentialDefinitionsRegister['data']>> {
    this.logger.log({
      message: 'Register a credential definition',
      labels: { tenantId },
      'ocm.credentialDefinitions.payload': payload,
    });
    const registerCredentialDefinition$ = this.natsClient
      .send<
        EventAnonCredsCredentialDefinitionsRegister,
        EventAnonCredsCredentialDefinitionsRegisterInput
      >(EventAnonCredsCredentialDefinitionsRegister.token, {
        ...payload,
        tenantId,
      })
      .pipe(
        map((result) => result.data),
        shareReplay(),
      );

    if (!payload.supportsRevocation) {
      return registerCredentialDefinition$;
    }

    const registerRevocationRegistryDefinition$ =
      registerCredentialDefinition$.pipe(
        tap(() => {
          this.logger.log({
            message: 'Register a revocation registry definition',
            labels: { tenantId },
          });
        }),
        switchMap((credentialDefinition) =>
          this.natsClient.send<
            EventAnonCredsRevocationRegisterRevocationRegistryDefinition,
            EventAnonCredsRevocationRegisterRevocationRegistryDefinitionInput
          >(
            EventAnonCredsRevocationRegisterRevocationRegistryDefinition.token,
            {
              tenantId,
              issuerDid: payload.issuerDid,
              credentialDefinitionId:
                credentialDefinition.credentialDefinitionId,
              tag: 'default',
              maximumCredentialNumber: 10,
            },
          ),
        ),
        map((result) => result.data),
        shareReplay(),
      );

    const registerStatusList$ = registerRevocationRegistryDefinition$.pipe(
      tap(() => {
        this.logger.log({
          message: 'Register a revocation status list',
          labels: { tenantId },
        });
      }),
      switchMap((revocationRegistry) =>
        this.natsClient.send<
          EventAnonCredsRevocationRegisterRevocationStatusList,
          EventAnonCredsRevocationRegisterRevocationStatusListInput
        >(EventAnonCredsRevocationRegisterRevocationStatusList.token, {
          tenantId,
          issuerDid: payload.issuerDid,
          revocationRegistryDefinitionId:
            revocationRegistry.revocationRegistryDefinitionId,
        }),
      ),
      map((result) => result.data),
    );

    return registerStatusList$
      .pipe(
        switchMap(() =>
          forkJoin({
            credentialDefinition: registerCredentialDefinition$,
            revocationRegistryDefinition: registerRevocationRegistryDefinition$,
          }),
        ),
      )
      .pipe(
        map(({ credentialDefinition, revocationRegistryDefinition }) => ({
          ...credentialDefinition,
          revocationRegistryDefinitionId:
            revocationRegistryDefinition.revocationRegistryDefinitionId,
        })),
      );
  }
}
