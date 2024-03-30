import React, { useState } from "react";

const TradeCard = ({ trade }: any) => {
  return (
    <div className="bg-white p-8 rounded shadow-lg w-96">
      <h2 className="text-2xl font-bold mb-4">{trade.symbol}</h2>
      <p className="mb-2">Opening Order: {trade.openingOrder}</p>
      <p className="mb-2">Quantity: {trade.quantity}</p>
      <p className="mb-2">Open Price: {trade.openPrice}</p>
      <p className="mb-2">Close Price: {trade.closePrice}</p>
      <p className="mb-2">PnL: {trade.pnl}</p>
      <p className="mb-2">Close Date: {trade.closeDate}</p>
      <textarea
        placeholder="Enter notes"
        className="border border-gray-300 px-4 py-2 mt-4 w-full h-32 resize-none"
      />
    </div>
  );
};

const TradeNavigator = ({ trades }: any) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < trades.length - 1 ? prevIndex + 1 : prevIndex
    );
  };

  return (
    <div className="flex flex-col">
      <h1 className="text-6xl font-bold py-12 pb-24 text-center"> Recap </h1>
      <div className="flex h-full w-full items-center justify-center">
        <button
          onClick={handlePrevClick}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-8"
          disabled={currentIndex === 0}
        >
          Previous
        </button>
        <TradeCard trade={trades[currentIndex]} />
        <button
          onClick={handleNextClick}
          className="bg-blue-500 text-white px-4 py-2 rounded ml-8"
          disabled={currentIndex === trades.length - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
};
export default function Route() {
  const trades = [
    {
      symbol: "QQQ",
      openingOrder: "2024-03-20T14:17:28.355936Z",
      quantity: 1,
      openPrice: 1.69,
      closePrice: 2.16,
      pnl: 47.00000000000002,
      closeDate: "2024-03-19T19:45:27.161060Z",
    },
    {
      symbol: "SPY",
      openingOrder: "2024-03-15T17:45:28.258538Z",
      quantity: 2,
      openPrice: 0.6,
      closePrice: 0.68,
      pnl: 16.000000000000014,
      closeDate: "2024-03-15T17:44:26.097212Z",
    },
    {
      symbol: "QQQ",
      openingOrder: "2024-03-14T14:40:01.065771Z",
      quantity: 2,
      openPrice: 0.86,
      closePrice: 0.6,
      pnl: -52,
      closeDate: "2024-03-14T13:58:53.925553Z",
    },
  ];

  return <TradeNavigator trades={trades} />;
}
