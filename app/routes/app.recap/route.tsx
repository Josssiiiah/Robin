import React, { useState } from "react";

interface Trade {
  symbol: string;
  openingOrder: string;
  quantity: number;
  openPrice: number;
  closePrice: number;
  pnl: number;
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
    <div className="flex h-screen items-center justify-center p-24">
        <div className="flex flex-row p-6 bg-gray-500 w-full h-full rounded-xl ">
            <div className="w-1/4 h-full border border-red-500">

            </div>
            <div className="w-3/4 h-full border border-orange-500">

            </div>

        </div>

      {/* <div className="flex w-full bg-white p-6 border border-red-500">
        <div className="w-1/4 bg-gray-200 p-4 p">
          <h2 className="text-2xl font-bold mb-4">Trades</h2>
          <ul>
            {trades.map((trade, index) => (
              <li
                key={index}
                className={`cursor-pointer mb-2 ${
                  index === selectedTradeIndex ? "font-bold" : ""
                }`}
                onClick={() => handleTradeClick(index)}
              >
                {trade.symbol}
              </li>
            ))}
          </ul>
        </div>
        <div className="w-3/4 p-8 flex flex-col items-center">
          {selectedTradeIndex !== null && (
            <>
              <TradeCard
                trade={trades[selectedTradeIndex]}
                questionIndex={questionIndex}
              />
              <div className="mt-4">
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
      </div> */}
    </div>
  );
};

export default function Route() {
  const trades: Trade[] = [
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
      symbol: "TSLA",
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
