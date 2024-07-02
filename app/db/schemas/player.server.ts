import { boolean, pgTable, text } from 'drizzle-orm/pg-core';
import { userTable } from '~/db/schemas/user.server';

export const playerTable = pgTable('player', {
  id: text('id').primaryKey(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  primary: boolean('primary').notNull().default(false),
  userId: text('user_id')
    .notNull()
    .references(() => userTable.id, { onDelete: 'cascade' }),
});

export type SelectPlayer = typeof playerTable.$inferSelect;
export type InsertPlayer = typeof playerTable.$inferInsert;
