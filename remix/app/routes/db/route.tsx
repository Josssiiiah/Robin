import { createClient } from "@supabase/supabase-js";
import { useLoaderData } from "@remix-run/react";

export async function loader() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    throw new Error("Please provide a SUPABASE_URL and SUPABASE_ANON_KEY");
  }
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );

  const { data } = await supabase.from("test").select();

  return {
    data,
  };
}

export default function db() {
  let data = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>DB</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
