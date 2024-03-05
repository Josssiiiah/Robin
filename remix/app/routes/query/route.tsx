import React, { useEffect, useState } from "react";
import { useLoaderData } from "@remix-run/react";
import { createClient } from "@supabase/supabase-js";
import { asc } from "drizzle-orm";
import {useQuery, useMutation } from '@tanstack/react-query'
import { Calendar } from "~/components/ui/calendar";

interface Trade {
    order_created_at: string;
    price: string;
    processed_quantity: string;
    side: 'buy' | 'sell';
  }
  
  interface TradeGroup {
    trades: Trade[];
    totalBuy: number;
    totalSell: number;
  }
  
  interface GroupedTrades {
    [key: string]: TradeGroup;
  }

export default function query() {
    const [date, setDate] = React.useState<Date | undefined>(new Date())

  const { data, isPending, error } = useQuery({
        queryKey: ['test'],
        queryFn: () => fetch("http://127.0.0.1:5000/api/showStocks").then((res) => 
        res.json(),
        ),
    })
    if (isPending) return 'Loading...'
    if (error) return 'Error: '
    if (!data || !data.message) return 'No data found';

      // Group trades by the 'order_created_at' property and calculate profit/loss
      // Dynamically calculate and group trades by date
    const groupedTrades = data.message.reduce((trade_dict: any, item: any) => {
        const date = item.order_created_at.split('T')[0]; // Extract date part
        if (!trade_dict[date]) {
            trade_dict[date] = { trades: [], totalBuy: 0, totalSell: 0 };
        }
        const amount = parseFloat(item.price) * parseFloat(item.processed_quantity);
        trade_dict[date].trades.push(item);
        if (item.side === 'buy') {
            trade_dict[date].totalBuy += amount;
        } else {
            trade_dict[date].totalSell += amount;
        }
        return trade_dict;
    }, {});

     // Format the selected date to match the key format in groupedTrades
        const selectedDateStr = date instanceof Date ? date.toISOString().split('T')[0] : '';

        // Find the P&L for the selected date
        const pnl = groupedTrades[selectedDateStr] ? ((groupedTrades[selectedDateStr].totalSell - groupedTrades[selectedDateStr].totalBuy) * 100).toFixed(2) : null;

        // Calculate total PnL for all trades
        const totalPnL = Object.values(groupedTrades).reduce((total: number, group: any) => {
            return (total + (group.totalSell - group.totalBuy) * 100);
        }, 0);

        // Calculate the number of days with positive P&L
        const positivePnLDays = Object.values(groupedTrades as Record<string, { totalSell: number; totalBuy: number }>).reduce((count: number, group) => {
            if (group.totalSell - group.totalBuy > 0) {
                return count + 1;
            }
            return count;
        }, 0);
        

    return (
        <div>
            <h1 className="text-3xl font-bold mb-4">Stats</h1>
            <div className="mb-4 bg-white shadow rounded p-4">
                <h2 className="font-bold text-xl">Total Profit/Loss</h2>
                <p>${totalPnL.toFixed(2)}</p>
                <h2 className="font-bold text-xl">Positive Days</h2>
                <p>{positivePnLDays.toFixed(2)}</p>
                
            </div>

            <h1 className="text-3xl font-bold mb-4">Recent Trades</h1>
            <div className="flex flex-wrap">
                {Object.entries(groupedTrades).map(([date, info]: [string, any], index) => (
                    <div key={index} className="w-full md:w-1/2 lg:w-1/3 p-2">
                        <div className="bg-white shadow rounded p-4">
                            <h2 className="font-bold text-xl mb-2">{date}</h2>
                            <p className="mb-4">Profit/Loss: ${((info.totalSell - info.totalBuy) * 100).toFixed(2)}</p>
                            {/* {info.trades.map((trade: any, tradeIndex: any) => (
                                <div key={tradeIndex} className="mb-3">
                                    <p>Symbol: {trade.symbol}</p>
                                    <p>Order Time: {trade.order_created_at}</p>
                                    <p>Price: {trade.price}</p>
                                    <p>Quantity: {trade.processed_quantity}</p>
                                    <p>Side: {trade.side}</p>
                                </div>
                            ))} */}
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex flex-row">
                <div>
                    <h1 className="text-3xl font-bold mb-4">Calender</h1>
                    {/* Display Calendar here */}
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-md border"
                    />
                </div>
                {/* Conditional rendering of the P&L card */}
                {pnl && (
                    <div className="mt-4 md:mt-0 md:ml-4 bg-white shadow rounded p-4">
                        <h2 className="font-bold text-xl mb-2">Profit/Loss for {selectedDateStr}</h2>
                        <p>Profit/Loss: ${pnl}</p>
                    </div>
                )}
            </div>         
        </div>
    );
}
