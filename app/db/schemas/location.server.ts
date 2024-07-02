import { pgTable, text } from 'drizzle-orm/pg-core';

export const location = pgTable('location', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  address: text('address').notNull(),
});
