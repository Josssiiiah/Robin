import { ActionFunctionArgs, redirect, type MetaFunction } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { createBrowserClient, createServerClient, parse, serialize } from "@supabase/ssr";
import React from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

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
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Welcome to Remix - CREATE ACCOUNT PAGE</h1>
      <Form method="post">
        <input type="email" name="email" placeholder="username" />
        <input type="password" name="password" placeholder="password" />
        <button type="submit">
          CREATE ACCOUNT
        </button>
      </Form>
      <Link to="/login">CANCEL</Link>
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
  const { email, password } = Object.fromEntries(formData.entries());
  const { data, error } = await supabase.auth.signUp({
    email: email as string,
    password: password as string,
  });

  if (error) {
    console.log(error);
    return null;
  }

  if (data.session) {
    // Redirect to a protected route or the main page
    return redirect("/login", );
  }

  console.log("data", data.session);
  return null
}