// JOURNAL ROUTE
import React, { useEffect, useState } from "react";
import { useLoaderData } from "@remix-run/react";
import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { createClient } from "@supabase/supabase-js";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Calendar } from "~/components/ui/calendar";
import { Textarea } from "~/components/ui/textarea";
import { Card, CardHeader, CardTitle } from "~/components/ui/card";
import { createServerClient, parse, serialize } from "@supabase/ssr";
import { createSupabaseServerClient } from "../supabase.server";
import { requireAuth } from "~/sessions.server";

// -----------------------------------------------------------------------------
// LOADER FUNCTION
// -----------------------------------------------------------------------------
export async function loader({ request }: LoaderFunctionArgs) {
  // protected route
  const userid = await requireAuth(request);
  console.log(userid);
  return null;
}

// -----------------------------------------------------------------------------
// Journal FUNCTION
// -----------------------------------------------------------------------------
export default function Journal() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  // get trading data from Robinhood
  const { data, isPending, error } = useQuery({
    queryKey: ["test"],
    queryFn: () =>
      fetch("http://127.0.0.1:5000/api/showStocks").then((res) => res.json()),
  });
   if (error) return "Error: ";
   console.log("data", data);

   const {
    totalPnL = 0,
    positivePnLDays = 0,
    averageWinLoss = 0,
    tradeWinPercentage = 0,
    groupedTrades = {},
  } = data || {};

 // Format the selected date to match the key format in groupedTrades
  const selectedDateStr = date instanceof Date ? date.toISOString().split("T")[0] : "";

  // Find the P&L for the selected date
  const pnl = groupedTrades[selectedDateStr]
    ? (
        (groupedTrades[selectedDateStr].totalSell -
          groupedTrades[selectedDateStr].totalBuy) *
        100
      ).toFixed(2)
    : null;

  return (
    <div className="items-left flex flex-col gap-8 bg-slate-400 p-10">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="flex flex-row gap-6 rounded bg-white p-4 shadow">
        <div className="rounded bg-slate-500 p-4 shadow">
          <h2 className="text-lg font-semibold">Total P&L</h2>
          <p className="text-xl">{totalPnL}</p>
        </div>
        <div className="rounded bg-slate-500 p-4 shadow">
          <h2 className="text-lg font-semibold">Positive P&L Days</h2>
          <p className="text-xl">{positivePnLDays}</p>
        </div>
        <div className="rounded bg-slate-500 p-4 shadow">
          <h2 className="text-lg font-semibold">Average Win/Loss</h2>
          <p className="text-xl">{averageWinLoss}</p>
        </div>
        <div className="rounded bg-slate-500 p-4 shadow">
          <h2 className="text-lg font-semibold">Trade Win Percentage</h2>
          <p className="text-xl">{tradeWinPercentage}%</p>
        </div>
      </div>

      <h1 className="mb-4 text-3xl font-bold">Recent Trades</h1>
      <div className="flex flex-wrap gap-6">
        {Object.entries(groupedTrades).map(([date, info]: [string, any], index) => (
          <Card className="border bg-slate-500 hover:border-blue-500" key={index}>
            <CardHeader>
              <CardTitle>{date}</CardTitle>
            </CardHeader>
            <div className="rounded bg-white p-4 shadow">
              <p className="mb-4">
                {(info.totalSell - info.totalBuy) * 100 >= 0
                  ? `Profit: $${((info.totalSell - info.totalBuy) * 100).toFixed(2)}`
                  : `Loss: $${((info.totalSell - info.totalBuy) * 100).toFixed(2)}`}
              </p>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex flex-row">
        <div>
          <h1 className="mb-4 text-3xl font-bold">Calendar</h1>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
        </div>
        {pnl && (
          <div className="mt-4 rounded bg-white p-4 shadow md:ml-4 md:mt-0">
            <h2 className="mb-2 text-xl font-bold">Profit/Loss for {selectedDateStr}</h2>
            <p>Profit/Loss: ${pnl}</p>
            <div className="pt-4">
              <Textarea placeholder="Type your message here." />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}