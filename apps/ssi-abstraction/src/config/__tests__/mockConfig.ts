import { utils } from '@credo-ts/core';
import { ConfigModule } from '@nestjs/config';

import { agentConfig } from '../agent.config.js';
import { httpConfig } from '../http.config.js';
import { natsConfig } from '../nats.config.js';
import { s3Config } from '../s3.config.js';
import { tailsServerConfig } from '../tails-server.config.js';
import { validationSchema } from '../validation.js';

export const mockConfigModule = (port = 3000, withLedger = false) => {
  process.env.AGENT_NAME = 'my-test-agent';
  process.env.AGENT_WALLET_ID = utils.uuid();
  process.env.AGENT_WALLET_KEY = 'some key';
  process.env.AGENT_HOST = 'http://localhost';
  process.env.AGENT_AUTO_ACCEPT_CONNECTION = 'true';
  process.env.AGENT_AUTO_ACCEPT_CREDENTIAL = 'contentApproved';
  process.env.AGENT_INBOUND_PORT = port.toString();

  if (withLedger) {
    process.env.AGENT_LEDGER_ID = 'BCOVRIN_TEST';
    process.env.AGENT_INDY_DID_SEED = '12312367897123300000000000000000';
  }

  return ConfigModule.forRoot({
    isGlobal: true,
    load: [httpConfig, natsConfig, s3Config, tailsServerConfig, agentConfig],
    validationSchema,
  });
};
