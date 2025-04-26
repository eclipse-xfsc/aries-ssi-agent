import { ClientsModule } from '@nestjs/microservices';
import { Test } from '@nestjs/testing';

import { NATS_CLIENT } from '../../common/constants.js';
import { ConnectionsController } from '../connections.controller.js';
import { ConnectionsModule } from '../connections.module.js';
import { ConnectionsService } from '../connections.service.js';

describe('ConnectionsModule', () => {
  let connectionsController: ConnectionsController;
  let connectionsService: ConnectionsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ClientsModule.registerAsync({
          isGlobal: true,
          clients: [{ name: NATS_CLIENT, useFactory: () => ({}) }],
        }),
        ConnectionsModule,
      ],
    }).compile();

    connectionsController = moduleRef.get<ConnectionsController>(
      ConnectionsController,
    );
    connectionsService = moduleRef.get<ConnectionsService>(ConnectionsService);
  });

  it('should be defined', () => {
    expect(connectionsController).toBeDefined();
    expect(connectionsController).toBeInstanceOf(ConnectionsController);

    expect(connectionsService).toBeDefined();
    expect(connectionsService).toBeInstanceOf(ConnectionsService);
  });
});
