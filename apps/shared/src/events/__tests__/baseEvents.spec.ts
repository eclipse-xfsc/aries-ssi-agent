import { BaseEvent } from '../baseEvents.js';

describe('Base Events', () => {
  it('should return module', () => {
    jest.requireActual('../baseEvents');
  });

  it('should create a new base event', () => {
    const baseEvent = new BaseEvent({ some: 'data' }, 'tenantId');

    expect(typeof baseEvent.id).toStrictEqual('string');
    expect(baseEvent.type).toStrictEqual('BaseEvent');
    expect(baseEvent.timestamp).toBeInstanceOf(Date);
    expect(baseEvent.data).toMatchObject({ some: 'data' });
  });
});
