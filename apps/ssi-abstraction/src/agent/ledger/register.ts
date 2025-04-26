import type { LedgerIds } from '../../config/ledger.js';

import { logger, logAxiosError } from '@ocm/shared';
import axios from 'axios';

import { LEDGERS } from '../../config/ledger.js';

type RegisterPublicDidOptions = {
  ledgerIds: Array<LedgerIds>;
  seed: string;
  did?: string;
};

type LedgerRegistrationBody = {
  role: 'ENDORSER';
  seed?: string;
  did?: string;
  verkey?: string;
};

type RegisterPublicDidResponse = {
  seed: string;
  did: string;
  verkey?: string;
  namespace: string;
};

export const registerPublicDids = async ({
  ledgerIds,
  seed,
  did,
}: RegisterPublicDidOptions): Promise<Array<RegisterPublicDidResponse>> => {
  const responses: Array<RegisterPublicDidResponse> = [];

  for (const ledgerId of ledgerIds) {
    const ledgerConfig = LEDGERS[ledgerId];
    const ledgerNamespace = ledgerConfig.namespace;

    if (did) {
      const indyDid = `did:indy:${ledgerNamespace}:${did}`;
      logger.warn(
        `Agent DID '${indyDid}' provided in config. Assuming it was registered manually.`,
      );
      responses.push({
        did: indyDid,
        seed,
        namespace: ledgerNamespace,
      });
      continue;
    } else if (
      !('registerNymUrl' in ledgerConfig) ||
      !ledgerConfig.registerNymUrl
    ) {
      throw new Error(
        `Ledger ${ledgerId} does not have a 'registerNymUrl'. Must register DID manually and provide it in 'AGENT_INDY_DID' env variable. Cannot continue without a DID.`,
      );
    }

    try {
      const body: LedgerRegistrationBody = {
        role: 'ENDORSER',
        seed,
      };

      const res = await axios({
        method: 'post',
        url: ledgerConfig.registerNymUrl,
        data: body,
      });

      if (res.data) {
        logger.info('Agent DID registered.');
        res.data.did = `did:indy:${ledgerNamespace}:${res.data.did}`;
        responses.push({ ...res.data, namespace: ledgerNamespace });
      } else {
        throw new Error('No data was returned from the ledger request');
      }
    } catch (err) {
      // if did is already registered on IdUnion it will catch 500, but it's ok
      if (err instanceof axios.AxiosError) logAxiosError(err);
    }
  }

  return responses;
};
