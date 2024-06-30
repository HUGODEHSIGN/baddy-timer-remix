import pg from 'pg';

const { Pool } = pg;

const connectionString =
  process.env.NODE_ENV === 'production'
    ? process.env.DATABASE_URL
    : process.env.DATABASE_URL_DEV;

export const pool = new Pool({
  connectionString: connectionString,
});
