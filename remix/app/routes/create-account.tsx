import {
  redirect,
} from "@remix-run/node";
import { Form, Link} from "@remix-run/react";
import { createSupabaseServerClient } from "~/routes/supabase";

// -----------------------------------------------------------------------------
// CreateAccount FUNCTION
// -----------------------------------------------------------------------------
export default function CreateAccount() {

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Welcome to Remix - CREATE ACCOUNT PAGE</h1>
      {/* send create account inputs to action  */}
      <Form method="post">
        <input type="email" name="email" placeholder="username" />
        <input type="password" name="password" placeholder="password" />
        <button type="submit">CREATE ACCOUNT</button>
      </Form>
      <Link to="/login">CANCEL</Link>
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
