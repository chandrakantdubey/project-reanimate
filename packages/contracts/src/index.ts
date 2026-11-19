import { z } from 'zod';

export const AlertStatusSchema = z.enum(['firing', 'resolved']);
export const SeveritySchema = z.enum(['critical', 'warning', 'info']);

export const AlertmanagerAlertSchema = z.object({
  status: AlertStatusSchema,
  fingerprint: z.string().regex(/^[a-zA-Z0-9]{1,128}$/),
  startsAt: z.iso.datetime({ offset: true }),
  endsAt: z.iso.datetime({ offset: true }).optional(),
  labels: z.object({
    alertname: z.string().min(1).max(120),
    service: z.string().regex(/^[a-zA-Z0-9_-]{1,64}$/),
    environment: z.string().regex(/^[a-zA-Z0-9_-]{1,64}$/),
    severity: SeveritySchema.optional()
  }).catchall(z.string().max(256)),
  annotations: z.record(z.string(), z.string().max(2048)).optional(),
  generatorURL: z.string().url().optional()
});

export const AlertmanagerWebhookSchema = z.object({
  receiver: z.string().max(120).optional(),
  status: AlertStatusSchema,
  alerts: z.array(AlertmanagerAlertSchema).min(1).max(100)
});

export const IncidentResponseSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  service: z.string(),
  environment: z.string(),
  severity: SeveritySchema,
  status: AlertStatusSchema,
  startedAt: z.string(),
  createdAt: z.string()
});

export type AlertmanagerAlert = z.infer<typeof AlertmanagerAlertSchema>;
export type AlertmanagerWebhook = z.infer<typeof AlertmanagerWebhookSchema>;
export type IncidentResponse = z.infer<typeof IncidentResponseSchema>;
