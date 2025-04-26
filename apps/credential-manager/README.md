# OCM Credential Manager

## Introduction
The OCM Credential Manager API enables you to:
- Fetch credentials, offers and requests
- Revoke credentials
- Accept credential offers
- Evaluate TSA policies for single credentials

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
| `POLICIES_URL` | TSA Policy Manager URL | |
| `POLICIES_AUTO_REVOCATION_POLICY` | Policy name for auto revocation check | |
| `POLICIES_AUTO_REISSUE_POLICY` | Policy name for auto-reissue check | |
| `POLICIES_REFRESH_POLICY` | Policy name for refresh check | |

## Usage

Start in development mode:
```bash
pnpm start
```

### Operations
> **Note:** All requests need a `tenantId` query parameter.

#### Get credential list

```bash
curl -X GET http://ocm-indy.xfsc.dev/v1/credentials?tenantId=<tenantId>
```

Response:

```json
{
  "status": 200,
  "data": [...]
}
```

#### Revoke a credential

```bash
curl -X POST http://ocm-indy.xfsc.dev/v1/credentials/?tenantId=<tenantId>
```

Response:

```json
{
  "status": 201,
  "data": {}
}
```

## API Reference
For detailed documentation, refer to the [OpenAPI Specification](openapi.json).

## License
Licensed under the Apache 2.0 License ([LICENSE](LICENSE)).
