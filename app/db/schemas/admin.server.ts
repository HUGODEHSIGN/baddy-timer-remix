import { createId } from '@paralleldrive/cuid2';
import { pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const admin = pgTable('admin', {
  id: varchar('id', { length: 128 })
    .$defaultFn(() => createId())
    .primaryKey(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  password: varchar('password', { length: 72 }).notNull(),
  locationId: varchar('location_id', { length: 128 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type SelectAdmin = typeof admin.$inferSelect;
export type InsertAdmin = typeof admin.$inferInsert;
