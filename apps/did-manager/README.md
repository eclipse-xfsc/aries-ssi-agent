# OCM DID Manager

## Introduction
OCM DID Manager enables you to:
- Register DIDs from a seed
- Resolve DID Documents
- Get [DID Configuration](https://identity.foundation/.well-known/resources/did-configuration/)

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

#### Register DID from a seed

```bash
curl -X POST -d '{"seed":"s2b6rqknk77x016jkyloy3hnrh6s48le"}' http://ocm-indy.xfsc.dev/v1/dids?tenantId=<tenantId>
```

Response:

```json
{
  "status": 201,
  "data": ["did:indy:..."]
}
```

#### Resolve DID

```bash
curl -X GET http://ocm-indy.xfsc.dev/v1/dids/<did>?tenantId=<tenantId>
```

Response:

```json
{
  "status": 200,
  "data": {
    "@context": [
      "https://w3id.org/did/v1",
      "https://w3id.org/security/suites/ed25519-2018/v1"
    ],
    "id": "did:indy:...",
    ...
  }
}
```

## API Reference
For detailed documentation, refer to the [OpenAPI Specification](openapi.json).

## License
Licensed under the Apache 2.0 License ([LICENSE](LICENSE)).

