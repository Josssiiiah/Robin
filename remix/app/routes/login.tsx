import { ActionFunctionArgs, redirect } from "@remix-run/node"; // or cloudflare/deno
import { Form, Link, useLoaderData, useNavigate } from "@remix-run/react";
import {
  createBrowserClient,
  createServerClient,
  parse,
  serialize,
} from "@supabase/ssr";

// add the loader
export function loader() {
  return {
    env: {
      SUPABASE_URL: process.env.SUPABASE_URL!,
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
    },
  };
}

export default function Index() {

  return (
    <div className="flex h-full w-full flex-col items-center">
      <h1 className="pt-[200px] text-3xl">
        <strong>Welcome to Remix - LOGIN PAGE</strong>
      </h1>

      <Form method="post">
        <input type="email" name="email" placeholder="username" />
        <input type="password" name="password" placeholder="password" />
        <button type="submit">
          LOGIN
        </button>
      </Form>
      <Link to="/create-account">CREATE ACCOUNT</Link>
    </div>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const cookies = parse(request.headers.get("Cookie") ?? "");
  const headers = new Headers();

  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(key) {
          return cookies[key];
        },
        set(key, value, options) {
          headers.append("Set-Cookie", serialize(key, value, options));
        },
        remove(key, options) {
          headers.append("Set-Cookie", serialize(key, "", options));
        },
      },
    },
  );

  const formData = await request.formData();
  const dataFields = Object.fromEntries(formData.entries());
  const { data, error } = await supabase.auth.signInWithPassword({
    email: dataFields.email as string,
    password: dataFields.password as string,
  });

  console.log("action function");
  return redirect("/login");
}
