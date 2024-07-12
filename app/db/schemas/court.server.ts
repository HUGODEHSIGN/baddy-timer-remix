import { pgTable, text } from 'drizzle-orm/pg-core';
import { locationTable } from '~/db/schemas/location.server';

export const courtTable = pgTable('court', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  locationId: text('location_id')
    .notNull()
    .references(() => locationTable.id, {
      onDelete: 'cascade',
    }),
});

export type SelectCourt = typeof courtTable.$inferSelect;
export type InsertCourt = typeof courtTable.$inferInsert;
