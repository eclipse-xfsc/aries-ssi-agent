# OCM Proof Manager

## Introduction
The OCM Proof Manager API enables you to:
- Request presentation proofs
- List all presentation proofs
- Retrieve a presentation proof by ID
- Accept incoming presentation proofs
- Delete presentation proofs

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

#### Request a presentation proof

```bash
curl -X POST -d '{"name":"Proof_name","connectionId":"0f777ad8-647a-464f-bb93-6b2c5d2805c5","requestedAttributes":{...},"requestedPredicates":{...}}' http://ocm-indy.xfsc.dev/v1/proofs?tenantId=<tenantId>
```

Response:
```json
{
  "status": 201,
  "data": {
      "_tags": {},
      "metadata": {},
      "id": "96f25c87-3702-4269-bbfb-5c7671df0784",
      "createdAt": "2024-03-11T10:00:40.572Z",
      "protocolVersion": "v2",
      "state": "request-sent",
      ...
  }
}
```

#### Accept a presentation proof request

```bash
curl -X POST http://ocm-indy.xfsc.dev/v1/proofs/96f25c87-3702-4269-bbfb-5c7671df0784/accept?tenantId=<tenantId>
```

Response:

```json
{
    "statusCode": 200,
    "data": {
        "_tags": {
            "connectionId": "13254185-deed-4d37-a4a8-3dc56adff524",
            "role": "prover",
            "state": "request-received",
            "threadId": "d78ed0ad-1ad6-41db-bccc-2acf57b5cdd5"
        },
        ...
    }
}
```

## API Reference
For detailed documentation, refer to the [OpenAPI Specification](openapi.json).

## License
Licensed under the Apache 2.0 License ([LICENSE](LICENSE)).
