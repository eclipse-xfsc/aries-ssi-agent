# OCM SSI Abstraction Manager

## Introduction
SSI Abstraction is a core component of the OCM microservices stack, designed to interface with the Indy Ledger. This connection is facilitated through the `AGENT_LEDGER_ID` environment variable, which specifies the target ledger for operations and transactions.

Underpinning SSI Abstraction is the engine credo-ts, which leverages an internal SQLite database to store and manage data efficiently. This database is integral to the operation of SSI Abstraction, providing a robust and reliable storage solution that supports the service's functionality and performance requirements.

SSI Abstraction is designed to subscribe to a specific set of events, facilitating its communication within the OCM ecosystem. This subscription model is central to how SSI Abstraction receives and processes requests from other services in the stack. The List of these events is in the `events.md` file. Communication with SSI Abstraction is achieved as other services publish these predefined events on NATS. This mechanism ensures a decoupled, scalable, and efficient way for services to interact and fulfill their roles within the microservices architecture.

SSI Abstraction requires an S3-compatible server to store tails files, which are essential for the credential revocation mechanism within the Indy ledger system. Details, such as the server URL, the access key and the secret key, are set with respective environment variables.

In the SSI Abstraction component, the endorser DID seed plays a critical role in the endorsement of tenants' transactions on the ledger. This seed is a foundational element used to generate a Digital Identity (DID) that possesses the authority to endorse transactions, ensuring they are valid and authorized for inclusion on the ledger. The endorser DID seed is configured within SSI Abstraction through the `AGENT_INDY_DID_SEED` environment variable. By setting this variable, administrators can define the specific seed value that will be used to generate the endorser DID, thereby granting the necessary permissions for transaction endorsement.

## Prerequisites
Ensure you have Node.js installed ([official Node.js website](https://nodejs.org)).
You will also need a DID which has at least the 'ENDORSER' permission on the ledger.

## Configuration
Set configuration via environment variables or an `.env` file:

| Property | Description | Default |
|---|---|---|
| `HTTP_HOSTNAME` | HTTP server hostname | `0.0.0.0` |
| `HTTP_PORT` | HTTP server port | `3000` |
| `NATS_URL` | NATS Server URL | `nats://localhost:4222` |
| `NATS_USER` | Username for NATS authentication |  |
| `NATS_PASSWORD` | Password for NATS authentication |  |
| `NATS_MONITORING_URL` | URL for accessing NATS monitoring interface | `http://localhost:8222` |
| `AGENT_NAME` | Name identifier for the agent within the ecosystem |  |
| `AGENT_WALLET_ID` | Unique identifier for the agent's wallet |  |
| `AGENT_WALLET_KEY` | Key of the agent's wallet |  |
| `AGENT_HOST` | Hostname or IP address where the agent service is accessible |  |
| `AGENT_INBOUND_PORT` | Port for inbound connections to the agent | `3001` |
| `AGENT_INDY_DID_SEED` | Seed used to generate the agent's DID for transactions on the ledger |  |
| `AGENT_AUTO_ACCEPT_CONNECTION` | Automatically accept incoming connection requests | `true` |
| `AGENT_AUTO_ACCEPT_CREDENTIAL` | Automatically accept incoming credential offers | `contentApproved` |
| `AGENT_LEDGER_ID` | Identifier for the ledger the agent interacts with |  |
| `TAILS_SERVER_BASE_URL` | Base URL for the server hosting tails files for revocation |  |
| `TAILS_SERVER_BUCKET_NAME` | Name of the bucket on the tails file server |  |
| `S3_ACCESS_KEY` | Access key for S3 or S3-compatible storage service |  |
| `S3_SECRET` | Secret key for S3 or S3-compatible storage service |  |

## Usage

Start in development mode:
```bash
pnpm start
```

## License
Licensed under the Apache 2.0 License ([LICENSE](LICENSE)).

