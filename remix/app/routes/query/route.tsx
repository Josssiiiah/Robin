import React, { useEffect, useState } from "react";
import { useLoaderData } from "@remix-run/react";
import { createClient } from "@supabase/supabase-js";
import { asc } from "drizzle-orm";
import {
    useQuery, useMutation
  } from '@tanstack/react-query'


export default function query() {
    const {data, isPending, error } = useQuery({
        queryKey: ['test'],
        queryFn: () => fetch("http://127.0.0.1:5000/api/simple").then((res) => 
        res.json(),
        ),
    })
    if (isPending) return 'Loading...'
    if (error) return 'Error: '
    return (
        <div>
            {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
            <h1>{data.message}</h1>
        </div>   
    );
}
