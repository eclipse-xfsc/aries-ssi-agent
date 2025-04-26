import { ConfigurableModuleBuilder } from '@nestjs/common';

export interface HealthModuleOptions {
  nats?: {
    monitoringUrl: string;
  };
}

export const {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  OPTIONS_TYPE,
  ASYNC_OPTIONS_TYPE,
} = new ConfigurableModuleBuilder<HealthModuleOptions>().build();
