import { redirect } from "@remix-run/node";
import { Form, Link } from "@remix-run/react";
import { createSupabaseServerClient } from "~/routes/supabase.server";

// -----------------------------------------------------------------------------
// CreateAccount FUNCTION
// -----------------------------------------------------------------------------
export default function CreateAccount() {
  return (
    <div className="flex h-full w-full flex-col items-center">
      <div className="flex flex-col w-full max-w-[1440px] items-center justify-between pl-4 pt-2">
        <h1 className="pt-[150px] pb-4 text-5xl">
          <strong>Create Account</strong>
        </h1>
        <Form method="post" className="bg-white p-8 rounded-lg shadow-md">
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
            className="w-full bg-black text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
          >
            CREATE ACCOUNT
          </button>
        </Form>
        <p className="mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:text-blue-800">
            LOGIN
          </Link>
        </p>
      </div>
    </div>
  );
}
// -----------------------------------------------------------------------------
// ACTION FUNCTION
// -----------------------------------------------------------------------------
export async function action({ request }: any) {
  const supabase = await createSupabaseServerClient({ request });

  // handle form data
  const formData = await request.formData();
  const { email, password } = Object.fromEntries(formData.entries());

  // call supabase sign up function, adds user to database
  const { data, error } = await supabase.auth.signUp({
    email: email as string,
    password: password as string,
  });

  // if error when signing up
  if (error) {
    console.log(error);
    return { error: error.message };
  }

  // if user created successfully
  else {
    console.log("User created successfully", data);
    return redirect("/login");
  }
  // return null;
}
