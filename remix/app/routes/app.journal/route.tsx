import { LoaderFunctionArgs } from "@remix-run/node";
import { createClient } from "@supabase/supabase-js";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/components/ui/card";
import { requireAuth } from "~/sessions.server";

// -----------------------------------------------------------------------------
// LOADER FUNCTION
// -----------------------------------------------------------------------------
export async function loader({ request }: LoaderFunctionArgs) {
  return null;
}

export default function route() {
  const data = {
    "2024-03-11": {
      pnl: 124.54,
      totalTrades: 4,
      winRate: 75,
      winners: 3,
      losers: 1,
      grossPnl: 580.0,
      dayRating: "B+",
    },
    "2024-03-12": {
      pnl: -62.31,
      totalTrades: 2,
      winRate: 50,
      winners: 1,
      losers: 1,
      grossPnl: 580.0,
      dayRating: "C",
    },
    // Add more data entries as needed
  };

  return (
    <div className="flex flex-col items-center p-10 h-screen">
      <div className="flex text-center items-center justify-center">
        <h1 className="text-4xl text-black font-bold">Journal</h1>
      </div>
      <div className="flex flex-col items-center justify-center mt-8 gap-4 w-full px-[250px]">
        {Object.entries(data).map(([date, values]) => (
          <div key={date} className="w-full bg-white rounded-xl shadow-md">
            <div className="flex items-center justify-between p-4 bg-gray-100 rounded-t-lg">
              <h2 className="text-xl font-semibold">
                {new Date(date).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </h2>
              <p className={`text-lg font-semibold ${values.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                Net P&L: ${values.pnl.toFixed(2)}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 p-4">
              <div>
                <p>Total trades</p>
                <p className="text-lg font-semibold">{values.totalTrades}</p>
              </div>
              <div>
                <p>Winrate</p>
                <p className="text-lg font-semibold">{values.winRate}%</p>
              </div>
              <div>
                <p>Winners</p>
                <p className="text-lg font-semibold">{values.winners}</p>
              </div>
              <div>
                <p>Losers</p>
                <p className="text-lg font-semibold">{values.losers}</p>
              </div>
              <div>
                <p>Self-Rating</p>
                <p className="text-lg font-semibold">{values.dayRating}</p>
              </div>
              <div>
                <p>Gross P&L</p>
                <p className="text-lg font-semibold">${values.grossPnl.toFixed(2)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}