import { DidDocument } from '@credo-ts/core';

import { EventDidsResolve } from '../didEvents.js';

describe('Did Events', () => {
  it('should return module', () => {
    jest.requireActual('../didEvents');
  });

  it('should create did resolve event', () => {
    const doc = new DidDocument({ id: 'did:my:id' });
    const event = new EventDidsResolve(doc, 'tenantId');

    expect(typeof event.id).toStrictEqual('string');
    expect(event.type).toStrictEqual('EventDidsResolve');
    expect(event.timestamp).toBeInstanceOf(Date);
    expect(event.instance).toMatchObject(doc);
  });
});
