import type {
  EventDidsDidConfigurationInput,
  EventDidsRegisterIndyFromSeedInput,
  EventDidsResolveInput,
} from '@ocm/shared';

import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  EventDidsDidConfiguration,
  EventDidsRegisterIndyFromSeed,
  EventDidsResolve,
} from '@ocm/shared';
import { map } from 'rxjs';

import { NATS_CLIENT } from '../common/constants.js';

@Injectable()
export class DIDsService {
  private readonly logger = new Logger(this.constructor.name);

  public constructor(
    @Inject(NATS_CLIENT) private readonly natsClient: ClientProxy,
  ) {}

  public resolve(tenantId: string, did: EventDidsResolveInput['did']) {
    this.logger.log({
      message: 'Resolve DID',
      labels: { tenantId },
      'ocm.dids.did': did,
    });
    return this.natsClient
      .send<
        EventDidsResolve,
        EventDidsResolveInput
      >(EventDidsResolve.token, { tenantId, did })
      .pipe(map(({ data }) => data));
  }

  public registerFromSeed(
    tenantId: string,
    seed: EventDidsRegisterIndyFromSeedInput['seed'],
    services?: Array<{ id: string; type: string; serviceEndpoint: string }>,
  ) {
    this.logger.log({
      message: 'Register DID from seed',
      labels: { tenantId },
      'ocm.dids.seed': '*****',
      'ocm.dids.services': services,
    });
    const data: EventDidsRegisterIndyFromSeedInput = { tenantId, seed };

    if (services && services.length > 0) {
      const mappedServices: EventDidsRegisterIndyFromSeedInput['services'] =
        services?.map(({ id, type, serviceEndpoint }) => ({
          identifier: id,
          type,
          url: serviceEndpoint,
        }));

      data.services = mappedServices;
    }

    return this.natsClient
      .send<
        EventDidsRegisterIndyFromSeed,
        EventDidsRegisterIndyFromSeedInput
      >(EventDidsRegisterIndyFromSeed.token, data)
      .pipe(map(({ data }) => data));
  }

  public getConfiguration(
    tenantId: string,
    domain: EventDidsDidConfigurationInput['domain'],
    expiryTime: EventDidsDidConfigurationInput['expiryTime'],
  ) {
    this.logger.log({
      message: 'Get DID configuration',
      labels: { tenantId },
      'ocm.dids.domain': domain,
      'ocm.dids.expiryTime': expiryTime,
    });
    return this.natsClient
      .send<
        EventDidsDidConfiguration,
        EventDidsDidConfigurationInput
      >(EventDidsDidConfiguration.token, { tenantId, domain, expiryTime })
      .pipe(map(({ data }) => data));
  }
}
