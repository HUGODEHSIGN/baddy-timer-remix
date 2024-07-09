import { pgTable, text } from 'drizzle-orm/pg-core';

export const locationTable = pgTable('location', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
});

export type SelectLocation = typeof locationTable.$inferSelect;
export type InsertLocation = typeof locationTable.$inferInsert;
