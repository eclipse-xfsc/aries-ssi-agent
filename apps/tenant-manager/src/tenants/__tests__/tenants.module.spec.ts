import { ClientsModule } from '@nestjs/microservices';
import { Test } from '@nestjs/testing';

import { NATS_CLIENT } from '../../common/constants.js';
import { TenantsController } from '../tenants.controller.js';
import { TenantsModule } from '../tenants.module.js';
import { TenantsService } from '../tenants.service.js';

describe('TenantsModule', () => {
  let tenantsController: TenantsController;
  let tenantsService: TenantsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ClientsModule.registerAsync({
          isGlobal: true,
          clients: [{ name: NATS_CLIENT, useFactory: () => ({}) }],
        }),
        TenantsModule,
      ],
    }).compile();

    tenantsController = moduleRef.get<TenantsController>(TenantsController);
    tenantsService = moduleRef.get<TenantsService>(TenantsService);
  });

  it('should be defined', () => {
    expect(tenantsController).toBeDefined();
    expect(tenantsController).toBeInstanceOf(TenantsController);

    expect(tenantsService).toBeDefined();
    expect(tenantsService).toBeInstanceOf(TenantsService);
  });
});
