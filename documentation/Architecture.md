# Chapter: System Architecture of Organization Credential Manager (OCM)

## Introduction to Microservice Architecture

In today's fast-paced and scalable application development environments, microservice architecture has emerged as a pivotal design choice. This architectural style structures an application as a collection of loosely coupled services, each implementing a specific business functionality or process. Unlike monolithic architectures, where different functions are tightly integrated into a single application, microservices are developed, deployed, and scaled independently.

### Advantages of Microservice Architecture

1. **Scalability**: Microservices can be independently scaled to meet demand for specific functionalities of the application, allowing for efficient resource utilization.
2. **Flexibility**: Teams can develop, test, and deploy updates to individual microservices without impacting the entire system, enabling rapid iteration and innovation.
3. **Resilience**: The failure of a single microservice does not necessarily compromise the entire system, enhancing overall resilience and uptime.
4. **Technology Diversity**: Microservices allow for the use of different technology stacks across various components, catering to the optimal tools for specific tasks.

## OCM Architecture Components

The Organization Credential Manager (OCM) leverages microservice architecture to offer a modular, scalable, and efficient solution for managing digital identities and credentials. Here is an overview of the key components within the OCM architecture:

### SSI Abstraction

This component encapsulates the `Credo` JavaScript library, offering a comprehensive suite of tools for implementing Self-Sovereign Identity (SSI) solutions. It abstracts the complexity of SSI functionalities, providing a simplified interface for other services within the OCM architecture.

- **URL**: [https://credo.js.org/](https://credo.js.org/)

### Tenant Manager

The Tenant Manager is a dedicated service responsible for managing tenants within the OCM installation. It ensures that tenant data is isolated and managed securely, enabling organizations to maintain separate environments for different user groups or projects.

### DID Manager

The Decentralized Identifiers (DID) Manager oversees the creation, resolution, and management of DIDs. These identifiers are central to establishing and verifying digital identities in a decentralized manner, pivotal for the integrity and trustworthiness of the OCM system.

### Schema Manager

This service manages schemas and credential definitions, primarily focusing on the Indy framework. It plays a crucial role in defining the structure and rules for the credentials being issued, ensuring consistency and compatibility across the ecosystem.

### Connection Manager

The Connection Manager facilitates the management of connections between OCM users and other parties. It ensures secure and reliable communication channels for exchanging credentials and proofs, vital for the seamless operation of SSI solutions.

### Credential Manager

Responsible for issuing credentials based on the AnonCreds protocol, the Credential Manager allows for the creation of verifiable digital credentials. These credentials can be securely shared and verified across the network without revealing unnecessary personal information.

### Proof Manager

The Proof Manager handles the creation and management of proof requests. It enables verifiers to request and receive proofs of credentials from holders, ensuring the authenticity and validity of the shared information without compromising the holder's privacy.

### Scalability and Independence

Thanks to the microservice architecture, each of these services can be scaled independently to address higher loads. This design allows the OCM system to efficiently manage resources and maintain high performance, even as demand for specific services varies.

## Conclusion

The Organization Credential Manager (OCM) is designed with a modern, microservice-based architecture to deliver a scalable, resilient, and flexible solution for digital identity management. Through its suite of specialized components, OCM provides a comprehensive ecosystem for managing decentralized identifiers, credentials, and connections, ensuring a robust infrastructure for SSI applications.
