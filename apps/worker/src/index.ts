import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
import { eq, sql } from 'drizzle-orm';
import { db, evidenceSnapshots, incidents, outbox } from '@reanimate/db';

const redisUrl = process.env.REDIS_URL;
const prometheusUrl = process.env.PROMETHEUS_URL;
if (!redisUrl || !prometheusUrl) throw new Error('REDIS_URL and PROMETHEUS_URL are required');

const connection = new IORedis(redisUrl, { maxRetriesPerRequest: null });
const queue = new Queue('incident-evidence', { connection });

// Periodically lease a bounded batch. An expired lease is retried; stable BullMQ job IDs prevent parallel duplicates.
async function dispatchOutbox() {
  const rows = await db.execute(sql`
    UPDATE outbox SET claimed_at = NOW(), attempts = attempts + 1
    WHERE id IN (
      SELECT id FROM outbox
      WHERE published_at IS NULL AND (claimed_at IS NULL OR claimed_at < NOW() - INTERVAL '2 minutes')
      ORDER BY created_at ASC LIMIT 10 FOR UPDATE SKIP LOCKED
    )
    RETURNING id, event_type, entity_id
  `) as unknown as Array<{ id: string; event_type: string; entity_id: string }>;
  for (const row of rows) {
    if (row.event_type !== 'incident.detected') continue;
    await queue.add('collect-evidence', { incidentId: row.entity_id }, {
      jobId: String(row.entity_id), attempts: 3,
      backoff: { type: 'exponential', delay: 2000 }, removeOnComplete: 1000
    });
    await db.update(outbox).set({ publishedAt: new Date() }).where(eq(outbox.id, String(row.id)));
  }
}

const worker = new Worker('incident-evidence', async (job) => {
  const incidentId = String(job.data.incidentId);
  const [incident] = await db.select().from(incidents).where(eq(incidents.id, incidentId)).limit(1);
  if (!incident) throw new Error('Incident not found');
  const service = incident.service;
  if (!/^[a-zA-Z0-9_-]{1,64}$/.test(service)) throw new Error('Invalid service label');
  const query = `sum(rate(checkout_requests_total{service=${JSON.stringify(service)},status_code=~"5.."}[1m]))`;
  const start = Math.floor(incident.startedAt.getTime() / 1000) - 300;
  const end = Math.floor(Date.now() / 1000);
  const url = new URL('/api/v1/query_range', prometheusUrl);
  url.searchParams.set('query', query);
  url.searchParams.set('start', String(start));
  url.searchParams.set('end', String(Math.min(end, start + 1200)));
  url.searchParams.set('step', '15s');
  const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
  if (!response.ok) throw new Error(`Prometheus query failed with HTTP ${response.status}`);
  const payload: unknown = await response.json();
  // Initial slice stores actual query response; M2 will normalize, redact, bound and cite evidence by source id.
  await db.insert(evidenceSnapshots).values({ incidentId, jobKey: `${incidentId}:prometheus:checkout-5xx`, source: 'prometheus', query, payload }).onConflictDoNothing({ target: evidenceSnapshots.jobKey });
  console.info(JSON.stringify({ event: 'evidence_collected', incidentId, source: 'prometheus' }));
}, { connection, concurrency: 2 });

worker.on('failed', (job, err) => console.error(JSON.stringify({ event: 'job_failed', jobId: job?.id, error: err.message })));

const interval = setInterval(() => { dispatchOutbox().catch((err) => console.error('outbox error:', err)); }, 2000);
await dispatchOutbox();

process.on('SIGTERM', async () => {
  clearInterval(interval);
  await worker.close();
  await queue.close();
  await connection.quit();
  process.exit(0);
});
