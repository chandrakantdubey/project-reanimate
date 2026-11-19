import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
export * from './schema';

const url = process.env.DATABASE_URL;
if (!url) throw new Error('DATABASE_URL environment variable is required');

export const sqlClient = postgres(url, { max: 10, idle_timeout: 20, connect_timeout: 5 });
export const db = drizzle({ client: sqlClient });
