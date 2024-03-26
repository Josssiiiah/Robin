import { useState } from 'react';
// components
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';

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
      <div className="flex flex-row gap-8 px-32 py-12">
        <div className="flex flex-1 flex-col items-center justify-center py-8 bg-white rounded-xl">
          <h2 className="text-black mb-4 font-bold text-3xl py-4">Plan out your trades</h2>
          {tickers.map((ticker, index) => (
            <div key={index} className="flex gap-4 mb-4">
              <Input
                type="text"
                placeholder={`Ticker ${index + 1}`}
                value={ticker}
                onChange={(e) => handleTickerChange(index, e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 w-1/2"
              />
              <Textarea
                placeholder={`Notes for ${ticker}`}
                value={notes[index]}
                onChange={(e) => handleNoteChange(index, e.target.value)}
                className="border border-gray-300 rounded px-2 py-1"
              ></Textarea>
            </div>
          ))}
          <button
            onClick={handleSavePlan}
            className="bg-black text-white px-4 py-2 rounded"
          >
            Save Plan
          </button>
        </div>
        <div className="flex flex-1 flex-col items-center py-8 bg-white rounded-xl">
          <h2 className="text-black mb-4 font-bold text-3xl py-4">Execute your trade plan</h2>
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