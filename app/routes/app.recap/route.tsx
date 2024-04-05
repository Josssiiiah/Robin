import React, { useState } from "react";
import { Textarea } from "~/components/ui/textarea";
import { Chart } from "./chartComponent";

interface Question {
  id: number;
  text: string;
  info: string;
  chartData: { time: string; value: number }[];
  ticker: string;
  entryPrice: number;
  exitPrice: number;
  tradeType: string;
  profit: number;
}

const questions: Question[] = [
  {
    id: 1,
    text: "What was your strategy for this trade?",
    info: "Consider your entry and exit points, risk management, and overall plan.",
    chartData: [
      { time: "2018-12-22", value: 32.51 },
      { time: "2018-12-23", value: 31.11 },
      { time: "2018-12-24", value: 27.02 },
      { time: "2018-12-25", value: 27.32 },
      { time: "2018-12-26", value: 25.17 },
    ],
    ticker: "AAPL",
    entryPrice: 150.23,
    exitPrice: 155.67,
    tradeType: "Long",
    profit: 543.21,
  },
  {
    id: 2,
    text: "How were you feeling emotionally during this trade?",
    info: "Reflect on the aspects of your strategy that proved effective.",
    chartData: [
      { time: "2018-12-27", value: 28.89 },
      { time: "2018-12-28", value: 25.46 },
      { time: "2018-12-29", value: 23.92 },
      { time: "2018-12-30", value: 22.68 },
      { time: "2018-12-31", value: 22.67 },
    ],
    ticker: "TSLA",
    entryPrice: 750.0,
    exitPrice: 800.5,
    tradeType: "Short",
    profit: -1250.75,
  },
  {
    id: 3,
    text: "What could you have done better in this trade?",
    info: "Identify areas for improvement and potential adjustments for future trades.",
    chartData: [
      { time: "2019-01-01", value: 24.51 },
      { time: "2019-01-02", value: 26.33 },
      { time: "2019-01-03", value: 28.74 },
      { time: "2019-01-04", value: 27.56 },
      { time: "2019-01-05", value: 29.82 },
    ],
    ticker: "AMZN",
    entryPrice: 3200.0,
    exitPrice: 3250.25,
    tradeType: "Long",
    profit: 1005.5,
  },
  // Add more questions as needed
];

export default function TradeRecap() {
  const [started, setStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [currentAnswer, setCurrentAnswer] = useState("");

  const handleStartRecap = () => {
    setStarted(true);
  };

  const handleSubmitAnswer = () => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questions[currentQuestionIndex].id]: currentAnswer,
    }));
    setCurrentAnswer("");
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  return (
    <div className="flex flex-col gap-12 min-h-screen items-center p-10 bg-gray-100 ">
      <h1 className="font-bold text-4xl">Recap</h1>
      <div className="max-w-6xl w-full bg-white rounded-lg shadow-lg p-8">
        {!started ? (
          <div className="flex items-center justify-center h-80">
            <button
              className="bg-black text-white px-6 py-3 rounded-md text-xl font-semibold hover:bg-gray-600 transition duration-200"
              onClick={handleStartRecap}
            >
              Start Recap
            </button>
          </div>
        ) : currentQuestionIndex < questions.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left side */}
            <div>
              <h2 className="text-2xl font-bold mb-4">
                Question {currentQuestionIndex + 1} of {questions.length}
              </h2>
              <h3 className="text-xl font-semibold mb-2">
                {questions[currentQuestionIndex].text}
              </h3>
              <Textarea
                className="w-full h-60 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none mb-4"
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
              />
              <button
                className="bg-black text-white px-6 py-2 rounded-md font-semibold hover:bg-gray-600 transition duration-200"
                onClick={handleSubmitAnswer}
              >
                Submit
              </button>
              {/* Progress indicator */}
              {started && currentQuestionIndex < questions.length && (
                <div className="mt-8 flex items-center justify-center space-x-2">
                  {questions.map((_, index) => (
                    <div
                      key={index}
                      className={`w-4 h-4 rounded-full ${
                        index === currentQuestionIndex
                          ? "bg-blue-500"
                          : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
            {/* Right side */}
            <div>
              <h3 className="text-2xl font-bold mb-4">
                {questions[currentQuestionIndex].ticker}
              </h3>
              <Chart data={questions[currentQuestionIndex].chartData} />
              <div className="mt-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <h3 className="font-bold">Entry Price:</h3>
                    <p>
                      ${questions[currentQuestionIndex].entryPrice.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-bold">Exit Price:</h3>
                    <p>
                      ${questions[currentQuestionIndex].exitPrice.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-bold">Trade Type:</h3>
                    <p>{questions[currentQuestionIndex].tradeType}</p>
                  </div>
                  <div>
                    <h3 className="font-bold">Profit/Loss:</h3>
                    <p
                      className={`${
                        questions[currentQuestionIndex].profit >= 0
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      ${questions[currentQuestionIndex].profit.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-col h-full">
            <h2 className="text-2xl font-bold mb-4 text-center">
              Recap Completed!
            </h2>
            <div className="space-y-4">
              {questions.map((question) => (
                <div key={question.id}>
                  <p className="font-semibold">{question.text}</p>
                  <p>{answers[question.id]}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
