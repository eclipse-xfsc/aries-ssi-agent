# Integration with Trust Services (TSA)

The Organization Credential Manager (OCM) integrates seamlessly with Trust Services (TSA) to enhance credential management through robust policy checks. These integrations leverage TSA policies for various credential-related actions, such as auto-revocation, auto-reissue, and refresh operations, utilizing TSA's Policy Manager via specified endpoints and configuration settings.

## Configuration Requirements

Integration with TSA's policy-based functionalities requires:

- **POLICIES_URL**: This environment variable specifies the URL of the TSA Policy Manager and must be set in the Credential Manager's configuration to enable communication with TSA and execution of policy checks.

## Response Processing

For all endpoints described below, the response from TSA contains the result of the policy evaluation. Integrators are responsible for interpreting these responses and taking appropriate actions based on their specific requirements. The response format and the process of handling these results are designed to be flexible, accommodating the varied needs of OCM integrators.

### Credential Auto-Revocation

Auto-revocation ensures that credentials are automatically revoked based on specific policies.

- **Configuration Property**: `POLICIES_AUTO_REVOCATION_POLICY`
    - Must be set to a valid policy name existing on the TSA Policy Manager, as specified by `POLICIES_URL`.

- **Endpoint**: `/v1/policies/check-revocation`
    - A request to this endpoint performs a revocation check by evaluating the specified policy against the credential in question.

### Credential Auto-Reissue

This functionality allows for credentials to be automatically reissued in accordance with predefined policies, ensuring they remain valid and compliant.

- **Configuration Property**: `POLICIES_AUTO_REISSUE_POLICY`
    - Set this to the name of a policy on the TSA Policy Manager that governs the conditions under which credentials should be automatically reissued.

- **Endpoint**: `/v1/policies/check-reissue`
    - Sending a request here triggers the evaluation of the auto-reissue policy against current credentials to determine if reissuance is necessary.

### Credential Refresh

Credential refresh operations ensure that credentials are updated to reflect the latest policies and information.

- **Configuration Property**: `POLICIES_REFRESH_POLICY`
    - Specifies the policy dictating the conditions for refreshing credentials, according to rules set in the TSA Policy Manager.

- **Endpoint**: `/v1/policies/refresh`
    - Requests to this endpoint prompt the Credential Manager to assess whether the credentials meet the current standards and policies for refreshment.

## Conclusion

Integrating OCM with TSA's Trust Services through policy management significantly enhances the security and reliability of credential operations. By properly configuring policies and utilizing the designated endpoints, organizations can automate processes for credential revocation, reissuance, and refreshment, ensuring credentials remain valid and compliant with evolving standards. This integration exemplifies a robust component of modern identity management systems, offering flexibility and scalability to meet the demands of various operational contexts.
