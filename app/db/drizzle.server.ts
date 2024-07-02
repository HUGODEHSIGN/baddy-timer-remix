import { drizzle } from 'drizzle-orm/node-postgres';
import { pool } from '~/db/index.server';
import { playerTable } from '~/db/schemas/player.server';
import { userTable } from '~/db/schemas/user.server';

export const db = drizzle(pool, { schema: { ...userTable, ...playerTable } });
