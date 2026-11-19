import Fastify from 'fastify';
import { Counter, Histogram, Registry, collectDefaultMetrics } from 'prom-client';

const app = Fastify({ logger: true });
const registry = new Registry();
registry.setDefaultLabels({ service: 'checkout' });
collectDefaultMetrics({ register: registry });
const requests = new Counter({
  name: 'checkout_requests_total', help: 'Checkout requests grouped by HTTP status code',
  labelNames: ['service', 'status_code'] as const, registers: [registry]
});
const latency = new Histogram({
  name: 'checkout_request_duration_seconds', help: 'Checkout request latency',
  labelNames: ['service'] as const, registers: [registry], buckets: [0.05, 0.1, 0.2, 0.5, 1, 2, 5]
});

app.get('/healthz', async () => ({ ok: true, timeoutMs: Number(process.env.PAYMENT_TIMEOUT_MS ?? 800) }));
app.get('/metrics', async (_request, reply) => {
  reply.header('Content-Type', registry.contentType);
  return registry.metrics();
});
app.get('/checkout', async (_request, reply) => {
  const end = latency.startTimer({ service: 'checkout' });
  let status = 200;
  try {
    const timeout = Number(process.env.PAYMENT_TIMEOUT_MS ?? 800);
    if (!Number.isInteger(timeout) || timeout < 20 || timeout > 10_000) throw new Error('Invalid timeout configuration');
    const response = await fetch(process.env.PAYMENT_URL ?? 'http://localhost:4301/payment', {
      signal: AbortSignal.timeout(timeout)
    });
    if (!response.ok) throw new Error(`Payment returned HTTP ${response.status}`);
    return { ok: true, payment: await response.json() };
  } catch (error) {
    status = 503;
    return reply.code(503).send({ ok: false, error: 'Downstream payment request failed', category: 'payment_timeout_or_failure' });
  } finally {
    end();
    requests.inc({ service: 'checkout', status_code: String(status) });
  }
});

await app.listen({ port: Number(process.env.CHECKOUT_PORT ?? 4300), host: process.env.CHECKOUT_HOST ?? '127.0.0.1' });
