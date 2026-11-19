import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';

const endpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT ?? 'http://localhost:4318';
const sdk = new NodeSDK({
  serviceName: 'checkout',
  traceExporter: new OTLPTraceExporter({ url: `${endpoint}/v1/traces` }),
  instrumentations: [getNodeAutoInstrumentations()]
});
sdk.start();
process.on('SIGTERM', () => { sdk.shutdown().catch(console.error); });
