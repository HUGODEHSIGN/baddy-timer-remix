import { boolean, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { locationTable } from '~/db/schemas/location.server';

export const userTable = pgTable('user', {
  id: text('id').primaryKey(),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  admin: boolean('admin').notNull().default(false),
  playerLocationId: text('player_location_id').references(
    () => locationTable.id,
    {
      onDelete: 'set null',
    }
  ),
});

export const sessionTable = pgTable('session', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => userTable.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull(),
});

export type SelectUser = typeof userTable.$inferSelect;
export type InsertUser = typeof userTable.$inferInsert;
