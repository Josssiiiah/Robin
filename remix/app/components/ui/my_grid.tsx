import { useEffect, useState } from "react";

export default function MyGrid({ groupedTrades, tradesPerDay}: { groupedTrades: any, tradesPerDay: any}) {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const days = [];
  for (let i = 1; i <= daysOfWeek.length; i++) {
    days.push(
      <div
        key={i}
        className="bg-gray-200 p-2 rounded flex items-center justify-center h-[30px]"
      >
        <h2 className="text-xs">
        {daysOfWeek[i - 1]}

        </h2>
      </div>
    );
  }

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getStartingDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const startingDay = getStartingDayOfMonth(currentMonth, currentYear);
  const cells = [];

 // Empty cells
  for (let i = 0; i < startingDay; i++) {
    cells.push(<div key={`empty-${i}`} className="bg-gray-100 rounded h-[70px] w-[90px]"></div>);
  }

    // Cells with dates 
  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = `${currentYear}-${(currentMonth + 1)
      .toString()
      .padStart(2, "0")}-${i.toString().padStart(2, "0")}`;

    const tradeCount = tradesPerDay[dateStr] || 0;

    const tradeInfo = groupedTrades[dateStr];
    let profitLoss: any = null;

    if (tradeInfo) {
      profitLoss = ((tradeInfo.totalSell - tradeInfo.totalBuy) * 100).toFixed(
        2
      );
    }

    cells.push(
        <div
          key={i}
          className={`flex items-center justify-center p-4 rounded relative h-[70px] w-[90px] border-2 text-right ${
            profitLoss !== null
              ? profitLoss >= 0
                ? 'bg-green-500 border-green-400'
                : 'bg-red-500 border-red-400'
              : 'bg-gray-200'
          }`}
        >
          <p className="absolute top-0 right-0 p-[2px] text-xs text-right t">
            {i}
          </p>
          {profitLoss !== null && (
            <p className="text-white text-[1rem] text-right">
              {profitLoss >= 0 ? `$${profitLoss}` : `$${profitLoss}`}
            </p>
          )}
          {tradeCount > 0 && (
            <p className="absolute bottom-0 left-0 p-[2px] text-xs text-right text-white rounded">
              {tradeCount} trades
            </p>
          )}
        </div>
      );
          }

  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={goToPreviousMonth}
        >
          Previous Month
        </button>
        <span className="text-xl font-bold">
          {monthNames[currentMonth]} {currentYear}
        </span>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={goToNextMonth}
        >
          Next Month
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-1">{days}</div>
      <div className="grid grid-cols-7 grid-rows-5 gap-1">{cells}</div>
    </div>
  );
}
