# OCM Example Flows

## Prerequisites

Before diving into the example flows of using Organization Credential Manager (OCM), it's essential to set up the environment and create the foundational elements required for managing digital credentials. Follow these steps to get started:

### Step 1: Create a Tenant

The first step involves creating a tenant within OCM. A tenant represents an organizational entity within OCM, encapsulating its own collection of credentials, keys, and configurations. This step is crucial as it establishes the context within which all subsequent operations will be performed.

To create a tenant, you will need to interact with the [**Tenant Manager**](../apps/tenant-manager/README.md). This can be done through a command-line interface, script, or potentially a user interface developed for administrative purposes. Here's an example command (note: replace `tenant_name` with your desired tenant name):

```bash
# Example command to create a tenant
curl -X POST http://ocm-indy.xfsc.dev/v1/tenants -d '{"label": "tenant_name"}'
```

> **Important:** The Tenant Manager is a critical component that should be secured appropriately. Implementing authentication and authorization mechanisms is out of the scope of this project. It is the responsibility of the OCM Administrator to secure access to the Tenant Manager, potentially by developing a custom user interface and access control system.

### Step 2: Create a DID for the Tenant

After creating a tenant, the next step is to create a Decentralized Identifier (DID) for it. A DID uniquely identifies the tenant and facilitates secure, verifiable interactions within the OCM ecosystem and beyond.

This step is performed using the [**DID Manager**](../apps/did-manager/README.md), which interfaces with the Indy Ledger to register the DID and manage its associated DID Document.

Here's how you can create a DID for your newly created tenant:

```bash
# Example command to create a DID for the tenant
curl -X POST "http://ocm-indy.xfsc.dev/v1/dids?tenantId=<tenantId>" -d '{"seed": "<seed>"}'
```

In this command, replace `<tenantId>` with your tenant's unique identifier and `<seed>` with a randomly generated string of 32 characters. This seed is crucial for the creation of a secure and unique DID. For a detailed example and additional parameters that can be included in the DID creation request, please refer to the [DID Manager's documentation](../apps/did-manager/README.md).

This will register a new DID on the ledger and associate it with your tenant, enabling the tenant to participate in secure digital interactions.

## Connections

### Creating an Invitation

To initiate a secure connection between tenants in the OCM ecosystem, the first step is to create an invitation. This invitation follows the Aries protocol, serving as a standardized way to establish peer-to-peer connections.

To create an invitation, use the Connection Manager service. Here's an example command to generate an invitation:

```bash
curl -X POST "http://ocm-indy.xfsc.dev/v1/invitations?tenantId=<tenantId>"
```

In this command, replace `<tenantId>` with the identifier of the tenant creating the invitation. The response from this command will include an invitation object, which contains the information needed by another tenant to connect.

The response from this command will include an invitationUrl. This URL encapsulates the invitation object, which contains the information needed by another tenant to connect.

### Accepting an Invitation

After an invitation has been created and the `invitationUrl` delivered to the intended recipient, the next step for the recipient is to accept the invitation to initiate the connection process. The delivery of the `invitationUrl` can be achieved through various methods, such as email, sharing a QR code, or any other secure means of communication preferred by the parties involved.

Once the recipient has the `invitationUrl`, they can proceed to accept the invitation using the Connection Manager service. Accepting an invitation establishes a secure, peer-to-peer connection between the two tenants, based on the Aries protocols. Here is an example command for accepting an invitation:

```bash
curl -X POST "http://ocm-indy.xfsc.dev/v1/connection-manager/accept-invitation?tenantId=<recipientTenantId>" -d '{"invitationUrl": "<invitationUrl>"}'
```

In this command, replace `<recipientTenantId>` with the identifier of the tenant accepting the invitation, and `<invitationUrl>` with the URL received. This action completes the connection setup, enabling secure communication and transactions between the two tenants.

### Establishing a Connection to Self

For scenarios where a tenant needs to establish a connection within their own organizational boundaries—essentially connecting to themselves—OCM provides a streamlined process that bypasses the traditional invitation and acceptance steps. This self-connection is particularly useful for internal testing, development, or scenarios where segregated parts of an organization need to interact securely without the need for external verification.

To establish a connection to self, a single request is made, simplifying the connection setup process. Here's how to initiate a self-connection:

```bash
curl -X POST "http://ocm-indy.xfsc.dev/v1/connections?tenantId=<tenantId>"
```

Replace `<tenantId>` with the identifier of the tenant initiating the self-connection. This request does not require a payload, as the necessary information is derived from the tenant ID provided in the request.

