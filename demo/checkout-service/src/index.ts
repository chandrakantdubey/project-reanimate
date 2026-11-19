// Initialize tracing before importing Fastify/undici so auto-instrumentation can patch modules.
import './telemetry';
await import('./server');
