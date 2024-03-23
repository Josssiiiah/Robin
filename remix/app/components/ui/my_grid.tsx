import { useState } from "react";

export default function MyGrid({ groupedTrades }: { groupedTrades: any }) {
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
        className="bg-gray-200 p-2 rounded-lg flex items-center justify-center h-12"
      >
        {daysOfWeek[i - 1]}
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

  for (let i = 0; i < startingDay; i++) {
    cells.push(<div key={`empty-${i}`} className="bg-gray-100"></div>);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = `${currentYear}-${(currentMonth + 1)
      .toString()
      .padStart(2, "0")}-${i.toString().padStart(2, "0")}`;
    const tradeInfo = groupedTrades[dateStr];
    let profitLoss: any = null;

    if (tradeInfo) {
      profitLoss = ((tradeInfo.totalSell - tradeInfo.totalBuy) * 100).toFixed(2);
    }

    cells.push(
      <div key={i} className="bg-gray-200 p-4 rounded-lg h-24 relative">
        <p className="absolute top-0 right-0 m-2">{i}</p>
        {profitLoss !== null && (
          <p className={`text-${profitLoss >= 0 ? "green" : "red"}-500`}>
            {profitLoss >= 0 ? `Profit: $${profitLoss}` : `Loss: $${profitLoss}`}
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