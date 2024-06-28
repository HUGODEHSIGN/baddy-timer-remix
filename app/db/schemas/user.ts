import { createId } from '@paralleldrive/cuid2';
import { pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const user = pgTable('user', {
  id: varchar('id', { length: 128 })
    .$defaultFn(() => createId())
    .primaryKey(),
  name: text('name').notNull(),
  locationId: varchar('location_id', { length: 128 }).notNull(),
  phone: varchar('phone', { length: 16 }).unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type SelectUser = typeof user.$inferSelect;
export type InsertUser = typeof user.$inferInsert;

export const zSelectUser = createSelectSchema(user, {
  id: (schema) => schema.id.cuid2('Not a valid id'),
  name: (schema) =>
    schema.name.min(2, 'Name is too short').max(20, 'Name is too long'),
  locationId: (schema) => schema.id.cuid2('Not a valid location id'),
  phone: (schema) =>
    schema.phone.regex(/^\+[1-9]\d{1,14}$/, 'Invalid Phone Number'),
});

export const zInsertUser = createInsertSchema(user, {
  name: (schema) =>
    schema.name.min(2, 'Name is too short').max(20, 'Name is too long'),
  locationId: (schema) => schema.id.cuid2('Not a valid location id'),
  phone: (schema) =>
    schema.phone.regex(/^\+[1-9]\d{1,14}$/, 'Invalid Phone Number'),
});
