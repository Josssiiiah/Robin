import { ActionFunctionArgs, redirect } from "@remix-run/node"; // or cloudflare/deno
import { Form, Link } from "@remix-run/react";
import { createSupabaseServerClient } from "./supabase";
import { commitSession, getSession } from "~/sessions.server";

// -----------------------------------------------------------------------------
// Login FUNCTION
// -----------------------------------------------------------------------------
export default function Login() {

  return (
    <div className="flex h-full w-full flex-col items-center">
      <h1 className="pt-[200px] text-3xl">
        <strong>Welcome to Remix - LOGIN PAGE</strong>
      </h1>
      {/* send create account inputs to action  */}
      <Form method="post">
        <input type="email" name="email" placeholder="username" />
        <input type="password" name="password" placeholder="password" />
        <button type="submit">LOGIN</button>
      </Form>
      <Link to="/create-account">CREATE ACCOUNT</Link>
    </div>
  );
}

// -----------------------------------------------------------------------------
// ACTION FUNCTION
// -----------------------------------------------------------------------------
export async function action({ request }: ActionFunctionArgs) {
  const supabase = await createSupabaseServerClient({ request });
  const session = await getSession(request.headers.get("Cookie"));

  // handle form data 
  const formData = await request.formData();
  const { email, password } = Object.fromEntries(formData.entries());

  // call supabase sign in function
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email as string,
    password: password as string,
  });

  // if error when signing in 
  if (error) {
    console.log("error", error);
    return error.message;
  }

  // if valid user, set session and redirect to journal
  if (data?.user) {
    console.log("user", data.user);
    session.set("userId", data.user.id);

    return redirect("/journal", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }
  
  else {
    console.log("something went wrong");
    return null;  
  }
}
