import { randomBytes } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const envPath = resolve(root, '.env');
const localDir = resolve(root, '.local');
mkdirSync(localDir, { recursive: true });

if (!existsSync(envPath)) {
  const password = randomBytes(18).toString('hex');
  const token = randomBytes(32).toString('hex');
  const env = [
    '# Local-only generated secrets. Never commit this file.',
    `POSTGRES_PASSWORD=${password}`,
    `DATABASE_URL=postgres://reanimate:${password}@localhost:5432/reanimate`,
    'REDIS_URL=redis://localhost:6379',
    `DEV_ALERT_WEBHOOK_TOKEN=${token}`,
    'API_PORT=4000',
    'API_HOST=0.0.0.0',
    'CHECKOUT_PORT=4300',
    'CHECKOUT_HOST=0.0.0.0',
    'PAYMENT_PORT=4301',
    'PAYMENT_URL=http://localhost:4301/payment',
    'PAYMENT_TIMEOUT_MS=800',
    'PAYMENT_LATENCY_MS=300',
    'PROMETHEUS_URL=http://localhost:9090',
    'OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318'
  ].join('\n') + '\n';
  writeFileSync(envPath, env, { mode: 0o600, flag: 'wx' });
  console.log('Created .env with random local-only credentials.');
} else {
  console.log('Preserving existing .env.');
}
const text = readFileSync(envPath, 'utf8');
const match = text.match(/^DEV_ALERT_WEBHOOK_TOKEN=(.+)$/m);
if (!match || !match[1] || match[1] === 'change_me') throw new Error('Set DEV_ALERT_WEBHOOK_TOKEN in .env first');
writeFileSync(resolve(localDir, 'webhook-token'), match[1].trim(), { mode: 0o600 });
console.log('Prepared Docker Alertmanager token at .local/webhook-token.');
console.log('WARNING: API_HOST / CHECKOUT_HOST bind all network interfaces for host-Docker access. Use isolated local development only.');
