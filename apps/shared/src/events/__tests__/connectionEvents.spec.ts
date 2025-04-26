import {
  ConnectionRecord,
  DidExchangeRole,
  DidExchangeState,
} from '@credo-ts/core';

import {
  EventDidcommConnectionsBlock,
  EventDidcommConnectionsCreateWithSelf,
  EventDidcommConnectionsGetAll,
  EventDidcommConnectionsGetById,
} from '../connectionEvents.js';

describe('Connection Events', () => {
  it('should return module', () => {
    jest.requireActual('../connectionEvents');
  });

  it('should create a new connections get all event', () => {
    const event = new EventDidcommConnectionsGetAll([], 'tenantId');

    expect(typeof event.id).toStrictEqual('string');
    expect(event.type).toStrictEqual('EventDidcommConnectionsGetAll');
    expect(event.timestamp).toBeInstanceOf(Date);
    expect(event.instance).toMatchObject([]);
  });

  it('should create a new connections get by id event', () => {
    const event = new EventDidcommConnectionsGetById(null, 'tenantId');

    expect(typeof event.id).toStrictEqual('string');
    expect(event.type).toStrictEqual('EventDidcommConnectionsGetById');
    expect(event.timestamp).toBeInstanceOf(Date);
    expect(event.instance).toBeNull();
  });

  it('should create a new connections create with self event', () => {
    const event = new EventDidcommConnectionsCreateWithSelf(
      new ConnectionRecord({
        role: DidExchangeRole.Requester,
        state: DidExchangeState.Completed,
      }),
      'tenantId',
    );

    expect(typeof event.id).toStrictEqual('string');
    expect(event.type).toStrictEqual('EventDidcommConnectionsCreateWithSelf');
    expect(event.timestamp).toBeInstanceOf(Date);
    expect(event.instance).toMatchObject({
      role: DidExchangeRole.Requester,
      state: DidExchangeState.Completed,
    });
  });

  it('should create a new connections block event', () => {
    const event = new EventDidcommConnectionsBlock(
      new ConnectionRecord({
        role: DidExchangeRole.Requester,
        state: DidExchangeState.Completed,
      }),
      'tenantId',
    );

    expect(typeof event.id).toStrictEqual('string');
    expect(event.type).toStrictEqual('EventDidcommConnectionsBlock');
    expect(event.timestamp).toBeInstanceOf(Date);
    expect(event.instance).toMatchObject({
      role: DidExchangeRole.Requester,
      state: DidExchangeState.Completed,
    });
  });
});
