# OCM Connection Manager

## Introduction
The OCM Connection Manager API enables you to:
- Create and accept invitations
- Create self-connections
- List all connections
- Retrieve a connection by ID
- Block connections

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

#### Create an Invitation
```bash
curl -X POST http://ocm-indy.xfsc.dev/v1/invitations?tenantId=<tenantId>
```
Response:
```json
{
  "status": 201,
  "data": {
    "invitationUrl": "http://ocm-indy.xfcs.dev?oob=..."
  }
}
```

#### Accept an Invitation
```bash
curl -X POST -d '{"invitationUrl":"..."}' http://ocm-indy.xfsc.dev/v1/invitations/accept?tenantId=<tenantId>
```

#### Create a Self-Connection
```bash
curl -X POST http://ocm-indy.xfsc.dev/v1/connections?tenantId=<tenantId>
```

## API Reference
For detailed documentation, refer to the [OpenAPI Specification](openapi.json).

## License
Licensed under the Apache 2.0 License ([LICENSE](LICENSE)).
