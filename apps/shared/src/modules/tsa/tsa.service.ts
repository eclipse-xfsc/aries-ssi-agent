import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { map } from 'rxjs';

import { TSAModuleOptions } from './interfaces/tsa-module-options.interface.js';
import { MODULE_OPTIONS_TOKEN } from './tsa.module-definition.js';

@Injectable()
export class TSAService {
  public constructor(
    private readonly http: HttpService,
    @Inject(MODULE_OPTIONS_TOKEN)
    private readonly moduleOptions: TSAModuleOptions,
  ) {}

  /**
   * Evaluates the given policy.
   * The policy should be specified in the format `repository/group/policy/version`.
   *
   * @param policy - The policy to evaluate. The format is `repository/group/policy/version`,
   * @example `policies/xfsc/didresolve/1.0`
   */
  public evaluatePolicy(
    policy: `${string}/${string}/${string}/${string}`,
    input?: Record<string, unknown>,
  ) {
    return this.http
      .post(`/policy/${policy}/evaluation`, input, {
        baseURL: this.moduleOptions.tsaBaseUrl,
      })
      .pipe(
        map(({ data }) => {
          if (typeof data === 'string') {
            return JSON.parse(data);
          }

          return data;
        }),
      );
  }
}
