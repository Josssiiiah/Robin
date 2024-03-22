// JOURNAL ROUTE
import { Link, useLoaderData } from "@remix-run/react";
import { LoaderFunctionArgs } from "@remix-run/node";
import { useQuery } from "@tanstack/react-query";
import { Calendar } from "~/components/ui/calendar";
import { Textarea } from "~/components/ui/textarea";
import { Card, CardHeader, CardTitle } from "~/components/ui/card";
import { requireAuth } from "~/sessions.server";
import React, { useEffect } from "react";
import { Button } from "~/components/ui/button";
import { useToast } from "~/components/ui/use-toast";

// -----------------------------------------------------------------------------
// LOADER FUNCTION
// -----------------------------------------------------------------------------
export async function loader({ request }: LoaderFunctionArgs) {
  // protected route
  const userid = await requireAuth(request);
  return { userid };
}

// -----------------------------------------------------------------------------
// Journal FUNCTION
// -----------------------------------------------------------------------------
export default function Journal() {
  const userid = useLoaderData<typeof loader>();
  const { toast } = useToast();

  const [date, setDate] = React.useState<Date | undefined>(new Date());
  // get trading data from Robinhood
  const { data, isPending, error } = useQuery({
    queryKey: ["test"],
    queryFn: () =>
      fetch("http://127.0.0.1:5000/api/showStocks", {
        method: "POST",
        body: JSON.stringify({ userid }),
      }).then((res) => res.json()),
  });
  useEffect(() => {
    if (!data) {
      toast({
        title: "No Data",
        description: "Log into your broker to see data",
        variant: "destructive",
      });
    }
  }, [data, toast]);
  console.log("data", data);

  const {
    totalPnL = 0,
    positivePnLDays = 0,
    averageWinLoss = 0,
    tradeWinPercentage = 0,
    groupedTrades = {},
  } = data || {};

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
            <h2 className="mb-2 text-xl font-bold">
              Profit/Loss for {selectedDateStr}
            </h2>
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
