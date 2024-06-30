import { drizzle } from 'drizzle-orm/node-postgres';
import { pool } from '~/db/index.server';
import { user } from '~/db/schemas/user.server';

export const db = drizzle(pool, { schema: { ...user } });
