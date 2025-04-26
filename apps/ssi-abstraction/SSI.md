# Self Sovereign Identity Design

## Aries Interoperability Profile 2.0

[Specification](https://github.com/hyperledger/aries-rfcs/blob/main/concepts/0302-aries-interop-profile/README.md#aries-interop-profile-version-20)

The Aries Interoperability Profile 2.0 (AIP 2.0), is an interoperability
profile which defines a set, with extensions, of DIDComm messages to support
for interoperability.
    [Credo](https://github.com/openwallet-foundation/credo-ts), the underlying
    self-sovereign identity framework, has recently been made compatible with
    AIP 2.0 and all the features required for AIP 2.0 are enabled in this
    package.

Sub profile [DIDComm v2
prep](https://github.com/hyperledger/aries-rfcs/blob/main/concepts/0302-aries-interop-profile/README.md#didcommv2prep-didcomm-v2-prep)
is not currently supported, but this will not cause any major issues as it is
also an additional sub profile and not part of the main AIP 2.0 profile. When
this is supported within Credo, a simple dependency update will automatically
add support for this.

Currently, it includes the following credential, and proof, protocols and
credential, and proof, formats:

- Issue Credential V2 Protocol
    - AnonCreds Credential Format
    - Legacy Indy Credential Format
- Present Proof V2
    - AnonCreds Proof Format
    - Legacy Indy Proof Format

Out of the box it also supports the `id union test network`, `bcovrin test
network` and `bcovrin greenlight network`. For production use cases, more
ledgers should be added, like `sovrin mainnet`, `bcovrin mainnet` and `id union
mainnet`.

## Multi tenancy

The SSI Abstraction includes support for multi-tenancy. Multi-tenancy is still
an experimental feature within Credo, but has been used for the last months in
production environments without any notable issues. Multi-tenancy within the
context of the SSI Abstraction means that we can have a single "agent" which
has a single wallet which contains multiple different properties for each
tenant. Each tenant uses their own symmetric key to be able to access their
data. The other tenants, and the root agent do NOT have access to each others
information, even though it is inside a single wallet.

There is currently no authentication cross tenants when executing a request,
this means that this MUST be implemented outside of the OCM. Currently, without
any authentication, anyone could brute-force a bunch of UUIDs and attempt to
access a wallet. It is advised when creating a tenant to use JWTs, which will
include the tenant ID (UUID), for authentication.

The limit for open sessions is currently 100. Each session is terminated after
the function is finished so this means that you could have thousands of
tenants, but only 100 max actively doing something. This number may be
increased if desired. If a tenant is not active, that does not mean that they
cannot receive any messages, this happens on the root agent. The root agent,
however, can not read the incoming messages, only the intended tenant.

## Native Dependencies

The SSI Abstractions agent uses
[AnonCreds](https://github.com/hyperledger/anoncreds), [Aries
Askar](https://github.com/hyperledger/aries-askar) and [Indy
VDR](https://github.com/hyperledger/indy-vdr). These are used for the AnonCreds
credential format, wallet storage and cryptography and interaction with
Indy-based ledgers, respectively. There is no more reference to the deprecated
Indy-SDK.
