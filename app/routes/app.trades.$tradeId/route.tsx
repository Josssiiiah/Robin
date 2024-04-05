import { Link, useLoaderData } from "@remix-run/react";
import { Button } from "~/components/ui/button";

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
  const data = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col gap-12 items-center p-10 h-screen px-64">
    <div className="flex items-center text-center w-full max-w-3xl">
      <Link to="/app/tradelog" className="mr-4">
        <Button>Back</Button>
      </Link>
      <h1 className="text-4xl font-bold text-center ml-48">Trade Recap</h1>
    </div>
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-lg p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">{data!.symbol}</h2>
          <div
            className={`px-4 py-2 rounded-full font-bold ${
              data!.result === "Win" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {data!.result}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-gray-600">Opening Order</p>
            <p className="font-bold">{data!.openingOrder}</p>
          </div>
          <div>
            <p className="text-gray-600">Expiration Date</p>
            <p className="font-bold">{data!.expirationDate}</p>
          </div>
          <div>
            <p className="text-gray-600">Option Type</p>
            <p className="font-bold">{data!.optionType}</p>
          </div>
          <div>
            <p className="text-gray-600">Strike Price</p>
            <p className="font-bold">{data!.strikePrice}</p>
          </div>
          <div>
            <p className="text-gray-600">Quantity</p>
            <p className="font-bold">{data!.quantity}</p>
          </div>
          <div>
            <p className="text-gray-600">Open Price</p>
            <p className="font-bold">{data!.openPrice}</p>
          </div>
          <div>
            <p className="text-gray-600">Close Price</p>
            <p className="font-bold">{data!.closePrice}</p>
          </div>
          <div>
            <p className="text-gray-600">PnL</p>
            <p className={`font-bold ${data!.pnl >= 0 ? "text-green-600" : "text-red-600"}`}>
              {data!.pnl}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Close Date</p>
            <p className="font-bold">{data!.closeDate}</p>
          </div>
          <div>
            <p className="text-gray-600">Trade ID</p>
            <p className="font-bold">{data!.tradeId}</p>
          </div>
        </div>
        <div id="chart-container" className="mt-8"></div>
      </div>
    </div>
  );
}