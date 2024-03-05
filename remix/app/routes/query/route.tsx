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
    // Group trades by the 'order_created_at' property
    const groupedTrades = data.message.reduce((acc: any, item: any) => {
        // Extract just the date part if necessary
        const date = item.order_created_at.split('T')[0]; // Adjust according to how you want to group them
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(item);
        return acc;
    }, {});

    return (
        <div>
            <h1 className="text-3xl">Query</h1>
            <div className="flex flex-wrap -mx-2"> {/* Use flexbox for side by side layout */}
                {Object.entries(groupedTrades).map(([date, trades], index) => (
                    <div key={index} className="w-full md:w-1/2 lg:w-1/3 px-2 mb-4"> {/* Adjust widths as needed */}
                        <div className="p-4 shadow rounded bg-white">
                            <h2 className="text-xl font-bold mb-4">{date}</h2> {/* Display the group date */}
                            {(trades as any[]).map((trade, tradeIndex) => ( // Add type annotation for trades
                                <div key={tradeIndex} className="mb-3">
                                    <p><strong>Symbol:</strong> {trade.symbol}</p>
                                    <p><strong>Order Time:</strong> {trade.order_created_at}</p>
                                    <p><strong>Price:</strong> {trade.price}</p>
                                    <p><strong>Quantity:</strong> {trade.processed_quantity}</p>
                                    <p><strong>Side:</strong> {trade.side}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>   
    );
    }
 {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
            {/* <h1>{data.message}</h1> */}