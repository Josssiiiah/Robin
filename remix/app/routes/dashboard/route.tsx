// JOURNAL ROUTE
import { Link, useLoaderData } from "@remix-run/react";
import { LoaderFunctionArgs } from "@remix-run/node";
import { useQuery } from "@tanstack/react-query";
// components
import { Calendar } from "~/components/ui/calendar";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { useToast } from "~/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import MyGrid from "~/components/ui/my_grid";
import { ToggleLeftSidebar } from "~/components/leftSidebar";

import { requireAuth } from "~/sessions.server";
import React, { useEffect, useRef } from "react";

import { createClient } from "@supabase/supabase-js";
import axios from "axios";
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
  DoughnutController,
} from "chart.js";

Chart.register(ArcElement, Tooltip, Legend, DoughnutController);

// -----------------------------------------------------------------------------
// LOADER FUNCTION
// -----------------------------------------------------------------------------
export async function loader({ request }: LoaderFunctionArgs) {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );

  // protected route
  const userid = await requireAuth(request);

  // pull in auth token
  try {
    // pull in auth token
    const { data, error } = await supabase
      .from("rh_auth")
      .select("auth_token")
      .eq("user_id", userid)
      .single();

    if (error || !data) {
      console.error("Error fetching auth token:", error);
      return { userid, stats: null, error: "Connect to Broker" };
    }

    // make request for trades
    var options = {
      method: "GET",
      url: "https://api.robinhood.com/options/orders/",
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${data!.auth_token}`,
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "en-US,en;q=1",
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Robinhood-API-Version": "1.315.0",
        Connection: "keep-alive",
        "User-Agent": "*",
      },
    };

    function processOrders(data: any) {
      const ret = [];

      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          const orders = data[key];
          if (Array.isArray(orders)) {
            // If the property value is an array, process it
            for (const order of orders) {
              if (order.state === "filled") {
                for (const leg of order.legs) {
                  const i = {
                    symbol: order.chain_symbol,
                    side: leg.side,
                    order_created_at: order.created_at,
                    price: order.price,
                    processed_quantity: order.processed_quantity,
                  };
                  ret.push(i);
                }
              }
            }
          }
        }
      }
      return ret;
    }

    const response2 = await axios(options);
    const response = processOrders(response2.data);
    const final = [];

    // Filter by last 12 days
    const now: any = new Date();
    for (const item of response) {
      const orderDate: any = new Date(item.order_created_at);
      if (now - orderDate <= 30 * 24 * 60 * 60 * 1000) {
        final.push(item);
      }
    }

    // Perform calculations on the server-side
    const groupedTrades: any = {};
    for (const item of final) {
      const date = item.order_created_at.split("T")[0]; // Extract date part
      if (!groupedTrades[date]) {
        groupedTrades[date] = { trades: [], totalBuy: 0, totalSell: 0 };
      }
      const amount =
        parseFloat(item.price) * parseFloat(item.processed_quantity);
      groupedTrades[date].trades.push(item);
      if (item.side === "buy") {
        groupedTrades[date].totalBuy += amount;
      } else {
        groupedTrades[date].totalSell += amount;
      }
    }

    const totalPnL = Object.values(groupedTrades).reduce(
      (sum: number, group: any) =>
        sum + (group.totalSell - group.totalBuy) * 100,
      0
    );
    const positivePnLDays = Object.values(groupedTrades).filter(
      (group: any) => group.totalSell - group.totalBuy > 0
    ).length;
    const averageWinLoss = totalPnL / Object.keys(groupedTrades).length;
    const tradeWinPercentage = Math.round(
      (positivePnLDays / Object.keys(groupedTrades).length) * 100
    );

    const positiveTrades = Object.values(groupedTrades).filter(
      (group: any) => group.totalSell - group.totalBuy > 0
    ).length;
    const breakEvenTrades = Object.values(groupedTrades).filter(
      (group: any) => group.totalSell - group.totalBuy === 0
    ).length;
    const negativeTrades = Object.values(groupedTrades).filter(
      (group: any) => group.totalSell - group.totalBuy < 0
    ).length;

    let netProfit = 0;
    let netLoss = 0;

    for (const group of Object.values(groupedTrades) as any[]) {
      for (const trade of group.trades) {
        const amount =
          parseFloat(trade.price) * parseFloat(trade.processed_quantity);
        if (trade.side === "sell") {
          netProfit += amount;
        } else {
          netLoss += amount;
        }
      }
    }

    const profitFactor = netLoss !== 0 ? netProfit / netLoss : 0;

    const tradesPerDay: { [date: string]: number } = Object.entries(
      groupedTrades
    ).reduce((acc: { [date: string]: number }, [date, info]: [string, any]) => {
      acc[date] = info.trades.length;
      return acc;
    }, {});

    const stats = {
      userId: userid,
      totalPnL: Math.round(totalPnL),
      positivePnLDays,
      averageWinLoss: Math.round(averageWinLoss),
      tradeWinPercentage,
      groupedTrades,
      positiveTrades,
      breakEvenTrades,
      negativeTrades,
      profitFactor,
      tradesPerDay,
    };

    console.log("Grouped Trades: ", groupedTrades);
    console.log("Specific grouped trades: ", groupedTrades["2024-03-12"]["trades"][0]);

    
    

    // console.log("Response 2:", stats);
    return { userid, stats, error: null };
  } catch (error) {
    console.error("Error in request 1:", error);
    return { userid, stats: null, error: "Failed to fetch data" };
  }
}
// -----------------------------------------------------------------------------
// Journal FUNCTION
// -----------------------------------------------------------------------------
export default function Journal() {
  const { stats, error }: { stats: any; error: string | null } =
    useLoaderData<typeof loader>();
  const { toast } = useToast();
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const profitFactorChartRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  }, []);

  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const {
    totalPnL = 0,
    positivePnLDays = 0,
    averageWinLoss = 0,
    tradeWinPercentage = 0,
    groupedTrades = {},
    positiveTrades,
    breakEvenTrades,
    negativeTrades,
    profitFactor,
    tradesPerDay = {},
  } = stats || {};

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");
      if (ctx) {
        new Chart(ctx, {
          type: "doughnut",
          data: {
            datasets: [
              {
                data: [positiveTrades, breakEvenTrades, negativeTrades],
                backgroundColor: ["#10B981", "#FCD34D", "#EF4444"],
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            circumference: 180,
            rotation: -90,
            cutout: "80%",
          },
        });
      }
    }
  }, [positiveTrades, breakEvenTrades, negativeTrades]);

  useEffect(() => {
    if (profitFactorChartRef.current) {
      const ctx = profitFactorChartRef.current.getContext("2d");
      if (ctx) {
        new Chart(ctx, {
          type: "doughnut",
          data: {
            datasets: [
              {
                data: [profitFactor, 1 - profitFactor],
                backgroundColor: ["#10B981", "#EF4444"],
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: "80%",
            plugins: {
              tooltip: {
                enabled: false,
              },
              legend: {
                display: false,
              },
            },
          },
        });
      }
    }
  }, [profitFactor]);

  // Format the selected date to match the key format in groupedTrades
  const selectedDateStr =
    date instanceof Date ? date.toISOString().split("T")[0] : "";

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
      <ToggleLeftSidebar />
      <div className="flex flex-row justify-between ">
        <Button>
          <Link to="/" className="cursor-pointer no-underline">
            Back
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button>
          <Link to="/connect" className="cursor-pointer no-underline">
            Connect
          </Link>
        </Button>
      </div>

      <div className="flex flex-row justify-between gap-6 rounded bg-white p-4 shadow">
        <div className=" border border-black flex items-center justify-center gap-8 p-4 rounded">
          {/* Positive Days */}
          <div className="flex flex-col flex-1 justify-center">
            <h1>Net P&L</h1>
            <div className="text-2xl font-bold">
              <p>{totalPnL}</p>
            </div>
          </div>
        </div>

        <div className=" border border-black flex items-center justify-center gap-8 p-4 rounded">
          {/* Positive Days */}
          <div className="flex flex-col flex-1 justify-center">
            <h1>Positive P&L Days</h1>
            <div className="text-2xl font-bold">
              <p>{positivePnLDays}</p>
            </div>
          </div>
        </div>

        <div className=" border border-black flex items-center justify-center gap-8 p-4 rounded">
          {/* Profit Factor */}
          <div className="flex flex-col flex-1 justify-center">
            <h1>Profit Factor</h1>
            <div className="text-2xl font-bold">
              <p>{profitFactor.toFixed(2)}</p>
            </div>
          </div>
          <div className="flex-1">
            <canvas
              ref={profitFactorChartRef}
              style={{ width: "100%", height: "100px" }}
            ></canvas>
          </div>
        </div>

        {/* Average Profit  */}
        <div className=" border border-black flex items-center justify-center gap-8 p-4 rounded">
          {/* Left  */}
          <div className="flex flex-col flex-1 justify-center">
            <h1>Avg Win/Loss</h1>
            {/* Trade percentage  */}
            <div className="text-2xl font-bold">
              <p>{averageWinLoss}</p>
            </div>
          </div>
        </div>

        {/* Trade Win Percentage  */}
        <div className="border border-black p-4 rounded">
          <div className="flex items-center gap-8">
            {/* Left  */}
            <div className="flex flex-col flex-1 justify-center">
              <h1>Trade Win %</h1>
              {/* Trade percentage  */}
              <div className="text-2xl font-bold">
                <p>{tradeWinPercentage}%</p>
              </div>
            </div>
            {/* Right  */}
            <div className="flex flex-col flex-1">
              {/* Chart  */}
              <div>
                <canvas
                  ref={chartRef}
                  style={{ width: "100%", height: "100px" }}
                ></canvas>
              </div>
              {/* Under text  */}
              <div className="flex justify-between text-xs">
                <div className="flex items-center">
                  <div className="text-green-500">{positiveTrades}</div>
                </div>
                <div className="flex items-center">
                  <div className="text-yellow-500">{breakEvenTrades}</div>
                </div>
                <div className="flex items-center">
                  <div className="text-red-500">{negativeTrades}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <h1 className="mb-4 text-3xl font-bold">Recent Trades</h1>
      <div className="flex flex-wrap gap-6">
        {Object.entries(groupedTrades).map(
          ([date, info]: [string, any], index) => (
            <Card
              className="border bg-slate-500 hover:border-blue-500"
              key={index}
            >
              <CardHeader>
                <CardTitle>{date}</CardTitle>
              </CardHeader>
              <div className="rounded bg-white p-4 shadow">
                <p className="mb-4">
                  {(info.totalSell - info.totalBuy) * 100 >= 0
                    ? `Profit: $${(
                        (info.totalSell - info.totalBuy) *
                        100
                      ).toFixed(2)}`
                    : `Loss: $${(
                        (info.totalSell - info.totalBuy) *
                        100
                      ).toFixed(2)}`}
                </p>
              </div>
            </Card>
          )
        )}
      </div>
      <div className="flex flex-row">
        <div className="flex flex-1 border border-blue-50">
       

          
        </div>
        <div className="flex flex-2 border border-blue-50">
          <MyGrid groupedTrades={groupedTrades} tradesPerDay={tradesPerDay} />
        </div>
      </div>
    </div>
  );
}