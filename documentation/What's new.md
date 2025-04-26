# Organization Credential Manager (OCM) - What's New?

Welcome to the latest version of the Organization Credential Manager (OCM)! This release marks a significant step forward in our commitment to improving secure and efficient credential management. Below, we detail the enhancements and new features introduced in this version:

## Enhanced Aries Interop Profile Support

- **AIP 2.0 Integration:** This version proudly supports the Aries Interop Profile (AIP) version 2.0, advancing our compatibility and interoperability within the decentralized identity ecosystem.

## Foundation on Credo

- **Credo-Based Architecture:** OCM has transitioned to leverage the latest version of Credo (formerly known as Aries Framework JavaScript). This update forms the backbone of our system, ensuring a robust and flexible framework. Learn more about Credo [here](https://credo.js.org/).

## Streamlined Components

- **Reworked Microservices:** The architecture of OCM components has been optimized for simplicity and efficiency. Microservices now act as slender interfaces to the SSI Abstraction service, offering HTTP APIs for seamless interaction.

## Introduction of Multitenancy

- **Multitenancy Support:** We've introduced multitenancy, allowing a single OCM instance to serve multiple tenants simultaneously. Tenant data is meticulously separated and encrypted at the database level, ensuring privacy and security.

## Attestation Manager Evolution

- **Service Specialization:** The Attestation Manager has been divided into two specialized services: the Schema Manager, focusing on schemas and credential definitions, and the Credential Manager, dedicated to credential operations. This separation enhances functionality and streamlines processes.

## Unified Communication Protocol

- **NATS Messaging:** To improve internal communication, all service interactions have been standardized to use NATS messaging. This replaces the previous mixed use of NATS messages and HTTP APIs, leading to more consistent and efficient communication.

## Trust Services Policies

- **Credential Manager Enhancements:** Basic support for Trust Services (TSA) policies has been added to the Credential Manager. These policies cover credential re-issuance, automatic refreshing, and auto revocation, fortifying the trustworthiness of credentials managed by OCM.
