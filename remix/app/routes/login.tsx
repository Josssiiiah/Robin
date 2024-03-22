import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { Form, Link, useSubmit, useActionData } from "@remix-run/react";
import { createSupabaseServerClient } from "./supabase.server";
import { commitSession, getSession } from "~/sessions.server";
import { useToast } from "~/components/ui/use-toast";
import { useEffect } from "react";

// -----------------------------------------------------------------------------
// Login FUNCTION
// -----------------------------------------------------------------------------
export default function Login() {
  const { toast } = useToast();
  const submit = useSubmit();
  const actionData = useActionData<typeof action>();

  useEffect(() => {
    if (actionData?.error) {
      toast({
        title: "Login Failed",
        description: actionData.error,
        variant: "destructive",
      });
    }
  }, [actionData, toast]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submit(event.currentTarget, { method: "post" });
  };

  return (
    <div className="flex h-full w-full flex-col items-center">
      <div className="flex flex-col w-full max-w-[1440px] items-center justify-between pl-4 pt-2">
        <h1 className="pt-[150px] pb-4 text-5xl">
          <strong> Login </strong>
        </h1>
        <Form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-lg shadow-md"
        >
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 font-bold mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 font-bold mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
          >
            LOGIN
          </button>
        </Form>
        <p className="mt-4">
          Don't have an account?{" "}
          <Link
            to="/create-account"
            className="text-blue-600 hover:text-blue-800"
          >
            CREATE ACCOUNT
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
    return { error: error.message };
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
  } else {
    console.log("something went wrong");
    return null;
  }
}
