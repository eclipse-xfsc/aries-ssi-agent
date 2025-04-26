import { AutoAcceptCredential } from '@credo-ts/core';
import { registerAs } from '@nestjs/config';

export const agentConfig = registerAs('agent', () => ({
  name: process.env.AGENT_NAME || '',
  walletId: process.env.AGENT_WALLET_ID || '',
  walletKey: process.env.AGENT_WALLET_KEY || '',
  walletStorageType: process.env.AGENT_WALLET_STORAGE_TYPE || '',
  walletStorageConfig: {
    host: process.env.AGENT_WALLET_STORAGE_CONFIG_HOST || '',
    timeout: Number(process.env.AGENT_WALLET_STORAGE_CONFIG_TIMEOUT || '0'),
  },
  walletStorageCredentials: {
    account: process.env.AGENT_WALLET_STORAGE_CREDENTIALS_ACCOUNT || '',
    password: process.env.AGENT_WALLET_STORAGE_CREDENTIALS_PASSWORD || '',
    adminAccount:
      process.env.AGENT_WALLET_STORAGE_CREDENTIALS_ADMIN_ACCOUNT || '',
    adminPassword:
      process.env.AGENT_WALLET_STORAGE_CREDENTIALS_ADMIN_PASSWORD || '',
  },
  ledgerIds: process.env.AGENT_LEDGER_ID?.split(',') || [],
  indyDidSeed: process.env.AGENT_INDY_DID_SEED || '',
  indyDid: process.env.AGENT_INDY_DID || '',
  host: process.env.AGENT_HOST || '',
  inboundPort: Number(process.env.AGENT_INBOUND_PORT || '3001'),
  path: process.env.AGENT_URL_PATH || '',
  autoAcceptConnection: process.env.AGENT_AUTO_ACCEPT_CONNECTION === 'true',
  autoAcceptCredential:
    (process.env.AGENT_AUTO_ACCEPT_CREDENTIAL as AutoAcceptCredential) ||
    AutoAcceptCredential.ContentApproved,
}));
