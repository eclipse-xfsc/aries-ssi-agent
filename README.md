# Organization Credential Manager (OCM)

## Introduction

Organization Credential Manager (OCM) is a comprehensive suite of microservices designed to facilitate the management of digital credentials within an organizational context. Utilizing the principles of Self-Sovereign Identity (SSI), OCM leverages a series of components to enable secure, efficient handling of credentials, keys, and connections between entities.

## Components

OCM is comprised of several key microservices, each serving a specific role within the credential management ecosystem:

### [SSI Abstraction](apps/ssi-abstraction/README.md)
A wrapper around the Credo library ([Credo](https://credo.js.org)), formerly known as Aries Framework Javascript, an implementation of a Hyperledger Indy Agent in TypeScript. This service abstracts the complexities of SSI operations for other components.

### [Tenant Manager](apps/tenant-manager/README.md)
Manages the creation and listing of OCM tenants, with each tenant maintaining their collections of credentials, keys, etc. This service acts as a critical interface to the SSI Abstraction functionality and is intended for administrative use only.

### [DID Manager](apps/did-manager/README.md)
Provides API functions for registering Decentralized Identifiers (DIDs) on the Indy Ledger and resolving existing DID Documents, facilitating secure identity verification and management.

### [Connection Manager](apps/connection-manager/README.md)
Facilitates the establishment of connections between OCM tenants using Aries protocols, enabling secure, verified interactions.

### [Schema Manager](apps/schema-manager/README.md)
Allows tenants to manage Indy Schemas and Credential Definitions, laying the groundwork for the creation and recognition of standardized credential formats.

### [Credential Manager](apps/credential-manager/README.md)
Offers an API for the detailed management of tenant credentials, streamlining the process of issuing, holding, and verifying digital credentials.

### [Proof Manager](apps/proof-manager/README.md)
Enables tenants to create proof requests, an essential feature for the verification of credential authenticity and integrity.

## Deployment

### Kubernetes

OCM can be deployed within a Kubernetes cluster to leverage the benefits of container orchestration for managing and scaling the microservices efficiently. The deployment process is streamlined through the use of Helm, a package manager for Kubernetes that facilitates the installation, upgrade, and management of Kubernetes applications.

Each microservice within OCM is equipped with its own Helm chart located in the service's folder. These Helm charts define the Kubernetes resources required for deploying and running the service, including Deployments, Services, and any necessary ConfigMaps or Secrets.

### Docker Compose (Local)

For local development and testing purposes, the OCM stack can also be run using Docker Compose with the following command:

```bash
docker compose up -d
```

This command builds the service container images and starts the stack. It's a convenient way to quickly bring up the OCM environment on a local machine for development, testing, or demonstration purposes.

#### Starting multiple instances of OCM

To demonstrate 
```bash
./scripts/start_instance.sh
```

> This command can be run multiple times to start several instances of OCM.

> To stop instances that were started using the above command, use `./scripts/stop_instance.sh`.

## Local Development

To run each service locally, the following prerequisites are needed:

- Node.js (installed on the local machine)
- pnpm (package manager)
- Docker Compose (for running NATS server and S3 storage)

Before starting a service, create a `.env` file in the service's directory based on the `.env.example` provided, renaming it to `.env`.

## Documentation and Example Flows

For detailed usage and example flows, please refer to the [Postman Collection](documentation/Gaia-X_Organization_Credential_Manager.postman_collection.json) and the [OCM Example Flows](documentation/ocm-example-flows.md).

## Security

Note: Authentication and Authorization mechanisms are considered outside the scope of this project and should be addressed at the infrastructure level or through other means.

## License

Licensed under the Apache 2.0 License ([LICENSE](LICENSE)).