This command instructs the Connection Manager to create a new connection record that is automatically marked as active and trusted, without the need for the traditional invitation exchange process. The resulting connection can then be used for internal transactions, credential issuance, and verifications, just like any other connection established through invitation and acceptance.

## Schemas and Credential Definitions

Within the framework of Aries and Hyperledger Indy, the concepts of schemas and credential definitions play crucial roles in the management and issuance of verifiable credentials. Schemas provide a structured template that defines the attributes and format of the credentials, essentially outlining what information a credential will contain. Credential definitions, on the other hand, tie these schemas to specific issuers, enabling them to issue verifiable credentials based on the predefined schema. Together, these components ensure that credentials are issued in a standardized and interoperable manner, facilitating their verification across different systems and platforms.

### Creating a Schema

To create a schema within the OCM ecosystem, utilize the Schema Manager service. Here's how you can initiate the process:

```bash
curl -X POST "http://ocm-indy.xfsc.dev/v1/schemas?tenantId=<tenantId>" -d 'payload'
```

In the command above, replace `<tenantId>` with the identifier of the tenant creating the schema, and replace `'payload'` with the actual payload. The payload should look like this:

```json
{
  "name": "ExampleSchema",
  "version": "1.0",
  "attributeNames": ["firstName", "lastName", "email"],
  "issuerDid": "issuerDidValue"
}
```

This payload includes the schema's name, version, the attribute names it will include, and the `issuerDid`. Ensure to replace `"issuerDidValue"` with the actual DID of the issuer.

### Creating a Credential Definition

After a schema has been established, the subsequent step involves creating a credential definition. This step associates the schema with an issuer, thereby permitting the issuance of verifiable credentials based on that schema. Credential definitions can also specify revocation support, which adds an additional layer of security and control for credential issuers. Here’s how to create a credential definition with revocation support:

```bash
curl -X POST "http://ocm-indy.xfsc.dev/v1/schema-manager/create-credential-definition?tenantId=<tenantId>" -d 'payload'
```

In the above command, replace `<tenantId>` with the identifier of the tenant creating the credential definition, and substitute `'payload'` with the actual payload. The payload should be structured as follows:

```json
{
  "issuerDid": "issuerDidValue",
  "schemaId": "schemaId",
  "tag": "tagValue",
  "supportsRevocation": true
}
```

This detailed payload specifies the `issuerDid`, identifying the issuer, and `schemaId`, linking to the specific schema. The `tag` field, which can be a random semantic version string, helps in distinguishing between different credential definitions created by the same issuer for the same schema. Setting `supportsRevocation` to true enables the issued credentials to be revocable.

## Issuing a Credential

Issuing a credential within the OCM framework involves a two-step process: making an offer for a credential and then accepting this offer. This process aligns with the Aries protocol for credential exchange, ensuring a standardized approach to issuing verifiable credentials.

### Making a Credential Offer

The first step in issuing a credential is to make an offer. This offer is sent from the issuer to the prospective credential holder and includes details about the credential being offered, such as the credential definition ID and the attributes it will contain.

To make a credential offer, the Credential Manager service is used. Here’s how you can initiate a credential offer:

```bash
curl -X POST "http://ocm-indy.xfsc.dev/v1/credential-offers?tenantId=<issuerTenantId>" -d 'payload'
```

Replace `<issuerTenantId>` with the identifier of the tenant (issuer) making the offer. The payload should be structured as follows and replace `'payload'` with it:

```json
{
  "connectionId": "{{connection_id}}",
  "credentialDefinitionId": "{{credential_definition_id}}",
  "attributes": [
    {
      "name": "firstName",
      "value": "John"
    },
    {
      "name": "lastName",
      "value": "Doe"
    }
    // Add other attributes as needed
  ]
}
```

This payload specifies the connection over which the offer is made (`connectionId`), the credential definition ID (`credentialDefinitionId`), and the attributes of the credential being offered.

### Accepting a Credential Offer

Upon receiving a credential offer, the prospective holder can accept the offer to initiate the credential issuance process. Accepting the offer involves sending a response back to the issuer, indicating the recipient's willingness to receive the credential as per the offer's terms.

To accept a credential offer, the Credential Manager service is again utilized. Here's an example command to accept an offer:

```bash
curl -X POST "http://ocm-indy.xfsc.dev/v1/credential-offers/<offer_id>/accept?tenantId=<holderTenantId>"
```

Replace `<holderTenantId>` with the identifier of the tenant (holder) accepting the offer. Replace `"{{offer_id}}"` with the actual ID of the credential offer received. This completes the credential issuance process, successfully issuing the credential from the issuer to the holder.

