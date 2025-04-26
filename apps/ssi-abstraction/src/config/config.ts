// import { AutoAcceptCredential } from '@credo-ts/core';

// export interface AppConfig {
//   agentHost: string;
//   port: number;
//   jwtSecret: string;

//   tailsServer: {
//     baseUrl: string;
//     bucketName: string;
//   };

//   s3: {
//     secret: string;
//     accessKey: string;
//   };

//   nats: {
//     url: string;
//     user?: string;
//     password?: string;
//   };

//   agent: {
//     name: string;
//     walletId: string;
//     walletKey: string;
//     ledgerIds?: string[];
//     host: string;
//     inboundPort: number;
//     path: string;
//     indyDidSeed: string;
//     autoAcceptConnection: boolean;
//     autoAcceptCredential: AutoAcceptCredential;
//   };
// }

// export const config = (): AppConfig => ({
//   agentHost: process.env.AGENT_HOST || '',
//   port: parseInt(process.env.PORT || '3000'),
//   jwtSecret: process.env.JWT_SECRET || '',

//   nats: {
//     url: process.env.NATS_URL || '',
//     user: process.env.NATS_USER || '',
//     password: process.env.NATS_PASSWORD || '',
//   },

//   s3: {
//     secret: process.env.S3_SECRET || '',
//     accessKey: process.env.S3_ACCESS_KEY || '',
//   },

//   tailsServer: {
//     baseUrl: process.env.TAILS_SERVER_BASE_URL || '',
//     bucketName: process.env.TAILS_SERVER_BUCKET_NAME || '',
//   },

//   agent: {
//     name: process.env.AGENT_NAME || '',
//     walletId: process.env.AGENT_WALLET_ID || '',
//     walletKey: process.env.AGENT_WALLET_KEY || '',
//     ledgerIds: process.env.AGENT_LEDGER_ID?.split(','),
//     host: process.env.AGENT_HOST || '',
//     inboundPort: Number(process.env.AGENT_INBOUND_PORT || '3001'),
//     path: process.env.AGENT_URL_PATH || '',
//     indyDidSeed: process.env.AGENT_INDY_DID_SEED || '',
//     autoAcceptConnection: process.env.AGENT_AUTO_ACCEPT_CONNECTION === 'true',
//     autoAcceptCredential:
//       (process.env.AGENT_AUTO_ACCEPT_CREDENTIAL as AutoAcceptCredential) ||
//       AutoAcceptCredential.ContentApproved,
//   },
// });
