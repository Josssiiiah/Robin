import type { Config as DrizzleConfig } from "drizzle-kit";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw Error(
    "YOU PROBABLY FORGOT TO SET THE ENV VARS TO CONNECT TO THE DATABASE"
  );
}

export default {
  schema: "./drizzle/schema.ts",
  out: "./drizzle/migrations",
  driver: "pg",
  dbCredentials: {
    connectionString: connectionString,
  },
} satisfies DrizzleConfig;
