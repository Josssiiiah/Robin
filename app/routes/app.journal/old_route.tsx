import { LoaderFunctionArgs } from "@remix-run/node";
import { ArcElement, Tooltip, Legend, DoughnutController } from "chart.js";
import Chart from "chart.js/auto";

import { useEffect, useRef } from "react";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";

Chart.register(ArcElement, Tooltip, Legend);

// -----------------------------------------------------------------------------
// LOADER FUNCTION
// -----------------------------------------------------------------------------
export async function loader({ request }: LoaderFunctionArgs) {
  return null;
}

// Create a separate component for the chart
const LineChart = () => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");
      if (ctx) {
        new Chart(ctx, {
          type: "line",
          data: {
            labels: ["8", "9", "10", "11", "12", "1", "2"], // lol
            datasets: [
              {
                label: "Profit",
                data: [65, 59, 80, 81, 56, 55, 40],
                fill: true,
                borderColor: "rgb(0,0,0)",
                tension: 0.1,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
              },
            },
            plugins: {
              tooltip: {
                enabled: true,
              },
              legend: {
                display: false,
              },
            },
          },
        });
      }
    }
  }, []);

  return (
    <canvas ref={chartRef} style={{ width: "100%", height: "200px" }}></canvas>
  );
};

export default function route() {
  const data = {
    "2024-03-11": {
      pnl: 124.54,
      totalTrades: 4,
      winRate: 75,
      winners: 3,
      losers: 1,
      grossPnl: 5.0,
      dayRating: "B+",
    },
    "2024-03-12": {
      pnl: -62.31,
      totalTrades: 2,
      winRate: 50,
      winners: 1,
      losers: 1,
      grossPnl: 5.0,
      dayRating: "C",
    },
    "2024-03-13": {
      pnl: 224.72,
      totalTrades: 2,
      winRate: 50,
      winners: 2,
      losers: 1,
      grossPnl: 5.0,
      dayRating: "A-",
    },
    "2024-03-14": {
      pnl: 22.31,
      totalTrades: 2,
      winRate: 50,
      winners: 1,
      losers: 3,
      grossPnl: 5.0,
      dayRating: "B+",
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
            <div className="flex items-center p-4 bg-gray-100 rounded-t-lg">
              <h2 className="text-xl font-bold">
                {new Date(date).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </h2>
              <p
                className={`text-xl font-semibold pl-6 ${
                  values.pnl >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                Net P&L: ${values.pnl.toFixed(2)}
              </p>
              <Button className="ml-auto">Open journal</Button>
            </div>
            <div>
              {/* Chart */}
              <div className="flex flex-row gap-12 py-6 px-6">
                <div className="flex-2 pl-10">
                  <LineChart />
                </div>

                <div className="flex-1 grid grid-cols-3 gap-4 px-6 pr-6">
                  <div className="flex flex-col">
                    <div className="flex flex-row justify-between pr-16">
                      <p className="text-xl text-slate-600">Total trades</p>
                      <p className="text-xl font-bold">{values.totalTrades}</p>
                    </div>
                    <div className="flex flex-row justify-between pr-16 pt-24">
                      <p className="text-xl  text-slate-600">Winrate</p>
                      <p className="text-xl font-bold">{values.winRate}%</p>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex flex-row justify-between pr-16">
                      <p className="text-xl text-slate-600">Winners</p>
                      <p className="text-xl font-bold">{values.winners}</p>
                    </div>
                    <div className="flex flex-row justify-between pr-16 pt-24">
                      <p className="text-xl text-gray ">Losers</p>
                      <p className="text-xl font-bold">{values.losers}</p>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex flex-row justify-between pr-16">
                      <p className="text-xl text-slate-600">Self-Rating</p>
                      <p className="text-xl font-bold">{values.dayRating}</p>
                    </div>
                    <div className="flex flex-row justify-between pr-16 pt-24">
                      <p className="text-xl  text-slate-600">Commissions</p>
                      <p className="text-xl font-bold">
                        ${values.grossPnl.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
