import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { ConfigurableModuleClass } from './tsa.module-definition.js';
import { TSAService } from './tsa.service.js';

@Module({
  imports: [HttpModule],
  providers: [TSAService],
  exports: [TSAService],
})
export class TSAModule extends ConfigurableModuleClass {}
