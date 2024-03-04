import type { Config as DrizzleConfig } from "drizzle-kit";


if (!process.env.DATABASE_URL) {
  throw new Error("Please provide a DATABASE_URL");
}

export default {
  schema: "./drizzle/schema.ts",
  out: "./drizzle/migrations",
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL,
  }
} satisfies DrizzleConfig;