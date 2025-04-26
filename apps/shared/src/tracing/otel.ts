import { Logger } from '@nestjs/common';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { AsyncLocalStorageContextManager } from '@opentelemetry/context-async-hooks';
import {
  CompositePropagator,
  W3CBaggagePropagator,
  W3CTraceContextPropagator,
} from '@opentelemetry/core';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { B3InjectEncoding, B3Propagator } from '@opentelemetry/propagator-b3';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { NoopSpanProcessor } from '@opentelemetry/sdk-trace-base';
import process from 'process';

export const initOpenTelemetry = (serviceName: string) => {
  const prometheusExporter = new PrometheusExporter({
    preventServerStart: true,
  });

  const otelSDK = new NodeSDK({
    serviceName,
    metricReader: prometheusExporter,
    spanProcessors: [new NoopSpanProcessor()],
    contextManager: new AsyncLocalStorageContextManager(),
    instrumentations: [
      getNodeAutoInstrumentations({
        '@opentelemetry/instrumentation-fs': { enabled: false },
      }),
    ],
    textMapPropagator: new CompositePropagator({
      propagators: [
        new W3CTraceContextPropagator(),
        new W3CBaggagePropagator(),
        new B3Propagator(),
        new B3Propagator({
          injectEncoding: B3InjectEncoding.MULTI_HEADER,
        }),
      ],
    }),
  });

  process.on('SIGTERM', async () => {
    try {
      await otelSDK.shutdown();
      Logger.log('OpenTelemetry SDK shut down successfully');
    } catch (error) {
      Logger.log('Error shutting down OpenTelemetry SDK', error);
    } finally {
      process.exit(0);
    }
  });

  return { sdk: otelSDK, prometheusExporter };
};
