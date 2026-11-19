import { createHash } from 'node:crypto';

export type AlertStatus = 'firing' | 'resolved';

/** Alertmanager fingerprint is scoped to an episode; startsAt separates recurring incidents. */
export function episodeKey(environment: string, fingerprint: string, startsAt: string): string {
  const start = new Date(startsAt);
  if (Number.isNaN(start.valueOf())) throw new Error('Invalid alert startsAt');
  if (!/^[a-zA-Z0-9_-]{1,64}$/.test(environment)) throw new Error('Invalid environment');
  if (!/^[a-zA-Z0-9]+$/.test(fingerprint)) throw new Error('Invalid fingerprint');
  return createHash('sha256')
    .update(JSON.stringify([environment, fingerprint, start.toISOString()]))
    .digest('hex');
}

/** A repeated Alertmanager delivery must not create a second event. */
export function deliveryKey(incidentKey: string, status: AlertStatus, endsAt?: string): string {
  const end = endsAt ? new Date(endsAt) : null;
  if (end && Number.isNaN(end.valueOf())) throw new Error('Invalid alert endsAt');
  return createHash('sha256')
    .update(JSON.stringify([incidentKey, status, end?.toISOString() ?? null]))
    .digest('hex');
}

/** Once an episode is resolved, a late `firing` retry cannot reopen it. */
export function nextIncidentStatus(current: AlertStatus, incoming: AlertStatus): AlertStatus {
  return current === 'resolved' ? 'resolved' : incoming;
}
