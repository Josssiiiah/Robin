// MAIN ROUTE

import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import {
  Link,
  json,
  redirect,
  useFetcher,
  useLoaderData,
} from "@remix-run/react";
import { createServerClient, parse, serialize } from "@supabase/ssr";
import { Button } from "~/components/ui/button";

//
// LOADER FUNCTION
// -----------------------------------------------------------------------------
export async function loader({ request }: LoaderFunctionArgs) {
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

  const userResponse = await supabase.auth.getUser();

  // if (!userResponse?.data?.user) {
  //   return redirect("/login");
  // } else {
  //   return null;
  // }

  return null;
}

export default function Index() {
  return (
    <div className="flex h-full w-full flex-col items-center">
      <div className="flex w-full max-w-[1440px] flex-row items-center justify-between pl-4 pt-2">
        <div className="flex-grow"></div>
        <Button>
          <Link to="/login" className="cursor-pointer no-underline">
            Login
          </Link>
        </Button>
      </div>
      <h1 className="pt-[200px] text-5xl">
        <strong>Next-Gen Trading Journal</strong>
      </h1>
      <p className="flex items-center pt-6 text-center">
        {" "}
        TradZellaK helps you discover your strengths and weaknesses to become a{" "}
        <br />
        profitable trader with the power of journaling and analytics.{" "}
      </p>
      <div className="pt-10">
        <Button className="flex">
          <Link
            to="/journal"
            className="cursor-pointer py-[5px] text-center no-underline"
          >
            Start Journaling
          </Link>
        </Button>
      </div>
    </div>
  );
}

//
// ACTION FUNCTION
// -----------------------------------------------------------------------------
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

  return new Response("...", {
    headers,
  });
}
