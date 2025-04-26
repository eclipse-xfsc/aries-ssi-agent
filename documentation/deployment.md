# Organization Credential Manager Deployment Guide

This guide outlines the procedures for deploying the Organization Credential Manager (OCM) platform. OCM facilitates efficient management and deployment of credentials within organizations, tailored for containerized applications. This document covers how to run OCM in Docker, run services locally for development purposes, and deploy on Kubernetes for scalable production environments.

## Running Everything in Docker

This section describes how to deploy OCM using Docker.

### Prerequisites
Ensure the following are installed:
- Docker Compose: Necessary for managing multi-container Docker applications.

### Steps
To start all OCM components in Docker, execute the following command:
```bash
docker compose up -d
```
This initiates all required components as background processes without needing additional configuration steps.

## Running Services Locally

For development, testing, or debugging, services can be run locally to allow direct interaction with the code.

### Prerequisites
The following should be installed:
- Node.js: The JavaScript runtime for server-side execution.
- PNPM: A package manager offering efficiency and speed.
- NATS Server: Facilitates messaging and inter-service communication. A local NATS Server could be started using the command:
  ```bash
  docker compose up -d nats
  ```
- S3-compatible Server: Necessary for revocation functionality. A local MinIO server could be started using the command:
  ```bash
  docker compose up -d s3
  ```

### Steps
Follow these steps to run a service locally:
1. Clone the OCM repository to your local environment.
2. Install dependencies with `pnpm install`.
3. Create a `.env` file in the service's root directory (e.g., `apps/credential-manager/.env`), using `.env.example` as a template.
4. To start the service, run `pnpm -F SERVICE_NAME start`, replacing `SERVICE_NAME` with the directory name under `apps` for the desired service.

## Kubernetes Deployment

Kubernetes offers a scalable and resilient environment for production deployments of OCM.

### Overview
OCM services are equipped with Helm charts to facilitate deployment on Kubernetes, found at `apps/SERVICE_NAME/deployment/helm`.

### Steps
To deploy a service on Kubernetes:
1. Ensure `kubectl` and Helm are installed and configured with your cluster.
2. Navigate to the service's Helm chart directory: `apps/SERVICE_NAME/deployment/helm`.
3. Deploy the service using Helm:
   ```bash
   helm install SERVICE_NAME ./ -f values.yaml
   ```
   Replace `SERVICE_NAME` with the actual service name and adjust `values.yaml` as necessary for your specific deployment needs.
