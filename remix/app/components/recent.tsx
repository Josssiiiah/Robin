import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";

const mockTrades = [
  {
    symbol: "AAPL",
    closeDate: "2023-06-01",
    pnl: 150.75,
  },
  {
    symbol: "GOOGL",
    closeDate: "2023-06-02",
    pnl: -80.5,
  },
  {
    symbol: "AMZN",
    closeDate: "2023-06-03",
    pnl: 250.25,
  },
  {
    symbol: "MSFT",
    closeDate: "2023-06-04",
    pnl: 100.0,
  },
  {
    symbol: "TSLA",
    closeDate: "2023-06-05",
    pnl: -200.0,
  },
];

export default function RecentTrades() {
  return (
    <div className="flex flex-col w-full">
      <h1 className="text-2xl font-bold text-center">Recent Trades</h1>
      <div className="px-6 w-full">
        <div className="flex text-center justify-between font-bold w-full gap-12 px-2 py-4">
          <p className="w-[120px]">Close Date</p>
          <p className="w-1/3">Symbol</p>
          <p className="w-1/3">Net P&L</p>
        </div>
        {mockTrades.map((trade, index) => (
          <div
            className="flex text-center justify-between gap-8 px-2 py-2"
            key={index}
          >
            <p className="w-[150px] pr-4">{trade.closeDate}</p>
            <p className="w-1/3 pr-6">{trade.symbol}</p>
            <p className="w-1/3">
              <span className="">{`$${trade.pnl.toFixed(2)}`}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
    // <div className="flex flex-col gap-4 w-full px-16 text-center">
    //   <h1 className="text-2xl font-bold">Recent Trades</h1>
    // <div className="border px-10 w-full">
    // <div className="flex justify-between font-bold w-full px-10 py-4">
    //   <p className="w-1/3">Close Date</p>
    //   <p className="w-1/3">Symbol</p>
    //   <p className="w-1/3">Net P&L</p>
    // </div>
    // {mockTrades.map((trade, index) => (
    //   <div className="flex justify-between px py-2" key={index}>
    //     <p className="w-1/3">{trade.closeDate}</p>
    //     <p className="w-1/3">{trade.symbol}</p>
    //     <p className="w-1/3">
    //       {trade.pnl >= 0 ? (
    //         <span className="text-green-500">{`$${trade.pnl.toFixed(2)}`}</span>
    //       ) : (
    //         <span className="text-red-500">{`-$${Math.abs(trade.pnl).toFixed(2)}`}</span>
    //       )}
    //     </p>
    //   </div>
    // ))}
    //     <div className="flex justify-center py-4">
    //       <p className="text-blue-500 cursor-pointer hover:underline">View More</p>
    //     </div>
    //   </div>
    // </div>
  );
}
