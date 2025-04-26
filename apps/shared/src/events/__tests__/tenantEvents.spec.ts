import { TenantRecord } from '@credo-ts/tenants';

import { EventTenantsCreate } from '../tenantEvents.js';

describe('Tenant Events', () => {
  it('should return module', () => {
    jest.requireActual('../tenantEvents');
  });

  it('should create a create tenant event', () => {
    const tenantRecord = new TenantRecord({
      config: {
        label: 'my-label',
        walletConfig: { id: 'some-id', key: 'some-key' },
      },
    });
    const event = new EventTenantsCreate(tenantRecord, undefined);

    expect(typeof event.id).toStrictEqual('string');
    expect(event.type).toStrictEqual('EventTenantsCreate');
    expect(event.timestamp).toBeInstanceOf(Date);
    expect(event.instance).toMatchObject(tenantRecord);
  });
});
