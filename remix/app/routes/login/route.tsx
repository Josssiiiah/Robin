import { createClient } from "@supabase/supabase-js";
import { useLoaderData } from "@remix-run/react";
import {
    useQuery, useMutation
  } from '@tanstack/react-query'



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
        <div>
            <h1>Login</h1>
            <form onSubmit={onSubmit}>
                <input type="text" name="username" placeholder="Username"  />
                <input type="password" name="password" placeholder="Password"  />
                <button type="submit">Login</button>
            </form>

            {/* <form action="http://127.0.0.1:5000/api/mfa" method="post">
                <input type="text" name="mfaToken" placeholder="MFA Token" required />
                <button type="submit">Submit MFA Token</button>
            </form> */}

            <h1>Show stocks</h1>

        </div>   
    );
}