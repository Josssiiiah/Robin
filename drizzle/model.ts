import { db } from "drizzle/db";
import { waitlist } from "drizzle/schema";

export async function addToWaitList(email: string) {
  await db.insert(waitlist).values({
    email: email,
  });
}
