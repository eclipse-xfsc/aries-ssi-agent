// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import type { ConfigType } from '@nestjs/config';
import type { EventAnonCredsCredentialsGetByIdInput } from '@ocm/shared';

import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { EventAnonCredsCredentialsGetById, TSAService } from '@ocm/shared';
import { of, shareReplay, switchMap, throwError } from 'rxjs';

import { NATS_CLIENT } from '../common/constants.js';
import { policiesConfig } from '../config/policies.config.js';

@Injectable()
export class PoliciesService {
  private readonly logger = new Logger(this.constructor.name);

  public constructor(
    @Inject(NATS_CLIENT) private readonly natsClient: ClientProxy,
    @Inject(policiesConfig.KEY)
    private readonly policiesParams: ConfigType<typeof policiesConfig>,
    private readonly tsaService: TSAService,
  ) {}

  private evaluatePolicy(
    policy: `${string}/${string}/${string}/${string}`,
    tenantId: string,
    credentialId: string,
  ) {
    const logEntry = {
      labels: { tenantId },
      'ocm.policies.credentialId': credentialId,
      'ocm.policies.policy': policy,
    };

    this.logger.debug({ ...logEntry, message: 'Get credential by ID' });
    const getCredential$ = this.natsClient
      .send<
        EventAnonCredsCredentialsGetById,
        EventAnonCredsCredentialsGetByIdInput
      >(EventAnonCredsCredentialsGetById.token, {
        tenantId,
        credentialRecordId: credentialId,
      })
      .pipe(
        switchMap((credential) => {
          if (!credential) {
            this.logger.error({ ...logEntry, message: 'Credential not found' });
            return throwError(
              () => new NotFoundException('Credential not found'),
            );
          }

          return of(credential);
        }),
        shareReplay(),
      );

    this.logger.log({ ...logEntry, message: 'Evaluate policy' });
    return getCredential$.pipe(
      switchMap(() =>
        this.tsaService.evaluatePolicy(policy, {
          credentialId,
        }),
      ),
    );
  }

  public checkAutoReissue(tenantId: string, credentialId: string) {
    if (!this.policiesParams.autoReissue.policy) {
      this.logger.warn({
        message: 'Auto reissue policy is not set',
        labels: { tenantId },
      });
      return { result: false };
    }

    this.logger.log({
      message: 'Check auto reissue policy',
      labels: { tenantId },
      'ocm.policies.policy': this.policiesParams.autoReissue.policy,
    });
    return this.evaluatePolicy(
      this.policiesParams.autoReissue.policy,
      tenantId,
      credentialId,
    );
  }

  public checkAutoRevocation(tenantId: string, credentialId: string) {
    if (!this.policiesParams.autoRevocation.policy) {
      this.logger.warn({
        message: 'Auto revocation policy is not set',
        labels: { tenantId },
      });
      return { result: false };
    }

    this.logger.log({
      message: 'Check auto revocation policy',
      labels: { tenantId },
      'ocm.policies.policy': this.policiesParams.autoRevocation.policy,
    });
    return this.evaluatePolicy(
      this.policiesParams.autoRevocation.policy,
      tenantId,
      credentialId,
    );
  }

  public checkRefresh(tenantId: string, credentialId: string) {
    if (!this.policiesParams.refresh.policy) {
      this.logger.warn({
        message: 'Refresh policy is not set',
        labels: { tenantId },
      });
      return { result: false };
    }

    this.logger.log({
      message: 'Check refresh policy',
      labels: { tenantId },
      'ocm.policies.policy': this.policiesParams.refresh.policy,
    });
    return this.evaluatePolicy(
      this.policiesParams.refresh.policy,
      tenantId,
      credentialId,
    );
  }
}
