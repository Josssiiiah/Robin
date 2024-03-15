import { Form, redirect, useActionData } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { createSupabaseServerClient } from "./supabase";
import { ActionFunctionArgs } from "@remix-run/node";
import { commitSession, destroySession, getSession } from "~/sessions.server";


// -----------------------------------------------------------------------------
// Login FUNCTION
// -----------------------------------------------------------------------------
export default function Logout() {
  return (
    <div className="flex h-full w-full flex-col items-center">
      logout
      {/* trigger action  */}
      <Form method="post">
        <Button type="submit">LOGOUT</Button>
      </Form>
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
  }
  else {
    console.log("sign out successful")
    return redirect("/", {
      headers: {
        "Set-Cookie": await destroySession(session),
      },
    });
  }
}
