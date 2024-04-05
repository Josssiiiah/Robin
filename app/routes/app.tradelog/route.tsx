import React, { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Link } from "@remix-run/react";
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
  DoughnutController,
} from "chart.js";

Chart.register(ArcElement, Tooltip, Legend, DoughnutController);

export default function Route() {
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
  ];

  const columns = useMemo(
    () => [
      { header: "Open Date", accessorKey: "openingOrder" },
      { header: "Symbol", accessorKey: "symbol" },
      { header: "Result", accessorKey: "result" },
      { header: "Close Date", accessorKey: "closeDate" },
      { header: "Open Price", accessorKey: "openPrice" },
      { header: "Close Price", accessorKey: "closePrice" },
      { header: "Quantity", accessorKey: "quantity" },
      { header: "P/L", accessorKey: "pnl" },
      { header: "Type", accessorKey: "optionType" },
      { header: "Strike Price", accessorKey: "strikePrice" },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  // Calculate the stats
  const netCumulativePnL = data.reduce((sum, trade) => sum + trade.pnl, 0);
  const totalWins = data.filter((trade) => trade.result === "Win").length;
  const totalLosses = data.filter((trade) => trade.result === "Loss").length;
  const profitFactor = totalWins / (totalWins + totalLosses);
  const tradeWinPercentage = (totalWins / data.length) * 100;
  const avgWinLossTrade = netCumulativePnL / data.length;

  const chartRef = React.useRef<HTMLCanvasElement>(null);
  const profitFactorChartRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");
      if (ctx) {
        new Chart(ctx, {
          type: "doughnut",
          data: {
            datasets: [
              {
                data: [totalWins, totalLosses],
                backgroundColor: ["#10B981", "#EF4444"],
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            circumference: 180,
            rotation: -90,
            cutout: "80%",
          },
        });
      }
    }
  }, [totalWins, totalLosses]);

  React.useEffect(() => {
    if (profitFactorChartRef.current) {
      const ctx = profitFactorChartRef.current.getContext("2d");
      if (ctx) {
        new Chart(ctx, {
          type: "doughnut",
          data: {
            datasets: [
              {
                data: [profitFactor, 1 - profitFactor],
                backgroundColor: ["#10B981", "#EF4444"],
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: "80%",
            plugins: {
              tooltip: {
                enabled: false,
              },
              legend: {
                display: false,
              },
            },
          },
        });
      }
    }
  }, [profitFactor]);

  return (
    <div className="flex flex-col gap-12 items-center p-10 h-screen px-64">
      <h1 className="font-bold text-4xl">Trade Log</h1>
      <div className="grid grid-cols-2 gap-4 w-full">
        <div className="bg-white p-4 rounded-xl shadow-xl">
          <h2 className="text-lg font-bold">Net Cumulative P&L</h2>
          <p className="text-2xl">{netCumulativePnL.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-xl flex items-center">
          <div>
            <h2 className="text-lg font-bold">Profit Factor</h2>
            <p className="text-2xl">{profitFactor.toFixed(2)}</p>
          </div>
          <div className="ml-4">
            <canvas ref={profitFactorChartRef} width="100" height="100" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-xl flex items-center">
          <div>
            <h2 className="text-lg font-bold">Trade Win %</h2>
            <p className="text-2xl">{tradeWinPercentage.toFixed(2)}%</p>
          </div>
          <div className="ml-4">
            <canvas ref={chartRef} width="100" height="50" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-xl">
          <h2 className="text-lg font-bold">Avg Win/Loss Trade</h2>
          <p className="text-2xl">{avgWinLossTrade.toFixed(2)}</p>
        </div>
      </div>
      <div className="flex bg-white shadow-xl w-full rounded-xl">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead className="text-lg" key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : (header.column.columnDef.header as React.ReactNode)}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell className="text-center" key={cell.id}>
                    <Link to={`/app/trades/${row.original.tradeId}`}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </Link>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
