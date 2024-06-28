import { defineConfig } from 'drizzle-kit';

const connectionString =
  process.env.NODE_ENV === 'production'
    ? process.env.DATABASE_URL!
    : process.env.DATABASE_URL_DEV!;

export default defineConfig({
  schema: './app/db/schemas/*',
  dialect: 'postgresql',
  dbCredentials: {
    url: connectionString!,
  },
  verbose: true,
  strict: true,
});
