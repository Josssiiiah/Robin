import { Form, Link, redirect, useActionData } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { createSupabaseServerClient } from "../supabase.server";
import { ActionFunctionArgs } from "@remix-run/node";
import { destroySession, getSession } from "~/sessions.server";

// -----------------------------------------------------------------------------
// Login FUNCTION
// -----------------------------------------------------------------------------
export default function Logout() {
  return (
    <div className="flex h-full w-full flex-col items-center">
      <div className="flex flex-col w-full max-w-[1440px] items-center justify-between pl-4 pt-2">
        <h1 className="pt-[150px] pb-4 text-5xl">
          <strong>Logout</strong>
        </h1>
        <div className="bg-white p-8 rounded-lg shadow-md">
          <p className="mb-6 text-center text-gray-700">
            Are you sure you want to logout?
          </p>
          <Form method="post">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
            >
              LOGOUT
            </button>
          </Form>
        </div>
        <p className="mt-4">
          Changed your mind?{" "}
          <Link to="/" className="text-blue-600 hover:text-blue-800">
            Go Back
          </Link>
        </p>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// ACTION FUNCTION
// -----------------------------------------------------------------------------
export async function action({ request }: ActionFunctionArgs) {
  const supabase = await createSupabaseServerClient({ request });
  const session = await getSession(request.headers.get("Cookie"));

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.log(error);
    return { error: error.message };
  } else {
    console.log("sign out successful");
    return redirect("/", {
      headers: {
        "Set-Cookie": await destroySession(session),
      },
    });
  }
}
