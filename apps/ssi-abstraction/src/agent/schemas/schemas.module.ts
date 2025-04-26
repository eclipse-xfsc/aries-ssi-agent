import { Module } from '@nestjs/common';

import { AgentModule } from '../agent.module.js';

import { SchemasController } from './schemas.controller.js';
import { SchemasService } from './schemas.service.js';

@Module({
  imports: [AgentModule],
  providers: [SchemasService],
  controllers: [SchemasController],
})
export class SchemasModule {}
