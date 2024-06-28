import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

const connectionString =
  process.env.NODE_ENV === 'production'
    ? process.env.DATABASE_URL
    : process.env.DATABASE_URL_DEV;

const pool = new Pool({
  connectionString: connectionString,
});

export const db = drizzle(pool);
