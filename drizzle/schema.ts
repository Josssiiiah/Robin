import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

// For more information about drizzle postgres colum types: https://orm.drizzle.team/docs/column-types/pg
export const waitlist = pgTable("waitlist", {
  id: serial("id").primaryKey(),
  email: text("email"),
  created: timestamp("created", { withTimezone: true }).defaultNow(),
});
