import { boolean, pgTable, text } from 'drizzle-orm/pg-core';
import { locationTable } from '~/db/schemas/location.server';
import { userTable } from '~/db/schemas/user.server';

export const adminTable = pgTable('admin', {
  userId: text('user_id')
    .notNull()
    .references(() => userTable.id, { onDelete: 'cascade' }),
  locationId: text('location_id')
    .notNull()
    .references(() => locationTable.id, { onDelete: 'cascade' }),
  owner: boolean('owner').notNull().default(false),
  verified: boolean('verified').notNull().default(false),
});

export type SelectAdmin = typeof adminTable.$inferSelect;
export type InsertAdmin = typeof adminTable.$inferInsert;
