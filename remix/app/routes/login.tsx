import { redirect } from "@remix-run/node"; // or cloudflare/deno
import { Form, Link, useLoaderData, useNavigate } from "@remix-run/react";
import { createBrowserClient } from "@supabase/ssr";
import React from "react";

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
  const { env } = useLoaderData<typeof loader>();
  const inputForm = React.useRef<HTMLFormElement>();
  const navigate = useNavigate();

  const doLogin = async () => {
    const supabase = createBrowserClient(
      env.SUPABASE_URL,
      env.SUPABASE_ANON_KEY,
    );
    const formData = new FormData(inputForm.current);
    const dataFields = Object.fromEntries(formData.entries());
    const { data, error } = await supabase.auth.signInWithPassword({
      email: dataFields.email as string,
      password: dataFields.password as string,
    });

    if (error) {
      console.log(error);
      return;
    }

    if (data.session) {
      console.log(data.session);
      navigate("/journal");
    }
  };

  return (
    <div className="flex h-full w-full flex-col items-center">
      <h1 className="pt-[200px] text-3xl">
        <strong>Welcome to Remix - LOGIN PAGE</strong>
      </h1>

      <Form method="post">
        <input type="email" name="email" placeholder="username" />
        <input type="password" name="password" placeholder="password" />
        <button type="button" onClick={() => doLogin()}>
          LOGIN
        </button>
      </Form>
      <Link to="/create-account">CREATE ACCOUNT</Link>
    </div>
  );
}


export function action() {
    console.log("action function");
    return redirect("/journal");
  }
  