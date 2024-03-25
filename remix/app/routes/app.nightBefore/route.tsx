import { useState } from 'react';

interface TradePlan {
  tickers: string[];
  notes: string[];
}

export default function NightBefore() {
  const [tickers, setTickers] = useState<string[]>(['', '', '', '', '']);
  const [notes, setNotes] = useState<string[]>(['', '', '', '', '']);
  const [savedPlan, setSavedPlan] = useState<TradePlan | null>(null);

  const handleTickerChange = (index: number, value: string) => {
    const newTickers = [...tickers];
    newTickers[index] = value;
    setTickers(newTickers);
  };

  const handleNoteChange = (index: number, value: string) => {
    const newNotes = [...notes];
    newNotes[index] = value;
    setNotes(newNotes);
  };

  const handleSavePlan = () => {
    const plan: TradePlan = {
      tickers: tickers.filter((ticker) => ticker !== ''),
      notes: notes.filter((note) => note !== ''),
    };
    setSavedPlan(plan);
    // You can also save the plan to local storage or send it to a server
  };

  return (
    <div className="flex flex-col p-10 h-screen">
      <div className="flex text-center items-center justify-center">
        <h1 className="text-4xl text-black font-bold">Night Before</h1>
      </div>
      <div className="flex flex-row">
        <div className="flex flex-1 flex-col items-center justify-center">
          <h2 className="text-black mb-4">Plan out your trades</h2>
          {tickers.map((ticker, index) => (
            <div key={index} className="mb-4">
              <input
                type="text"
                placeholder={`Ticker ${index + 1}`}
                value={ticker}
                onChange={(e) => handleTickerChange(index, e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 mr-2"
              />
              <textarea
                placeholder={`Notes for ${ticker}`}
                value={notes[index]}
                onChange={(e) => handleNoteChange(index, e.target.value)}
                className="border border-gray-300 rounded px-2 py-1"
              ></textarea>
            </div>
          ))}
          <button
            onClick={handleSavePlan}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Save Plan
          </button>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center">
          <h2 className="text-black mb-4">Execute your trade plan</h2>
          {savedPlan ? (
            <>
              <ul>
                {savedPlan.tickers.map((ticker, index) => (
                  <li key={index} className="mb-2">
                    <strong>{ticker}:</strong> {savedPlan.notes[index]}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p>No trade plan found.</p>
          )}
        </div>
      </div>
    </div>
  );
}