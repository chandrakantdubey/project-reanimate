import { pgTable, uuid, text, timestamp, jsonb, integer, uniqueIndex, index } from 'drizzle-orm/pg-core';

export const incidents = pgTable('incidents', {
  id: uuid('id').primaryKey().defaultRandom(),
  episodeKey: text('episode_key').notNull(),
  fingerprint: text('fingerprint').notNull(),
  alertName: text('alert_name').notNull(),
  service: text('service').notNull(),
  environment: text('environment').notNull(),
  severity: text('severity').notNull().default('warning'),
  status: text('status').notNull().default('firing'),
  startedAt: timestamp('started_at', { withTimezone: true }).notNull(),
  resolvedAt: timestamp('resolved_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
}, (t) => [
  uniqueIndex('incidents_episode_key_uq').on(t.episodeKey),
  index('incidents_created_at_idx').on(t.createdAt)
]);

export const alertEvents = pgTable('alert_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  incidentId: uuid('incident_id').notNull().references(() => incidents.id),
  deliveryKey: text('delivery_key').notNull(),
  status: text('status').notNull(),
  payload: jsonb('payload').notNull(),
  receivedAt: timestamp('received_at', { withTimezone: true }).notNull().defaultNow()
}, (t) => [uniqueIndex('alert_events_delivery_key_uq').on(t.deliveryKey)]);

export const outbox = pgTable('outbox', {
  id: uuid('id').primaryKey().defaultRandom(),
  eventType: text('event_type').notNull(),
  entityId: uuid('entity_id').notNull(),
  payload: jsonb('payload').notNull(),
  attempts: integer('attempts').notNull().default(0),
  claimedAt: timestamp('claimed_at', { withTimezone: true }),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
}, (t) => [index('outbox_pending_idx').on(t.publishedAt, t.createdAt)]);

export const evidenceSnapshots = pgTable('evidence_snapshots', {
  id: uuid('id').primaryKey().defaultRandom(),
  incidentId: uuid('incident_id').notNull().references(() => incidents.id),
  source: text('source').notNull(),
  jobKey: text('job_key').notNull(),
  query: text('query').notNull(),
  payload: jsonb('payload').notNull(),
  capturedAt: timestamp('captured_at', { withTimezone: true }).notNull().defaultNow()
}, (t) => [index('evidence_incident_idx').on(t.incidentId), uniqueIndex('evidence_job_key_uq').on(t.jobKey)]);
