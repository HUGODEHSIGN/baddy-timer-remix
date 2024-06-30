import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as admin from '~/db/schemas/admin.server';
import * as user from '~/db/schemas/user.server';

const { Pool } = pg;

const connectionString =
  process.env.NODE_ENV === 'production'
    ? process.env.DATABASE_URL
    : process.env.DATABASE_URL_DEV;

const pool = new Pool({
  connectionString: connectionString,
});

export const db = drizzle(pool, { schema: { ...user, ...admin } });