### Self-Issuance of Credentials

In certain scenarios, a tenant might opt for self-issuance of credentials, where the issuer and the credential holder are the same entity. This process simplifies the credential issuance flow by automatically accepting the credential offer, effectively skipping the manual step of accepting the offer.

Self-issuance is particularly useful for credentials that don't require external verification or approval, allowing for a streamlined, efficient process. To initiate self-issuance, the same Credential Manager service is used, but the process combines making an offer and automatically accepting it in a single step.

Here’s an example of how to initiate a self-issued credential:

```bash
curl -X POST "http://ocm-indy.xfsc.dev/v1/credential-offers/self?tenantId=<tenantId>" -d 'payload'
```

Replace `<tenantId>` with the identifier of the tenant issuing the credential to themselves. The payload should be structured similarly to making an offer but is tailored for self-issuance:

```json
{
  "connectionId": "{{self_connection_id}}",
  "credentialDefinitionId": "{{credential_definition_id}}",
  "attributes": [
    {
      "name": "firstName",
      "value": "John"
    },
    {
      "name": "lastName",
      "value": "Doe"
    }
    // Add other attributes as needed
  ]
}
```

This payload includes the credential definition ID (`credentialDefinitionId`) and the attributes of the credential being issued. Upon submission, the offer is automatically accepted, and the credential is issued directly to the self-issuing tenant, bypassing the need for an explicit acceptance step.

## Proof Requests

The process of requesting and providing proofs is fundamental in the verification of credentials within the OCM framework. This involves two main steps: making a proof request by the verifier and accepting this request by the holder, leading to the sharing of a verifiable proof.

### Making a Proof Request

A proof request is initiated by a verifier who needs to verify certain attributes or credentials held by another party. This request specifies what information is needed and may include specific attributes, credential types, or conditions that the proof must satisfy.

To make a proof request, use the Proof Manager service. Here's how to initiate a proof request:

```bash
curl -X POST "http://ocm-indy.xfsc.dev/v1/proofs?tenantId=<verifierTenantId>" -d 'payload'
```

Replace `<verifierTenantId>` with the identifier of the tenant (verifier) making the proof request. The payload detailing the specifics of the proof request should look like this, and replace `'payload'` with:

```json
{
  "name": "dynamic_chameleon",
  "connectionId": "connectionId",
  "requestedAttributes": {
    "person_names": {
      "names": ["firstName", "lastName"],
      "restrictions": [{}]
    }
  },
  "requestedPredicates": {}
}
```

This payload includes a `name` for the proof request, which is dynamically generated to ensure uniqueness, the `connectionId` over which the request is made, and a `requestedAttributes` object detailing the requirements of the proof, such as the attributes' names and any restrictions related to the credentials being verified. The `requestedPredicates` section can be used to specify additional constraints but is empty in this example.

### Accepting a Proof Request

Upon receiving a proof request, the credential holder can respond by providing the requested proof, assuming they possess the credentials that satisfy the request's criteria. Accepting a proof request involves preparing and sending a proof that meets the verifier's specifications.

To accept a proof request and provide the necessary proof, the Proof Manager service is again utilized. Here's an example command to accept a proof request and send the proof:

```bash
curl -X POST "http://ocm-indy.xfsc.dev/v1/proofs/<proofId>/accept?tenantId=<holderTenantId>" -d 'payload'
```

Replace `<holderTenantId>` with the identifier of the tenant (holder) responding to the proof request.

This action completes the proof exchange, allowing the verifier to receive and verify the proof.

## Revoking Credentials

In certain situations, it may become necessary to revoke a credential that has been issued, for example, if the information is no longer valid or if the credential was issued in error. OCM supports the revocation of credentials, allowing issuers to invalidate a previously issued credential. This process ensures that the credential can no longer be used for verification purposes.

To revoke a credential, a single request is made to the Credential Manager service. This request specifies the `credentialId` of the credential to be revoked. Here's how to initiate a credential revocation:

```bash
curl -X POST "http://ocm-indy.xfsc.dev/v1/credentials/<credentialId>?tenantId=<issuerTenantId>"
```

Replace `<issuerTenantId>` with the identifier of the tenant (issuer) initiating the revocation. Replace `"credentialId"` with the actual ID of the credential you wish to revoke. This action invalidates the credential, ensuring it cannot be presented or verified in future transactions. It's important to note that the revocation process is irreversible, and once a credential is revoked, it cannot be reinstated.
