import { createClient } from "@supabase/supabase-js";
import { Link, useLoaderData } from "@remix-run/react";
import {
    useQuery, useMutation
  } from '@tanstack/react-query'
import { Button } from "~/components/ui/button";



export default function Login() {
    const mutation = useMutation({
        mutationFn: () => fetch("http://127.0.0.1:5000/api/login", {
            method: 'POST',
            // body: JSON.stringify({
            //     username: "josiahstanford8@gmail.com",
            //     password: "Coder1633!"
            // }),
        })
    })
    const onSubmit = () => {
        mutation.mutate()
    }

    return (
        <div className="flex h-full w-full flex-col items-center">
             <div className="flex flex-row w-full pt-2 pl-4 max-w-[1440px] items-center justify-between">
                <Button>
                <Link to="/" className="cursor-pointer no-underline">
                    back
                </Link>
                </Button>
      </div>
            <h1 className="text-5xl pt-8">Login</h1>
            <form className="pt-8" onSubmit={onSubmit}>
                <input type="text" name="username" placeholder="Username"  />
                <input type="password" name="password" placeholder="Password"  />
                <button type="submit">Login</button>
            </form>

            {/* <form action="http://127.0.0.1:5000/api/mfa" method="post">
                <input type="text" name="mfaToken" placeholder="MFA Token" required />
                <button type="submit">Submit MFA Token</button>
            </form> */}
        </div>   
    );
}