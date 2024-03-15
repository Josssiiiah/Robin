import { ActionFunctionArgs, redirect } from "@remix-run/node"; // or cloudflare/deno
import { Form, Link, useLoaderData, useNavigate } from "@remix-run/react";
import {
  createServerClient,
  parse,
  serialize,
} from "@supabase/ssr";


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
  const {email, password} = Object.fromEntries(formData.entries());
  console.log("email", email);

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email as string,
    password: password as string,
  });

  if (error) {
    console.log("error", error);  
    return redirect("/login-error");
  }

  if (data?.user) {
    console.log("user", data.user);
    return redirect("/journal");
  }

  console.log("something went wrong");
  return null;

//   console.log("action function");
//   const userResponse = await supabase.auth.getUser();

//   if (!userResponse?.data?.user) {
//     return redirect("/not-authorized");
//   }
//   return redirect("/logged-in");
}
