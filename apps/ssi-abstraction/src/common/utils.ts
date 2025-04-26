export const parseDid = (did: string) => {
  const [, method, ...namespaceAndNetwork] = did.split(':');

  return {
    method,
    namespaceAndNetwork: namespaceAndNetwork.slice(0, -1).join(':'),
  };
};
