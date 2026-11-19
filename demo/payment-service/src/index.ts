import Fastify from 'fastify';
const app = Fastify({ logger: true });
app.get('/healthz', async () => ({ ok: true }));
app.get('/payment', async () => {
  const delay = Number(process.env.PAYMENT_LATENCY_MS ?? 300);
  if (!Number.isInteger(delay) || delay < 0 || delay > 5000) throw new Error('Invalid payment latency');
  await new Promise(resolve => setTimeout(resolve, delay));
  return { authorized: true, provider: 'synthetic-payment-service' };
});
await app.listen({ port: Number(process.env.PAYMENT_PORT ?? 4301), host: '127.0.0.1' });
