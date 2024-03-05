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
        queryFn: () => fetch("http://127.0.0.1:5000/api/showStocks").then((res) => 
        res.json(),
        ),
    })
    if (isPending) return 'Loading...'
    if (error) return 'Error: '
    return (
        <div>
            {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
            {/* <h1>{data.message}</h1> */}
            <h1 className="text-3xl">Query</h1>
            {/* Iterate over data.message and render each object */}
            {data.message.map((item: any, index: any) => (
                <div key={index} className="mb-4 p-4 shadow rounded bg-white">
                    <p><strong>Chain Symbol:</strong> {item.chain_symbol}</p>
                    <p><strong>Order Created At:</strong> {item.order_created_at}</p>
                    <p><strong>Price:</strong> {item.price}</p>
                    <p><strong>Processed Quantity:</strong> {item.processed_quantity}</p>
                    <p><strong>Side:</strong> {item.side}</p>
                </div>
            ))}
        </div>   
    );
}
