# OCM Schema Manager

## Introduction
The OCM Schema Manager API enables you to:
- Register Schemas on the ledger
- Register Credential Definitions on the ledger
- List registered schemas and credential definitions
- Fetch schemas and credential definitions by ID

## Prerequisites
Ensure you have Node.js installed ([official Node.js website](https://nodejs.org)).

## Configuration
Set configuration via environment variables or an `.env` file:

| Property | Description | Default |
|---|---|---|
| `HTTP_HOSTNAME` | HTTP server hostname | `0.0.0.0` |
| `HTTP_PORT` | HTTP server port | `3000` |
| `NATS_URL` | NATS Server URL | `nats://localhost:4222` |
| `NATS_USER` | NATS user |  |
| `NATS_PASSWORD` | NATS password |  |
| `NATS_MONITORING_URL` | NATS Monitoring URL | `http://localhost:8222` |

## Usage

Start in development mode:
```bash
pnpm start
```

### Operations
> **Note:** All requests need a `tenantId` query parameter.

#### Register a new schema

```bash
curl -X POST -d '{"issuerDid":"did:indy:...","name":"...",...}' http://ocm-indy.xfsc.dev/v1/schemas?tenantId=<tenantId>
```

Response:

```json
{
  "statusCode": 201,
  "data": {
    "schemaId": "did:indy:...",
    "name": "...",
    "version": "...",
    ...
  }
}
```

#### Register a credential definition

```bash
curl -X POST -d '{"schemaId":"did:indy:...","tag":"...","supportRevocation":true}' http://ocm-indy.xfsc.dev/v1/credential-definitions?tenantId=<tenantId>
```

Response:

```json
{
  "statusCode": 201,
  "data": {
    "credentialDefinitionId": "did:indy:...",
    "schemaId": "did:indy:...",
    ...
  }
}
```

## API Reference
For detailed documentation, refer to the [OpenAPI Specification](openapi.json).

## License
Licensed under the Apache 2.0 License ([LICENSE](LICENSE)).
