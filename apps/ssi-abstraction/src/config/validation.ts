import { AutoAcceptCredential } from '@credo-ts/core';
import Joi from 'joi';

export const validationSchema = Joi.object({
  HTTP_HOSTNAME: Joi.string().optional(),
  HTTP_PORT: Joi.number().optional(),

  NATS_URL: Joi.string().required(),
  NATS_USER: Joi.string().optional(),
  NATS_PASSWORD: Joi.string().optional(),
  NATS_MONITORING_URL: Joi.string().optional(),

  TAILS_SERVER_BASE_URL: Joi.string().required(),
  TAILS_SERVER_BUCKET_NAME: Joi.string().required(),

  S3_SECRET: Joi.string().required(),
  S3_ACCESS_KEY: Joi.string().required(),

  AGENT_NAME: Joi.string().required(),
  AGENT_WALLET_ID: Joi.string().required(),
  AGENT_WALLET_KEY: Joi.string().required(),
  AGENT_HOST: Joi.string().required(),
  AGENT_INBOUND_PORT: Joi.string(),
  AGENT_URL_PATH: Joi.string(),
  AGENT_AUTO_ACCEPT_CONNECTION: Joi.boolean().default(true),
  AGENT_AUTO_ACCEPT_CREDENTIAL: Joi.string().default(
    AutoAcceptCredential.ContentApproved,
  ),
  AGENT_LEDGER_ID: Joi.string().required(),
  AGENT_INDY_DID_SEED: Joi.string().required(),
  AGENT_INDY_DID: Joi.string().optional(),

  AGENT_WALLET_STORAGE_TYPE: Joi.valid('postgres'),
  AGENT_WALLET_STORAGE_CONFIG_HOST: Joi.when('AGENT_WALLET_STORAGE_TYPE', {
    is: 'postgres',
    then: Joi.string().uri().required(),
  }),
  AGENT_WALLET_STORAGE_CONFIG_TIMEOUT: Joi.number(),
  AGENT_WALLET_STORAGE_CREDENTIALS_ACCOUNT: Joi.string(),
  AGENT_WALLET_STORAGE_CREDENTIALS_PASSWORD: Joi.string(),
  AGENT_WALLET_STORAGE_CREDENTIALS_ADMIN_ACCOUNT: Joi.string(),
  AGENT_WALLET_STORAGE_CREDENTIALS_ADMIN_PASSWORD: Joi.string(),
});
