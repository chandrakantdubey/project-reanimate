import { timingSafeEqual } from 'node:crypto';
import Fastify from 'fastify';
import { desc, eq, sql } from 'drizzle-orm';
import { AlertmanagerWebhookSchema } from '@reanimate/contracts';
import { alertEvents, db, evidenceSnapshots, incidents, outbox } from '@reanimate/db';
import { deliveryKey, episodeKey, nextIncidentStatus } from '@reanimate/incident-engine';

const app = Fastify({ logger: true, bodyLimit: 131072 });

function authorized(header: string | undefined): boolean {
  const expected = process.env.DEV_ALERT_WEBHOOK_TOKEN;
  if (!expected || expected === 'change_me') return false;
  const provided = header?.startsWith('Bearer ') ? header.slice(7) : '';
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

app.get('/healthz', async () => ({ ok: true, service: 'reanimate-api' }));
app.get('/readyz', async (_request, reply) => {
  try {
    await db.execute(sql`select 1`);
    return { ok: true };
  } catch {
    return reply.code(503).send({ ok: false });
  }
});

// Starter read-only API for local demo. Add OIDC and project-scoped authorization before exposing live data.
app.get('/v1/incidents', async () => {
  const rows = await db.select().from(incidents).orderBy(desc(incidents.createdAt)).limit(100);
  return { items: rows.map((row) => ({
    id: row.id,
    title: row.alertName,
    service: row.service,
    environment: row.environment,
    severity: row.severity,
    status: row.status,
    startedAt: row.startedAt.toISOString(),
    createdAt: row.createdAt.toISOString()
  })) };
});

app.get<{ Params: { id: string } }>('/v1/incidents/:id', async (request, reply) => {
  if (!/^[a-f0-9-]{36}$/i.test(request.params.id)) return reply.code(400).send({ error: 'Invalid incident ID' });
  const [incident] = await db.select().from(incidents).where(eq(incidents.id, request.params.id)).limit(1);
  if (!incident) return reply.code(404).send({ error: 'Incident not found' });
  const evidence = await db.select({ id: evidenceSnapshots.id, source: evidenceSnapshots.source,
    query: evidenceSnapshots.query, capturedAt: evidenceSnapshots.capturedAt })
    .from(evidenceSnapshots).where(eq(evidenceSnapshots.incidentId, incident.id)).limit(50);
  return {
    incident: { id: incident.id, title: incident.alertName, service: incident.service,
      environment: incident.environment, severity: incident.severity, status: incident.status,
      startedAt: incident.startedAt.toISOString(), createdAt: incident.createdAt.toISOString(),
      resolvedAt: incident.resolvedAt?.toISOString() ?? null },
    evidence: evidence.map((item) => ({ ...item, capturedAt: item.capturedAt.toISOString() }))
  };
});

app.post('/internal/alerts', async (request, reply) => {
  if (!authorized(request.headers.authorization)) return reply.code(401).send({ error: 'Unauthorized' });
  const parsed = AlertmanagerWebhookSchema.safeParse(request.body);
  if (!parsed.success) return reply.code(400).send({ error: 'Invalid Alertmanager payload' });

  try {
    for (const alert of parsed.data.alerts) {
      const key = episodeKey(alert.labels.environment, alert.fingerprint, alert.startsAt);
      const eventKey = deliveryKey(key, alert.status, alert.endsAt);
      await db.transaction(async (tx) => {
        const [newIncident] = await tx.insert(incidents).values({
          episodeKey: key,
          fingerprint: alert.fingerprint,
          alertName: alert.labels.alertname,
          service: alert.labels.service,
          environment: alert.labels.environment,
          severity: alert.labels.severity ?? 'warning',
          startedAt: new Date(alert.startsAt),
          status: alert.status,
          resolvedAt: alert.status === 'resolved' ? new Date(alert.endsAt ?? alert.startsAt) : null
        }).onConflictDoNothing({ target: incidents.episodeKey }).returning();

        const incident = newIncident ?? (await tx.select().from(incidents)
          .where(eq(incidents.episodeKey, key)).limit(1))[0];
        if (!incident) throw new Error('Failed to resolve incident episode');

        if (alert.status === 'resolved') {
          const status = nextIncidentStatus(incident.status as 'firing' | 'resolved', 'resolved');
          await tx.update(incidents).set({ status, resolvedAt: new Date(alert.endsAt ?? alert.startsAt), updatedAt: new Date() })
            .where(eq(incidents.id, incident.id));
        }
        const [newEvent] = await tx.insert(alertEvents).values({
          incidentId: incident.id, deliveryKey: eventKey, status: alert.status,
          payload: { generatorURL: alert.generatorURL, annotations: alert.annotations, labels: alert.labels }
        }).onConflictDoNothing({ target: alertEvents.deliveryKey }).returning({ id: alertEvents.id });

        if (newIncident && newEvent && alert.status === 'firing') {
          await tx.insert(outbox).values({ eventType: 'incident.detected', entityId: incident.id, payload: { incidentId: incident.id } });
        }
      });
    }
    return reply.code(202).send({ accepted: parsed.data.alerts.length });
  } catch (error) {
    request.log.error({ err: error }, 'Failed to persist Alertmanager webhook');
    return reply.code(503).send({ error: 'Ingestion temporarily unavailable' });
  }
});

const port = Number(process.env.API_PORT ?? 4000);
await app.listen({ port, host: process.env.API_HOST ?? '127.0.0.1' });
