import React, { useState } from "react";

interface Trade {
  symbol: string;
  openingOrder: string;
  quantity: number;
  openPrice: number;
  closePrice: number;
  pnl: number;
  expirationDate: string;
  strikePrice: string;
  optionType: string; // call or put
  closeDate: string;
}

interface Question {
  id: number;
  text: string;
}

const questions: Question[] = [
  { id: 1, text: "What was your reasoning behind this trade?" },
  { id: 2, text: "What did you learn from this trade?" },
  { id: 3, text: "How would you improve your approach next time?" },
];

const TradeCard: React.FC<{ trade: Trade; questionIndex: number }> = ({
  trade,
  questionIndex,
}) => {
  const [answer, setAnswer] = useState("");

  return (
    <div className="bg-white p-8 rounded shadow-lg w-full">
      <h2 className="text-2xl font-bold mb-4">{trade.symbol}</h2>
      <p className="text-lg mb-4">{questions[questionIndex].text}</p>
      <textarea
        placeholder="Enter your answer"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        className="border border-gray-300 px-4 py-2 mt-4 w-full h-32 resize-none"
      />
    </div>
  );
};

const TradeNavigator: React.FC<{ trades: Trade[] }> = ({ trades }) => {
  const [selectedTradeIndex, setSelectedTradeIndex] = useState<number | null>(
    null
  );
  const [questionIndex, setQuestionIndex] = useState(0);

  const handleTradeClick = (index: number) => {
    setSelectedTradeIndex(index);
    setQuestionIndex(0);
  };

  const handlePrevQuestion = () => {
    setQuestionIndex((prevIndex) =>
      prevIndex === 0 ? questions.length - 1 : prevIndex - 1
    );
  };

  const handleNextQuestion = () => {
    setQuestionIndex((prevIndex) => (prevIndex + 1) % questions.length);
  };

  return (
    <div className="flex flex-col h-screen items-center justify-center p-24 px-[250px] bg-gray-200">
      <h1 className="pb-12 text-5xl font-bold">Trade Recap</h1>
      <div className="flex flex-row p-3 bg-white w-full h-full rounded-xl ">
        <div className="w-1/4 text-center bg-gray-300 rounded-lg h-full  ">
          <h2 className="text-2xl font-bold mb-4 pt-2">Trades</h2>
          <ul>
            {trades.map((trade, index) => (
              <li
                key={index}
                className={`cursor-pointer mb-2 ${
                  index === selectedTradeIndex ? "font-bold" : ""
                }`}
                onClick={() => handleTradeClick(index)}
              >
                {trade.symbol} $
                {Math.floor(Number(trade.strikePrice) * 100) / 100}
                {/* strike price */} {trade.optionType} {/* side */}{" "}
                {new Date(trade.expirationDate).toLocaleDateString("en-US", {
                  month: "2-digit",
                  day: "2-digit",
                })}
              </li>
            ))}
          </ul>
        </div>
        <div className="w-3/4 h-full rounded-lg ">
          {selectedTradeIndex !== null && (
            <>
              <TradeCard
                trade={trades[selectedTradeIndex]}
                questionIndex={questionIndex}
              />
              <div className="flex justify-between mt-4 px-24">
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                  onClick={handlePrevQuestion}
                >
                  Prev
                </button>
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                  onClick={handleNextQuestion}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default function Route() {
  const trades: Trade[] = [
    {
      symbol: "TSLA",
      openingOrder: "2024-03-13T13:44:22.087770Z",
      optionType: "call",
      expirationDate: "2024-03-15",
      strikePrice: "180.0000",
      quantity: 1,
      openPrice: 0.94,
      closePrice: 0.9,
      pnl: -3.9999999999999925,
      closeDate: "2024-03-13T13:43:29.582177Z",
    },
    {
      symbol: "QQQ",
      openingOrder: "2024-03-12T15:42:57.352212Z",
      optionType: "put",
      expirationDate: "2024-03-13",
      strikePrice: "441.0000",
      quantity: 1,
      openPrice: 1.6,
      closePrice: 1.4,
      pnl: -20.000000000000018,
      closeDate: "2024-03-12T15:16:19.443119Z",
    },
    {
      symbol: "SPY",
      openingOrder: "2024-03-11T17:15:26.116132Z",
      optionType: "call",
      expirationDate: "2024-03-11",
      strikePrice: "438.0000",
      quantity: 1,
      openPrice: 0.47,
      closePrice: 0.82,
      pnl: 35,
      closeDate: "2024-03-11T16:53:34.165093Z",
    },
  ];

  return <TradeNavigator trades={trades} />;
}
