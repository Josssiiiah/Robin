import { Link, useLoaderData } from "@remix-run/react";
import React, { useEffect } from "react";
import { Button } from "~/components/ui/button";
import createChart from "./chart"

const data = [
  {
    symbol: "QQQ",
    openingOrder: "03-10-24",
    optionType: "put",
    expirationDate: "03-20-24",
    strikePrice: "438.00",
    quantity: 1,
    openPrice: 1.69,
    closePrice: 2.16,
    pnl: 47,
    result: "Win",
    closeDate: "03-19-24",
    tradeId: "12345",
  },
  {
    symbol: "SPY",
    openingOrder: "03-11-24",
    optionType: "call",
    expirationDate: "03-15-24",
    strikePrice: "510.00",
    quantity: 2,
    openPrice: 0.6,
    closePrice: 0.68,
    pnl: 16,
    result: "Win",
    closeDate: "03-15-24",
    tradeId: "12346",
  },
  {
    symbol: "QQQ",
    openingOrder: "03-12-24",
    optionType: "call",
    expirationDate: "03-14-24",
    strikePrice: "441.00",
    quantity: 2,
    openPrice: 0.86,
    closePrice: 0.6,
    pnl: -22,
    result: "Loss",
    closeDate: "03-14-24",
    tradeId: "12347",
  },
  {
    symbol: "TSLA",
    openingOrder: "03-13-24",
    optionType: "call",
    expirationDate: "03-15-24",
    strikePrice: "180.00",
    quantity: 1,
    openPrice: 0.84,
    closePrice: 0.8,
    pnl: -4,
    result: "Loss",
    closeDate: "03-1-24",
    tradeId: "12348",
  },
];

export const loader = ({ params }: any) => {
  const { tradeId } = params;
  const tradeData = data.find((trade) => trade.tradeId === tradeId);
  return tradeData;
};

export default function TradeDetail() {
    const tradeData = useLoaderData<typeof loader>();
  
    useEffect(() => {
      if (tradeData) {
        const { symbol, openingOrder, closeDate } = tradeData;
        const interval = "5min"; // Adjust the interval as needed
          
        createChart(symbol, interval, document.getElementById("chart-container")!);
    }
    }, [tradeData]);
  
    if (!tradeData) {
      return <div>Trade not found</div>;
    }
  
    return (
      <div className="flex flex-col p-10 h-screen">
        {/* ... */}
        <div className="flex flex-col w-2/3">
          <h1>Yo wadd</h1>
          <div id="chart-container"></div> {/* Add a container for the chart */}
        </div>
        {/* ... */}
      </div>
    );
  }