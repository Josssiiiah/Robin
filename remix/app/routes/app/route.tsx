import React from "react";
import { useLoaderData } from "@remix-run/react";
import { createClient } from "@supabase/supabase-js";

// Example loader function that fetches data from a server
export async function loader() {
    // // Replace <your-server-ip> with your server's IP address
    // const res = await fetch("http://127.0.0.1:5000");
    // // Assuming the server responds with JSON data
    // const data = await res.json();
    
    // return data; // Return the fetched data to the component
   
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
        throw new Error("Please provide a SUPABASE_URL and SUPABASE_ANON_KEY");
    }
    const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_ANON_KEY!
    )

    const {data} = await supabase.from("test").select();

    return {
        data,
    };


}

export default function App() {
    // useLoaderData hook to access the data returned by the loader
    let data: any = useLoaderData();
    
    return (
        <pre>{JSON.stringify(data, null, 2)}</pre>
        // <div>
        //     <h1>Hello moto</h1>
        //     <h1>{data.message}</h1> {/* Displaying data from the server */}
     

        //     <form action="http://127.0.0.1:5000/api/login" method="post">
        //         <input type="text" name="username" placeholder="Username" required />
        //         <input type="password" name="password" placeholder="Password" required />
        //         <button type="submit">Login</button>
        //     </form>

        //     <form action="http://127.0.0.1:5000/api/mfa" method="post">
        //         <input type="text" name="mfaToken" placeholder="MFA Token" required />
        //         <button type="submit">Submit MFA Token</button>
        //     </form>
        // </div>        
    );
}
